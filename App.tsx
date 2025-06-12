
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FileNode, NodeType } from './types';
import { 
    // DOCUSAURUS_STRUCTURE, // Supprimé
    TekBotLogo, 
    HamburgerIcon,
    TrophyIcon,
    CalendarIcon
} from './constants';
import Sidebar from './components/Sidebar';
import { marked } from 'marked';

interface AppContent {
  title: string;
  subtitle?: string;
  pillText?: string;
  sections: { id: string; title: string; html: string; icon?: React.FC<{className?: string}> }[];
  rawHtml?: string; 
}

const App: React.FC = () => {
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>('file-accueil-md');
  const [appContent, setAppContent] = useState<AppContent | null>(null);
  const [isLoadingManifest, setIsLoadingManifest] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchManifest = async () => {
      setIsLoadingManifest(true);
      setError(null);
      try {
        const response = await fetch('file-manifest.json'); // Changé en chemin relatif
        if (!response.ok) {
          throw new Error(`Failed to load file manifest: ${response.statusText}`);
        }
        const data = await response.json();
        // Le manifeste est attendu comme un tableau, mais si c'est un objet avec une clé racine :
        setFileStructure(data.docsRootChildren || data); // Ajuster si la structure du manifeste est différente
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred while fetching manifest.');
        setFileStructure([]); // Assurer que fileStructure est un tableau vide en cas d'erreur
      } finally {
        setIsLoadingManifest(false);
      }
    };
    fetchManifest();
  }, []);

  const findFileNodeById = useCallback((nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFileNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);
  
  const selectedFileNode = useMemo(() => {
    if (!fileStructure || fileStructure.length === 0) return null;
    return findFileNodeById(fileStructure, selectedFileId);
  }, [selectedFileId, fileStructure, findFileNodeById]);

  useEffect(() => {
    if (selectedFileNode && selectedFileNode.type === NodeType.FILE && selectedFileNode.name.endsWith('.md')) {
      const fetchFileContent = async () => {
        setIsLoadingContent(true);
        setError(null);
        setAppContent(null); 
        try {
          const response = await fetch(selectedFileNode.path);
          if (!response.ok) {
            throw new Error(`Failed to load file content from ${selectedFileNode.path}: ${response.statusText}`);
          }
          const markdownContent = await response.text();
          
          const parsedHtml = marked.parse(markdownContent) as string;
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = parsedHtml;

          if (selectedFileNode.id === 'file-accueil-md' || selectedFileNode.id === 'file-intro-md') {
            const mainTitle = tempDiv.querySelector('.content-title-main')?.textContent || selectedFileNode.name.replace('.md', '');
            const subtitle = tempDiv.querySelector('.content-subtitle')?.textContent || undefined;
            const pillText = tempDiv.querySelector('.content-pill')?.textContent || undefined;
            
            tempDiv.querySelector('.content-title-main')?.remove();
            tempDiv.querySelector('.content-subtitle')?.remove();
            tempDiv.querySelector('.content-pill')?.remove();

            const sections: AppContent['sections'] = [];
            tempDiv.querySelectorAll('h2').forEach((h2, index) => {
              let sectionHtml = '';
              let currentElement = h2.nextElementSibling;
              while (currentElement && currentElement.tagName !== 'H2') {
                sectionHtml += currentElement.outerHTML;
                currentElement = currentElement.nextElementSibling;
              }
              
              let icon = undefined;
              if (h2.textContent?.includes('🏆')) icon = TrophyIcon;
              if (h2.textContent?.includes('📅')) icon = CalendarIcon;

              sections.push({
                id: `section-${index}`,
                title: h2.textContent || `Section ${index + 1}`,
                html: sectionHtml,
                icon: icon
              });
            });
            setAppContent({ title: mainTitle, subtitle, pillText, sections });
          } else {
            setAppContent({
              title: selectedFileNode.name.replace('.md', ''),
              sections: [],
              rawHtml: parsedHtml
            });
          }
        } catch (e) {
          console.error(e);
          setError(e instanceof Error ? e.message : `Failed to load content for ${selectedFileNode.name}.`);
          setAppContent(null);
        } finally {
          setIsLoadingContent(false);
        }
      };
      fetchFileContent();
    } else if (selectedFileNode) {
        // Si ce n'est pas un fichier MD (ex: _category.json cliqué par erreur, ou un dossier)
        setAppContent({
            title: `Fichier non-MD: ${selectedFileNode.name}`,
            sections: [],
            rawHtml: `<p>Ce fichier n'est pas un document Markdown affichable ou est un dossier.</p>`
        });
        setIsLoadingContent(false);
    } else {
      setAppContent(null); // Aucun fichier sélectionné ou trouvé
      setIsLoadingContent(false);
    }
  }, [selectedFileNode]);

  const handleFileSelect = (fileNode: FileNode) => {
    if (fileNode.type === NodeType.FILE && fileNode.name.endsWith('.md')) {
      setSelectedFileId(fileNode.id);
    }
  };
  
  if (isLoadingManifest) {
    return <div className="flex items-center justify-center h-screen text-slate-500">Chargement de la structure des documents...</div>;
  }

  if (error && !isLoadingContent && !appContent) { // Affiche l'erreur principale si le manifeste ou le premier contenu échoue
     return <div className="flex flex-col items-center justify-center h-screen text-red-600 p-4">
       <p className="font-bold text-lg mb-2">Erreur de chargement</p>
       <p className="text-center">{error}</p>
       <p className="mt-4 text-sm text-slate-600">Veuillez vérifier que le fichier <code>file-manifest.json</code> est présent à la racine du projet et que les chemins des fichiers sont corrects.</p>
     </div>;
  }


  return (
    <div className="flex flex-col h-screen font-sans">
      <header className="app-header py-3 px-4 shadow-md flex items-center justify-between z-20">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="md:hidden mr-3 text-slate-300 hover:text-white"
            aria-label="Toggle sidebar"
          >
            <HamburgerIcon />
          </button>
          <TekBotLogo className="w-7 h-7 text-sky-400 mr-3" />
          <h1 className="text-xl font-semibold text-slate-50">TEKBOT Docs</h1>
        </div>
        <div className="text-sm font-medium text-slate-300 hidden md:block">
          TEKBOT ROBOTICS CHALLENGE 2025
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className={`app-sidebar w-72 lg:w-80 p-4 overflow-y-auto transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block absolute md:static inset-y-0 left-0 z-10 md:z-0`}>
          {fileStructure.length > 0 ? (
            <Sidebar 
              navItems={fileStructure} // Passe toute la structure chargée
              onFileSelect={handleFileSelect}
              selectedFileId={selectedFileId}
            />
          ) : (
            <p className="text-slate-500">Aucune structure de fichier chargée.</p>
          )}
        </aside>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto app-content">
          {isLoadingContent ? (
            <div className="flex items-center justify-center h-full text-slate-500">Chargement du contenu...</div>
          ) : error && appContent === null ? ( // Erreur spécifique au chargement du contenu
            <div className="text-red-500 p-4">
              <p className="font-bold">Erreur lors du chargement du contenu :</p>
              <p>{error}</p>
              <p className="mt-2 text-sm text-slate-500">Vérifiez que le fichier <code>{selectedFileNode?.path}</code> existe et est accessible.</p>
            </div>
          ) : appContent ? (
            <article>
              { (selectedFileNode?.id === 'file-accueil-md' || selectedFileNode?.id === 'file-intro-md') ? (
                <>
                  {appContent.title && <h1 className="content-title-main">{appContent.title}</h1>}
                  {appContent.subtitle && <p className="content-subtitle">{appContent.subtitle}</p>}
                  {appContent.pillText && <div className="content-pill">{appContent.pillText}</div>}
                  {appContent.sections.map(section => (
                    <section key={section.id} className="content-section" aria-labelledby={section.id + "-title"}>
                      <h2 id={section.id + "-title"} className="content-section-title">
                        {section.icon && <section.icon className="w-6 h-6 mr-3 text-amber-500" />}
                        {section.title.replace(/^[🏆📅]\s*/, '')}
                      </h2>
                      <div className="prose-custom max-w-none" dangerouslySetInnerHTML={{ __html: section.html }} />
                    </section>
                  ))}
                </>
              ) : (
                 <>
                  {appContent.title && <h1 className="prose-custom title-special">{/* Titre géré par prose-custom h1 */}</h1>}
                  <div 
                    className="prose-custom max-w-none"
                    dangerouslySetInnerHTML={{ __html: appContent.rawHtml || '' }} 
                  />
                 </>
              )}
            </article>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500 text-lg">
                {selectedFileNode ? "Chargement..." : "Sélectionnez un fichier à afficher."}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
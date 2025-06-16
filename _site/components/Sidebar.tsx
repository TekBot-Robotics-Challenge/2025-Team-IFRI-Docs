
import React from 'react';
import { FileNode } from '../types';
import SidebarItem from './SidebarItem';
import { 
    TrophyIcon,
    DocumentIcon as DocInfoIcon, // Renommé pour clarté
} from '../constants';

interface SidebarProps {
  navItems: FileNode[]; // Structure complète chargée depuis file-manifest.json (attendu comme la liste des enfants de "docs-root")
  onFileSelect: (node: FileNode) => void;
  selectedFileId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, onFileSelect, selectedFileId }) => {
  // Les IDs des éléments spéciaux sont utilisés pour les retrouver dans navItems
  const specialItemDefs: { id: string; displayName: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'file-intro-md', displayName: 'Présentation du Challenge', icon: TrophyIcon },
    { id: 'file-accueil-md', displayName: 'Accueil & Planning', icon: DocInfoIcon },
  ];

  const renderedSpecialItems: JSX.Element[] = [];
  const mainNavItems: FileNode[] = [...navItems]; // Copie pour pouvoir filtrer

  specialItemDefs.forEach(spDef => {
    const nodeIndex = mainNavItems.findIndex(item => item.id === spDef.id);
    if (nodeIndex > -1) {
      const node = mainNavItems.splice(nodeIndex, 1)[0]; // Retirer de mainNavItems
      renderedSpecialItems.push(
        <SidebarItem
            key={node.id}
            node={{...node, name: spDef.displayName}} // Surcharger le nom pour l'affichage
            level={0}
            onFileSelect={onFileSelect}
            selectedFileId={selectedFileId}
            customIcon={spDef.icon}
            isInitiallyOpen={false}
        />
      );
    }
  });


  return (
    <nav className="space-y-1">
      {renderedSpecialItems}

      {renderedSpecialItems.length > 0 && mainNavItems.length > 0 && <hr className="my-3 border-slate-300" />}
      
      {mainNavItems.map((node) => (
        // La convention de nommage pour masquer (commençant par '_') sera gérée dans SidebarItem
        <SidebarItem
          key={node.id}
          node={node}
          level={0}
          onFileSelect={onFileSelect}
          selectedFileId={selectedFileId}
          // isInitiallyOpen={node.id === 'folder-semaine-1'} // Vous pouvez ajuster cela si nécessaire
        />
      ))}

      <div className="pt-6 mt-6 border-t border-slate-300 text-xs text-slate-600">
        <h3 className="font-semibold text-slate-700 mb-2 text-sm flex items-center">
            <DocInfoIcon className="w-4 h-4 mr-2 text-slate-500" />
            Documentation
        </h3>
        <p>
            Les fichiers de cette documentation sont gérés dans le dossier <code>docs/</code> et listés dans <code>file-manifest.json</code>.
        </p>
      </div>
    </nav>
  );
};

export default Sidebar;

document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour charger automatiquement la structure des fichiers
    async function loadDocumentStructure() {
        try {
            // Structure des dossiers basée sur votre architecture réelle
            const documentStructure = await scanDocumentFiles();
            
            // Mettre à jour la sidebar avec la structure réelle
            updateDocumentationSection(documentStructure);
            
        } catch (error) {
            console.error('Erreur lors du chargement de la structure:', error);
            // Fallback vers la structure statique si l'auto-détection échoue
            loadFallbackStructure();
        }
    }

    // Fonction pour scanner les fichiers markdown - PROBLÈME ICI
    async function scanDocumentFiles() {
        // PROBLÈME: Cette fonction retourne une structure statique
        // au lieu de scanner réellement le dossier Documentation
        
        // Essayer d'abord de charger depuis le fichier généré
        if (window.getDocumentStructure) {
            return window.getDocumentStructure();
        }
        
        // Fallback vers une structure basée sur les fichiers réellement présents
        try {
            // Tenter de détecter les fichiers réels via l'API GitHub ou fetch
            const realStructure = await detectRealFileStructure();
            return realStructure;
        } catch (error) {
            console.warn('Impossible de détecter la structure réelle, utilisation du fallback');
            
            // Structure fallback basée sur vos fichiers existants
            return {
                'root': ['index.md', 'accueil.md'],
                'semaine-1': {
                    'electronique': ['gyroscope-accelerometre.md'],
                    'it': ['robot.md'],
                    'mecanique': ['documentation_meca.md']
                }
                // Plus de structure basée sur ce qui existe vraiment
            };
        }
    }

    // Nouvelle fonction pour détecter la structure réelle
    async function detectRealFileStructure() {
        const structure = {
            'root': []
        };
        
        // Essayer de charger les fichiers connus qui existent
        const knownFiles = [
            { path: 'Documentation/index.md', section: 'root' },
            { path: 'Documentation/accueil.md', section: 'root' },
            { path: 'Documentation/semaine-1/electronique/gyroscope-accelerometre.md', section: 'semaine-1', domain: 'electronique' },
            { path: 'Documentation/semaine-1/it/robot.md', section: 'semaine-1', domain: 'it' },
            { path: 'Documentation/semaine-1/mecanique/documentation_meca.md', section: 'semaine-1', domain: 'mecanique' }
        ];
        
        for (const file of knownFiles) {
            try {
                // Vérifier si le fichier existe en tentant de le fetch
                const response = await fetch(file.path, { method: 'HEAD' });
                if (response.ok) {
                    // Le fichier existe, l'ajouter à la structure
                    if (file.section === 'root') {
                        structure.root.push(file.path.split('/').pop());
                    } else {
                        if (!structure[file.section]) {
                            structure[file.section] = {};
                        }
                        if (!structure[file.section][file.domain]) {
                            structure[file.section][file.domain] = [];
                        }
                        structure[file.section][file.domain].push(file.path.split('/').pop());
                    }
                    console.log(`Fichier détecté: ${file.path}`);
                }
            } catch (error) {
                console.log(`Fichier non trouvé: ${file.path}`);
            }
        }
        
        return structure;
    }

    // Fonction pour mettre à jour spécifiquement la section Documentation
    function updateDocumentationSection(structure) {
        const documentationSection = document.getElementById('documentation');
        if (!documentationSection) return;

        // Vider le contenu existant de la section documentation SAUF les éléments statiques
        const staticItems = documentationSection.querySelectorAll('li:not([data-dynamic])');
        documentationSection.innerHTML = '';
        
        // Remettre les éléments statiques
        staticItems.forEach(item => documentationSection.appendChild(item));

        // Ajouter les fichiers de la racine d'abord
        if (structure.root && structure.root.length > 0) {
            structure.root.forEach(file => {
                const fileItem = createFileItem(file, 'Documentation');
                fileItem.setAttribute('data-dynamic', 'true');
                documentationSection.appendChild(fileItem);
            });
        }

        // Ajouter les sections par semaine
        Object.keys(structure).forEach(sectionKey => {
            if (sectionKey === 'root') return; // Déjà traité

            const sectionData = structure[sectionKey];
            const sectionItem = createDocumentationSubSection(sectionKey, sectionData);
            sectionItem.setAttribute('data-dynamic', 'true');
            documentationSection.appendChild(sectionItem);
        });

        // S'assurer que la section Documentation est dépliable
        setupDocumentationToggle();
    }

    // Fonction pour configurer le toggle de la section Documentation
    function setupDocumentationToggle() {
        const docToggle = document.querySelector('[data-section="documentation"]');
        const documentationSection = document.getElementById('documentation');
        const arrow = docToggle ? docToggle.querySelector('.arrow') : null;
        
        if (docToggle && documentationSection && arrow) {
            // Définir l'état initial : replié avec flèche vers la droite
            documentationSection.classList.add('collapsed');
            arrow.textContent = '▶';
            
            // Supprimer les anciens event listeners
            docToggle.removeEventListener('click', handleDocumentationToggle);
            
            // Ajouter le nouvel event listener
            docToggle.addEventListener('click', handleDocumentationToggle);
        }
    }

    // Handler pour le toggle de Documentation
    function handleDocumentationToggle(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const documentationSection = document.getElementById('documentation');
        const arrow = this.querySelector('.arrow');
        
        if (documentationSection && arrow) {
            documentationSection.classList.toggle('collapsed');
            
            if (documentationSection.classList.contains('collapsed')) {
                arrow.textContent = '▶';
                console.log('Documentation fermée');
            } else {
                arrow.textContent = '▼'; 
                console.log('Documentation ouverte');
            }
        }
    }

    // Fonction pour créer une sous-section dans Documentation
    function createDocumentationSubSection(sectionKey, sectionData) {
        const li = document.createElement('li');
        
        const sectionName = getSectionDisplayName(sectionKey);
        const sectionIcon = getSectionIcon(sectionKey);

        if (Array.isArray(sectionData)) {
            // Section simple (comme test-final)
            const toggle = document.createElement('div');
            toggle.className = 'subsection-toggle';
            toggle.setAttribute('data-section', `doc-${sectionKey}`);
            toggle.innerHTML = `
                ${sectionIcon} ${sectionName}
                <span class="arrow">▶</span>
            `;

            const ul = document.createElement('ul');
            ul.className = 'subsection-list';
            ul.id = `doc-${sectionKey}`;

            sectionData.forEach(file => {
                const fileItem = createFileItem(file, `Documentation/${sectionKey}`);
                ul.appendChild(fileItem);
            });

            li.appendChild(toggle);
            li.appendChild(ul);
        } else {
            // Section avec sous-domaines (comme semaine-1, semaine-2, etc.)
            const toggle = document.createElement('div');
            toggle.className = 'subsection-toggle';
            toggle.setAttribute('data-section', `doc-${sectionKey}`);
            toggle.innerHTML = `
                ${sectionIcon} ${sectionName}
                <span class="arrow">▶</span>
            `;

            const ul = document.createElement('ul');
            ul.className = 'subsection-list';
            ul.id = `doc-${sectionKey}`;

            Object.keys(sectionData).forEach(domainKey => {
                const domainFiles = sectionData[domainKey];
                const domainItem = createDomainSubItem(domainKey, domainFiles, sectionKey);
                ul.appendChild(domainItem);
            });

            li.appendChild(toggle);
            li.appendChild(ul);
        }

        return li;
    }

    // Fonction pour créer un sous-élément de domaine dans Documentation
    function createDomainSubItem(domainKey, files, parentSection) {
        const li = document.createElement('li');
        
        const domainName = getDomainDisplayName(domainKey);
        const domainIcon = getDomainIcon(domainKey);
        
        const toggle = document.createElement('div');
        toggle.className = 'domain-toggle';
        toggle.setAttribute('data-section', `doc-${parentSection}-${domainKey}`);
        toggle.innerHTML = `
            ${domainIcon} ${domainName}
            <span class="arrow">▶</span>
        `;

        const ul = document.createElement('ul');
        ul.className = 'domain-list';
        ul.id = `doc-${parentSection}-${domainKey}`;

        files.forEach(file => {
            const fileItem = createFileItem(file, `Documentation/${parentSection}/${domainKey}`);
            ul.appendChild(fileItem);
        });

        li.appendChild(toggle);
        li.appendChild(ul);

        return li;
    }

    // Fonctions utilitaires pour les noms d'affichage
    function getSectionDisplayName(key) {
        const names = {
            'semaine-1': 'Semaine 1',
            'semaine-2': 'Semaine 2', 
            'semaine-3': 'Semaine 3',
            'test-final': 'Test Final'
        };
        return names[key] || key;
    }

    function getSectionIcon(key) {
        const icons = {
            'semaine-1': '📅',
            'semaine-2': '📅',
            'semaine-3': '📅', 
            'test-final': '🏆'
        };
        return icons[key] || '📄';
    }

    function getDomainDisplayName(key) {
        const names = {
            'electronique': 'Électronique',
            'it': 'Informatique',
            'mecanique': 'Mécanique'
        };
        return names[key] || key;
    }

    function getDomainIcon(key) {
        const icons = {
            'electronique': '⚡',
            'it': '💻',
            'mecanique': '🔧'
        };
        return icons[key] || '📄';
    }

    function getFileDisplayName(filename) {
        return filename
            .replace('.md', '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    // Fonction pour créer un élément de fichier
    function createFileItem(filename, path) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        const displayName = getFileDisplayName(filename);
        const fileId = filename.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
        
        a.href = `#${fileId}`;
        a.className = 'nav-link file-link';
        a.textContent = displayName;
        a.setAttribute('data-file', `${path}/${filename}`);
        
        // Ajouter un événement pour charger le contenu du fichier
        a.addEventListener('click', function(e) {
            e.preventDefault();
            loadFileContent(`${path}/${filename}`, fileId);
            
            // Mettre à jour l'état actif
            document.querySelectorAll('.nav-link').forEach(link => 
                link.classList.remove('active-file'));
            this.classList.add('active-file');
        });
        
        li.appendChild(a);
        return li;
    }

    // Fonction pour charger le contenu d'un fichier
    async function loadFileContent(filePath, targetId) {
        try {
            console.log(`Chargement du fichier: ${filePath}`);
            
            let targetSection = document.getElementById(targetId);
            if (!targetSection) {
                targetSection = document.createElement('section');
                targetSection.id = targetId;
                document.querySelector('.content-body').appendChild(targetSection);
            }
            
            targetSection.innerHTML = `
                <h2>📄 ${getFileDisplayName(filePath.split('/').pop())}</h2>
                <div class="file-content">
                    <p>Contenu du fichier: <code>${filePath}</code></p>
                    <p>Ce contenu sera chargé automatiquement depuis le fichier markdown.</p>
                </div>
            `;
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
        } catch (error) {
            console.error('Erreur lors du chargement du fichier:', error);
        }
    }

    // Configuration des toggles pour tous les éléments
    function setupAllToggles() {
        // Délégation d'événements pour tous les toggles
        document.addEventListener('click', function(e) {
            // Toggles pour les sous-sections
            if (e.target.classList.contains('subsection-toggle') || 
                e.target.closest('.subsection-toggle')) {
                
                const toggle = e.target.classList.contains('subsection-toggle') ? 
                    e.target : e.target.closest('.subsection-toggle');
                
                const sectionId = toggle.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                const arrow = toggle.querySelector('.arrow');
                
                if (section && arrow) {
                    section.classList.toggle('expanded');
                    
                    if (section.classList.contains('expanded')) {
                        arrow.textContent = '▼';
                    } else {
                        arrow.textContent = '▶';
                    }
                }
            }
            
            // Toggles pour les domaines
            if (e.target.classList.contains('domain-toggle') || 
                e.target.closest('.domain-toggle')) {
                
                const toggle = e.target.classList.contains('domain-toggle') ? 
                    e.target : e.target.closest('.domain-toggle');
                
                const sectionId = toggle.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                const arrow = toggle.querySelector('.arrow');
                
                if (section && arrow) {
                    section.classList.toggle('expanded');
                    
                    if (section.classList.contains('expanded')) {
                        arrow.textContent = '▼';
                    } else {
                        arrow.textContent = '▶';
                    }
                }
            }
        });
    }

    // Handle search functionality
    const searchInput = document.querySelector('.search-input');
    
    // Focus search on Ctrl+K
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Initialize everything
    loadDocumentStructure();
    setupAllToggles();
    
    // Fonction pour rafraîchir la structure
    window.refreshDocumentStructure = function() {
        loadDocumentStructure();
    };
});
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.startsWith('#')) {
                link.closest('.nav-item')?.classList.remove('active');
                if (linkHref === '#' + current) {
                    link.closest('.nav-item')?.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const allNavItems = document.querySelectorAll('.nav-item');
        
        allNavItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm) || searchTerm === '') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Initialize collapsed state for some sections
    const initialCollapsed = ['semaine2', 'semaine3', 'test-final'];
    initialCollapsed.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('collapsed');
        }
    });
    
    // Initialize the document structure loading
    loadDocumentStructure();
    
    // Fonction pour rafraîchir la structure (appelée périodiquement ou sur demande)
    window.refreshDocumentStructure = function() {
        loadDocumentStructure();
    };
});

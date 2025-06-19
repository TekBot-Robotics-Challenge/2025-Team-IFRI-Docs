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

    // Fonction pour scanner les fichiers markdown (simulation basée sur votre structure)
    async function scanDocumentFiles() {
        // Structure réelle basée sur votre dossier Documentation
        return {
            'root': ['index.md', 'accueil.md'], // Fichiers à la racine de Documentation
            'semaine-1': {
                'electronique': ['gyroscope-accelerometre.md'],
                'it': ['robot.md', 'classes-avancees.md', 'tests-unitaires.md'],
                'mecanique': ['documentation_meca.md', 'conception-3d.md']
            },
            'semaine-2': {
                'electronique': ['boite-noire.md', 'communication-serie.md'],
                'it': ['ros2-intro.md', 'ros2-nodes.md'],
                'mecanique': ['niveau-intermediaire.md']
            },
            'semaine-3': {
                'electronique': ['afficheur-7segments.md'],
                'it': ['pathfinding.md', 'algorithmes-avances.md'],
                'mecanique': ['niveau-avance.md']
            },
            'test-final': ['convoyeur.md', 'integration.md']
        };
    }

    // Fonction pour mettre à jour spécifiquement la section Documentation
    function updateDocumentationSection(structure) {
        const documentationSection = document.getElementById('documentation');
        if (!documentationSection) return;

        // Vider le contenu existant de la section documentation
        documentationSection.innerHTML = '';

        // Ajouter les fichiers de la racine d'abord
        if (structure.root && structure.root.length > 0) {
            structure.root.forEach(file => {
                const fileItem = createFileItem(file, 'Documentation');
                documentationSection.appendChild(fileItem);
            });
        }

        // Ajouter les sections par semaine
        Object.keys(structure).forEach(sectionKey => {
            if (sectionKey === 'root') return; // Déjà traité

            const sectionData = structure[sectionKey];
            const sectionItem = createDocumentationSubSection(sectionKey, sectionData);
            documentationSection.appendChild(sectionItem);
        });

        // S'assurer que la section Documentation est dépliable
        setupDocumentationToggle();
    }

    // Fonction pour configurer le toggle de la section Documentation
    function setupDocumentationToggle() {
        const docToggle = document.querySelector('[data-section="documentation"]');
        const documentationSection = document.getElementById('documentation');
        
        if (docToggle && documentationSection) {
            // Enlever la classe collapsed pour s'assurer qu'elle s'affiche
            documentationSection.classList.remove('collapsed');
            
            // Configurer le toggle
            docToggle.addEventListener('click', function() {
                const arrow = this.querySelector('.arrow');
                
                documentationSection.classList.toggle('collapsed');
                
                if (documentationSection.classList.contains('collapsed')) {
                    arrow.textContent = '▶';
                } else {
                    arrow.textContent = '▼';
                }
            });
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
            // Simuler le chargement de contenu
            console.log(`Chargement du fichier: ${filePath}`);
            
            // Ajouter une section pour ce contenu dans la page principale
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
            
            // Faire défiler vers la section
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
        // Toggles pour les sous-sections
        document.addEventListener('click', function(e) {
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
    
    // Fonction pour rafraîchir la structure (appelée périodiquement ou sur demande)
    window.refreshDocumentStructure = function() {
        loadDocumentStructure();
    };
});
                    });
                }
                
                // Update active state
                document.querySelector('.nav-item.active')?.classList.remove('active');
                this.closest('.nav-item')?.classList.add('active');
            });
        }
    });
    
    // Highlight current section on scroll
    function updateActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
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

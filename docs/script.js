document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour charger automatiquement la structure des fichiers
    async function loadDocumentStructure() {
        try {
            // Structure des dossiers basée sur votre architecture
            const documentStructure = {
                'semaine-1': {
                    'electronique': [],
                    'it': [],
                    'mecanique': []
                },
                'semaine-2': {
                    'electronique': [],
                    'it': [],
                    'mecanique': []
                },
                'semaine-3': {
                    'electronique': [],
                    'it': [],
                    'mecanique': []
                },
                'test-final': {}
            };

            // Fonction pour scanner les fichiers (simulation - en production, vous utiliseriez une API ou un index)
            await scanDocumentFiles(documentStructure);
            
            // Mettre à jour la sidebar avec la structure réelle
            updateSidebarWithStructure(documentStructure);
            
        } catch (error) {
            console.error('Erreur lors du chargement de la structure:', error);
            // Fallback vers la structure statique si l'auto-détection échoue
        }
    }

    // Fonction pour scanner les fichiers markdown
    async function scanDocumentFiles(structure) {
        // Liste des fichiers connus (à mettre à jour automatiquement via un script de build)
        const knownFiles = {
            'semaine-1/electronique': ['gyroscope-accelerometre.md'],
            'semaine-1/it': ['robot.md', 'classes-avancees.md', 'tests-unitaires.md'],
            'semaine-1/mecanique': ['documentation_meca.md', 'conception-3d.md'],
            'semaine-2/electronique': ['boite-noire.md', 'communication-serie.md'],
            'semaine-2/it': ['ros2-intro.md', 'ros2-nodes.md'],
            'semaine-2/mecanique': ['niveau-intermediaire.md'],
            'semaine-3/electronique': ['afficheur-7segments.md'],
            'semaine-3/it': ['pathfinding.md', 'algorithmes-avances.md'],
            'semaine-3/mecanique': ['niveau-avance.md'],
            'test-final': ['convoyeur.md', 'integration.md']
        };

        // Remplir la structure avec les fichiers connus
        Object.keys(knownFiles).forEach(path => {
            const pathParts = path.split('/');
            if (pathParts.length === 2) {
                const [semaine, domaine] = pathParts;
                if (structure[semaine] && structure[semaine][domaine]) {
                    structure[semaine][domaine] = knownFiles[path];
                }
            } else if (pathParts.length === 1) {
                const [section] = pathParts;
                if (structure[section]) {
                    structure[section] = knownFiles[path];
                }
            }
        });
    }

    // Fonction pour mettre à jour la sidebar avec la structure réelle
    function updateSidebarWithStructure(structure) {
        const navList = document.querySelector('.nav-list');
        
        // Garder les éléments de base (search, accueil, documentation)
        const baseElements = navList.querySelectorAll('.nav-item:not([data-dynamic])');
        
        // Supprimer les éléments dynamiques existants
        navList.querySelectorAll('[data-dynamic]').forEach(el => el.remove());

        // Ajouter les sections dynamiques
        Object.keys(structure).forEach(sectionKey => {
            const sectionData = structure[sectionKey];
            const sectionItem = createSectionItem(sectionKey, sectionData);
            navList.appendChild(sectionItem);
        });
    }

    // Fonction pour créer un élément de section
    function createSectionItem(sectionKey, sectionData) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.setAttribute('data-dynamic', 'true');

        const sectionName = getSectionDisplayName(sectionKey);
        const sectionIcon = getSectionIcon(sectionKey);

        if (Array.isArray(sectionData)) {
            // Section simple (comme test-final)
            const toggle = document.createElement('div');
            toggle.className = 'nav-link section-toggle';
            toggle.setAttribute('data-section', sectionKey);
            toggle.innerHTML = `
                ${sectionIcon} ${sectionName}
                <span class="arrow">▶</span>
            `;

            const ul = document.createElement('ul');
            ul.className = 'section-list collapsed';
            ul.id = sectionKey;

            sectionData.forEach(file => {
                const fileItem = createFileItem(file, sectionKey);
                ul.appendChild(fileItem);
            });

            li.appendChild(toggle);
            li.appendChild(ul);
        } else {
            // Section avec sous-domaines (comme semaine-1, semaine-2, etc.)
            const toggle = document.createElement('div');
            toggle.className = 'nav-link section-toggle';
            toggle.setAttribute('data-section', sectionKey);
            toggle.innerHTML = `
                ${sectionIcon} ${sectionName}
                <span class="arrow">▼</span>
            `;

            const ul = document.createElement('ul');
            ul.className = 'section-list';
            ul.id = sectionKey;

            Object.keys(sectionData).forEach(domainKey => {
                const domainFiles = sectionData[domainKey];
                const domainItem = createDomainItem(domainKey, domainFiles, sectionKey);
                ul.appendChild(domainItem);
            });

            li.appendChild(toggle);
            li.appendChild(ul);
        }

        return li;
    }

    // Fonction pour créer un élément de domaine
    function createDomainItem(domainKey, files, parentSection) {
        const li = document.createElement('li');
        
        const domainName = getDomainDisplayName(domainKey);
        const domainIcon = getDomainIcon(domainKey);
        
        const toggle = document.createElement('div');
        toggle.className = 'subsection-toggle';
        toggle.setAttribute('data-section', `${parentSection}-${domainKey}`);
        toggle.innerHTML = `
            ${domainIcon} ${domainName}
            <span class="arrow">▶</span>
        `;

        const ul = document.createElement('ul');
        ul.className = 'subsection-list';
        ul.id = `${parentSection}-${domainKey}`;

        files.forEach(file => {
            const fileItem = createFileItem(file, `${parentSection}/${domainKey}`);
            ul.appendChild(fileItem);
        });

        li.appendChild(toggle);
        li.appendChild(ul);

        return li;
    }

    // Fonction pour créer un élément de fichier
    function createFileItem(filename, path) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        const displayName = getFileDisplayName(filename);
        const fileId = filename.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
        
        a.href = `#${fileId}`;
        a.className = 'nav-link';
        a.textContent = displayName;
        a.setAttribute('data-file', `${path}/${filename}`);
        
        // Ajouter un événement pour charger le contenu du fichier
        a.addEventListener('click', function(e) {
            e.preventDefault();
            loadFileContent(`${path}/${filename}`, fileId);
            
            // Mettre à jour l'état actif
            document.querySelector('.nav-item.active')?.classList.remove('active');
            this.closest('.nav-item')?.classList.add('active');
        });
        
        li.appendChild(a);
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
        // Convertir le nom de fichier en titre lisible
        return filename
            .replace('.md', '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    // Fonction pour charger le contenu d'un fichier
    async function loadFileContent(filePath, targetId) {
        try {
            // Simuler le chargement de contenu (vous devrez adapter selon votre setup)
            const response = await fetch(`Documentation/${filePath}`);
            const content = await response.text();
            
            // Ajouter une section pour ce contenu dans la page principale
            let targetSection = document.getElementById(targetId);
            if (!targetSection) {
                targetSection = document.createElement('section');
                targetSection.id = targetId;
                document.querySelector('.content-body').appendChild(targetSection);
            }
            
            // Convertir le markdown en HTML (vous pourriez utiliser une bibliothèque comme marked.js)
            targetSection.innerHTML = `
                <h2>📄 ${getFileDisplayName(filePath.split('/').pop())}</h2>
                <div class="file-content">
                    <pre><code>${content}</code></pre>
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

    // Handle search functionality
    const searchInput = document.querySelector('.search-input');
    
    // Focus search on Ctrl+K
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Handle collapsible sections
    const sectionToggles = document.querySelectorAll('.section-toggle');
    const subsectionToggles = document.querySelectorAll('.subsection-toggle');
    
    // Section toggles
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            const arrow = this.querySelector('.arrow');
            
            if (section) {
                section.classList.toggle('collapsed');
                
                if (section.classList.contains('collapsed')) {
                    arrow.textContent = '▶';
                    arrow.style.transform = 'rotate(0deg)';
                } else {
                    arrow.textContent = '▼';
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
    
    // Subsection toggles
    subsectionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            const arrow = this.querySelector('.arrow');
            
            if (section) {
                section.classList.toggle('expanded');
                
                if (section.classList.contains('expanded')) {
                    arrow.textContent = '▼';
                    arrow.style.transform = 'rotate(0deg)';
                } else {
                    arrow.textContent = '▶';
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
    
    // Handle navigation active states
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
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

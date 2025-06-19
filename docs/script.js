document.addEventListener('DOMContentLoaded', function() {
    // Charger la structure depuis le fichier JSON
    async function loadDocumentStructure() {
        try {
            const response = await fetch('structure.json');
            const structure = await response.json();
            console.log('Structure chargée:', structure);
            updateDocumentationSection(structure);
        } catch (error) {
            console.error('Erreur lors du chargement de structure.json:', error);
            // Fallback en cas d'erreur
            loadFallbackStructure();
        }
    }

    // Structure de fallback si le JSON ne se charge pas
    function loadFallbackStructure() {
        const fallbackStructure = {
            "root": [
                {"name": "index.md", "path": "Documentation/index.md", "title": "Introduction"},
                {"name": "accueil.md", "path": "Documentation/accueil.md", "title": "Accueil"}
            ],
            "semaine-1": {
                "electronique": [{"name": "gyroscope-accelerometre.md", "path": "Documentation/semaine-1/electronique/gyroscope-accelerometre.md", "title": "Gyroscope et Accéléromètre"}],
                "it": [
                    {"name": "robot.md", "path": "Documentation/semaine-1/it/robot.md", "title": "Système de gestion Robot"},
                    {"name": "classes-avancees.md", "path": "Documentation/semaine-1/it/classes-avancees.md", "title": "Classes Avancées"},
                    {"name": "tests-unitaires.md", "path": "Documentation/semaine-1/it/tests-unitaires.md", "title": "Tests Unitaires"}
                ],
                "mecanique": [
                    {"name": "documentation_meca.md", "path": "Documentation/semaine-1/mecanique/documentation_meca.md", "title": "Documentation Mécanique"},
                    {"name": "conception-3d.md", "path": "Documentation/semaine-1/mecanique/conception-3d.md", "title": "Conception 3D"}
                ]
            }
        };
        updateDocumentationSection(fallbackStructure);
    }

    // Mettre à jour la section Documentation
    function updateDocumentationSection(structure) {
        const documentationSection = document.getElementById('documentation');
        if (!documentationSection) {
            console.error('Section documentation non trouvée');
            return;
        }

        console.log('Mise à jour de la section Documentation avec', Object.keys(structure).length, 'sections');

        // Garder les éléments statiques
        const staticItems = [];
        documentationSection.querySelectorAll('li:not([data-dynamic])').forEach(item => {
            staticItems.push(item.cloneNode(true));
        });

        // Vider et remettre les éléments statiques
        documentationSection.innerHTML = '';
        staticItems.forEach(item => documentationSection.appendChild(item));

        // Ajouter les fichiers de la racine
        if (structure.root && structure.root.length > 0) {
            structure.root.forEach(file => {
                const fileItem = createFileItem(file);
                fileItem.setAttribute('data-dynamic', 'true');
                documentationSection.appendChild(fileItem);
            });
        }

        // Ajouter les sections par semaine
        Object.keys(structure).forEach(sectionKey => {
            if (sectionKey === 'root') return;

            const sectionData = structure[sectionKey];
            const sectionItem = createDocumentationSubSection(sectionKey, sectionData);
            sectionItem.setAttribute('data-dynamic', 'true');
            documentationSection.appendChild(sectionItem);
        });

        // Configurer le toggle principal - État initial ouvert pour voir le contenu
        setupDocumentationToggle();
        console.log('Section Documentation mise à jour avec succès');
    }

    // Configurer le toggle de Documentation
    function setupDocumentationToggle() {
        const docToggle = document.querySelector('[data-section="documentation"]');
        const documentationSection = document.getElementById('documentation');
        
        if (docToggle && documentationSection) {
            // État initial : OUVERT pour voir le contenu
            documentationSection.classList.remove('collapsed');
            const arrow = docToggle.querySelector('.arrow');
            if (arrow) arrow.textContent = '▼';
            
            // Event listener
            docToggle.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                documentationSection.classList.toggle('collapsed');
                
                if (documentationSection.classList.contains('collapsed')) {
                    arrow.textContent = '▶';
                    console.log('Documentation fermée');
                } else {
                    arrow.textContent = '▼';
                    console.log('Documentation ouverte');
                }
            });
            
            console.log('Toggle Documentation configuré - État initial: ouvert');
        }
    }

    // Créer une sous-section
    function createDocumentationSubSection(sectionKey, sectionData) {
        const li = document.createElement('li');
        const sectionName = getSectionDisplayName(sectionKey);
        const sectionIcon = getSectionIcon(sectionKey);

        if (Array.isArray(sectionData)) {
            // Section simple (test-final)
            const toggle = document.createElement('div');
            toggle.className = 'subsection-toggle';
            toggle.setAttribute('data-section', `doc-${sectionKey}`);
            toggle.innerHTML = `${sectionIcon} ${sectionName}<span class="arrow">▶</span>`;

            const ul = document.createElement('ul');
            ul.className = 'subsection-list';
            ul.id = `doc-${sectionKey}`;

            sectionData.forEach(file => {
                const fileItem = createFileItem(file);
                ul.appendChild(fileItem);
            });

            li.appendChild(toggle);
            li.appendChild(ul);
        } else {
            // Section avec domaines (semaines)
            const toggle = document.createElement('div');
            toggle.className = 'subsection-toggle';
            toggle.setAttribute('data-section', `doc-${sectionKey}`);
            toggle.innerHTML = `${sectionIcon} ${sectionName}<span class="arrow">▶</span>`;

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

    // Créer un domaine
    function createDomainSubItem(domainKey, files, parentSection) {
        const li = document.createElement('li');
        const domainName = getDomainDisplayName(domainKey);
        const domainIcon = getDomainIcon(domainKey);
        
        const toggle = document.createElement('div');
        toggle.className = 'domain-toggle';
        toggle.setAttribute('data-section', `doc-${parentSection}-${domainKey}`);
        toggle.innerHTML = `${domainIcon} ${domainName}<span class="arrow">▶</span>`;

        const ul = document.createElement('ul');
        ul.className = 'domain-list';
        ul.id = `doc-${parentSection}-${domainKey}`;

        files.forEach(file => {
            const fileItem = createFileItem(file);
            ul.appendChild(fileItem);
        });

        li.appendChild(toggle);
        li.appendChild(ul);
        return li;
    }

    // Créer un élément de fichier
    function createFileItem(file) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        const displayName = file.title || getFileDisplayName(file.name);
        const fileId = file.name.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
        
        a.href = `#${fileId}`;
        a.className = 'nav-link file-link';
        a.textContent = displayName;
        a.setAttribute('data-file', file.path);
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            loadFileContent(file.path, fileId, displayName);
            
            document.querySelectorAll('.file-link').forEach(link => 
                link.classList.remove('active-file'));
            this.classList.add('active-file');
        });
        
        li.appendChild(a);
        return li;
    }

    // Charger contenu d'un fichier
    async function loadFileContent(filePath, targetId, displayName) {
        try {
            console.log(`Chargement du fichier: ${filePath}`);
            
            let targetSection = document.getElementById(targetId);
            if (!targetSection) {
                targetSection = document.createElement('section');
                targetSection.id = targetId;
                document.querySelector('.content-body').appendChild(targetSection);
            }
            
            targetSection.innerHTML = `
                <h2>📄 ${displayName}</h2>
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

    // Configuration des toggles pour sous-sections et domaines
    function setupAllToggles() {
        document.addEventListener('click', function(e) {
            // Toggles sous-sections
            if (e.target.classList.contains('subsection-toggle') || 
                e.target.closest('.subsection-toggle')) {
                
                const toggle = e.target.classList.contains('subsection-toggle') ? 
                    e.target : e.target.closest('.subsection-toggle');
                
                const sectionId = toggle.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                const arrow = toggle.querySelector('.arrow');
                
                if (section && arrow) {
                    section.classList.toggle('expanded');
                    arrow.textContent = section.classList.contains('expanded') ? '▼' : '▶';
                }
            }
            
            // Toggles domaines
            if (e.target.classList.contains('domain-toggle') || 
                e.target.closest('.domain-toggle')) {
                
                const toggle = e.target.classList.contains('domain-toggle') ? 
                    e.target : e.target.closest('.domain-toggle');
                
                const sectionId = toggle.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                const arrow = toggle.querySelector('.arrow');
                
                if (section && arrow) {
                    section.classList.toggle('expanded');
                    arrow.textContent = section.classList.contains('expanded') ? '▼' : '▶';
                }
            }
        });
    }

    // Fonctions utilitaires
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

    // Recherche
    const searchInput = document.querySelector('.search-input');
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Initialisation
    loadDocumentStructure();
    setupAllToggles();
});
                
                const toggle = e.target.classList.contains('subsection-toggle') ? 
                    e.target : e.target.closest('.subsection-toggle');
                
                const sectionId = toggle.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                const arrow = toggle.querySelector('.arrow');
                
                if (section && arrow) {
                    section.classList.toggle('expanded');
                    arrow.textContent = section.classList.contains('expanded') ? '▼' : '▶';
                }
            }
            
            // Toggles domaines
            if (e.target.classList.contains('domain-toggle') || 
                e.target.closest('.domain-toggle')) {
                
                const toggle = e.target.classList.contains('domain-toggle') ? 
                    e.target : e.target.closest('.domain-toggle');
                
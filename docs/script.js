document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la sidebar');
    
    // Charger la structure JSON
    async function loadStructure() {
        try {
            const response = await fetch('structure.json');
            const data = await response.json();
            console.log('Structure JSON chargée:', data);
            buildSidebar(data);
        } catch (error) {
            console.error('Erreur chargement JSON:', error);
            buildSidebar(getFallbackData());
        }
    }
    
    // Structure de fallback
    function getFallbackData() {
        return {
            "root": [
                {"name": "index.md", "path": "Documentation/index.md", "title": "Introduction"},
                {"name": "accueil.md", "path": "Documentation/accueil.md", "title": "Accueil"}
            ],
            "semaine-1": {
                "electronique": [
                    {"name": "gyroscope-accelerometre.md", "path": "Documentation/semaine-1/electronique/gyroscope-accelerometre.md", "title": "Gyroscope et Accéléromètre"}
                ],
                "it": [
                    {"name": "robot.md", "path": "Documentation/semaine-1/it/robot.md", "title": "Système de gestion Robot"},
                    {"name": "classes-avancees.md", "path": "Documentation/semaine-1/it/classes-avancees.md", "title": "Classes Avancées"},
                    {"name": "tests-unitaires.md", "path": "Documentation/semaine-1/it/tests-unitaires.md", "title": "Tests Unitaires"}
                ],
                "mecanique": [
                    {"name": "documentation_meca.md", "path": "Documentation/semaine-1/mecanique/documentation_meca.md", "title": "Documentation Mécanique"}
                ]
            }
        };
    }
    
    // Construire la sidebar complètement
    function buildSidebar(structure) {
        const docSection = document.getElementById('documentation');
        if (!docSection) {
            console.error('Section documentation introuvable');
            return;
        }
        
        // Vider tout le contenu dynamique
        const staticItems = Array.from(docSection.querySelectorAll('li:not([data-dynamic])'));
        docSection.innerHTML = '';
        
        // Remettre les éléments statiques
        staticItems.forEach(item => docSection.appendChild(item));
        
        // Ajouter les fichiers root
        if (structure.root) {
            structure.root.forEach(file => {
                const li = createFileListItem(file);
                li.setAttribute('data-dynamic', 'true');
                docSection.appendChild(li);
            });
        }
        
        // Ajouter chaque section
        Object.keys(structure).forEach(key => {
            if (key === 'root') return;
            
            const section = structure[key];
            const li = createSectionItem(key, section);
            li.setAttribute('data-dynamic', 'true');
            docSection.appendChild(li);
        });
        
        // Configurer le toggle principal
        setupMainToggle();
        console.log('Sidebar construite avec succès');
    }
    
    // Créer un item de section (semaine ou test-final)
    function createSectionItem(sectionKey, sectionData) {
        const li = document.createElement('li');
        
        // Créer le toggle
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'subsection-toggle';
        toggleDiv.innerHTML = `${getIcon(sectionKey)} ${getDisplayName(sectionKey)} <span class="toggle-arrow">▶</span>`;
        
        // Créer la liste de contenu
        const contentUl = document.createElement('ul');
        contentUl.className = 'subsection-content';
        contentUl.style.display = 'none';
        
        if (Array.isArray(sectionData)) {
            // Section simple (test-final)
            sectionData.forEach(file => {
                const fileItem = createFileListItem(file);
                contentUl.appendChild(fileItem);
            });
        } else {
            // Section avec domaines (semaines)
            Object.keys(sectionData).forEach(domainKey => {
                const domainFiles = sectionData[domainKey];
                const domainItem = createDomainItem(domainKey, domainFiles);
                contentUl.appendChild(domainItem);
            });
        }
        
        // Event listener pour le toggle
        toggleDiv.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const arrow = this.querySelector('.toggle-arrow');
            console.log(`Toggle section: ${sectionKey}`);
            
            if (contentUl.style.display === 'none') {
                contentUl.style.display = 'block';
                arrow.textContent = '▼';
                console.log(`${sectionKey} ouvert`);
            } else {
                contentUl.style.display = 'none';
                arrow.textContent = '▶';
                console.log(`${sectionKey} fermé`);
            }
        });
        
        li.appendChild(toggleDiv);
        li.appendChild(contentUl);
        return li;
    }
    
    // Créer un item de domaine (electronique, it, mecanique)
    function createDomainItem(domainKey, files) {
        const li = document.createElement('li');
        
        // Créer le toggle du domaine
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'domain-toggle';
        toggleDiv.innerHTML = `${getDomainIcon(domainKey)} ${getDomainName(domainKey)} <span class="toggle-arrow">▶</span>`;
        toggleDiv.style.paddingLeft = '20px';
        
        // Créer la liste des fichiers
        const filesUl = document.createElement('ul');
        filesUl.className = 'domain-files';
        filesUl.style.display = 'none';
        filesUl.style.paddingLeft = '20px';
        
        files.forEach(file => {
            const fileItem = createFileListItem(file);
            filesUl.appendChild(fileItem);
        });
        
        // Event listener pour le domaine
        toggleDiv.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const arrow = this.querySelector('.toggle-arrow');
            console.log(`Toggle domaine: ${domainKey}`);
            
            if (filesUl.style.display === 'none') {
                filesUl.style.display = 'block';
                arrow.textContent = '▼';
                console.log(`${domainKey} ouvert`);
            } else {
                filesUl.style.display = 'none';
                arrow.textContent = '▶';
                console.log(`${domainKey} fermé`);
            }
        });
        
        li.appendChild(toggleDiv);
        li.appendChild(filesUl);
        return li;
    }
    
    // Créer un item de fichier
    function createFileListItem(file) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.href = '#';
        a.className = 'nav-link file-link';
        a.textContent = file.title;
        a.style.paddingLeft = '40px';
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Clic sur fichier: ${file.title}`);
            loadFile(file);
            
            // Retirer l'état actif des autres
            document.querySelectorAll('.file-link').forEach(link => 
                link.classList.remove('active-file'));
            this.classList.add('active-file');
        });
        
        li.appendChild(a);
        return li;
    }
    
    // Charger un fichier
    function loadFile(file) {
        const contentBody = document.querySelector('.content-body');
        const fileId = file.name.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
        
        // Créer ou mettre à jour la section
        let section = document.getElementById(fileId);
        if (!section) {
            section = document.createElement('section');
            section.id = fileId;
            contentBody.appendChild(section);
        }
        
        section.innerHTML = `
            <h2>📄 ${file.title}</h2>
            <div class="file-content">
                <div class="info-box">
                    <span class="info-icon">📄</span>
                    <div>
                        <p><strong>Fichier:</strong> <code>${file.path}</code></p>
                        <p><strong>Statut:</strong> Prêt pour la documentation</p>
                    </div>
                </div>
            </div>
        `;
        
        // Scroll vers la section
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Configurer le toggle principal de Documentation
    function setupMainToggle() {
        const mainToggle = document.querySelector('[data-section="documentation"]');
        const docSection = document.getElementById('documentation');
        
        if (!mainToggle || !docSection) return;
        
        const mainArrow = mainToggle.querySelector('.arrow');
        
        // État initial ouvert
        if (mainArrow) mainArrow.textContent = '▼';
        
        mainToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Toggle Documentation principal');
            
            if (docSection.style.display === 'none') {
                docSection.style.display = 'block';
                if (mainArrow) mainArrow.textContent = '▼';
                console.log('Documentation ouverte');
            } else {
                docSection.style.display = 'none';
                if (mainArrow) mainArrow.textContent = '▶';
                console.log('Documentation fermée');
            }
        });
    }
    
    // Fonctions utilitaires
    function getDisplayName(key) {
        const names = {
            'semaine-1': 'Semaine 1',
            'semaine-2': 'Semaine 2',
            'semaine-3': 'Semaine 3',
            'test-final': 'Test Final'
        };
        return names[key] || key;
    }
    
    function getIcon(key) {
        const icons = {
            'semaine-1': '📅',
            'semaine-2': '📅',
            'semaine-3': '📅',
            'test-final': '🏆'
        };
        return icons[key] || '📄';
    }
    
    function getDomainName(key) {
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
    
    // Recherche
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }
    
    // Démarrer l'application
    loadStructure();
});
    // Recherche
    const searchInput = document.querySelector('.search-input');
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Initialisation - SUPPRIMER setupAllToggles()
    loadDocumentStructure();
});
                                <p><strong>Fichier:</strong> <code>${filePath}</code></p>
                                <p><strong>Statut:</strong> Prêt à être documenté</p>
                                <p>Ce fichier sera bientôt disponible avec le contenu complet de la documentation.</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Faire défiler vers la section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
        } catch (error) {
            console.error('Erreur lors du chargement du fichier:', error);
        }
    }

    // Supprimer l'ancienne fonction setupAllToggles
    // Configuration des toggles pour sous-sections et domaines
    function setupAllToggles() {
        // Cette fonction est remplacée par setupDynamicToggles()
        console.log('setupAllToggles appelé - remplacé par setupDynamicToggles');
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
});

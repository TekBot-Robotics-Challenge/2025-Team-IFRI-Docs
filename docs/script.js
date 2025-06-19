document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation sidebar dépliable');
    
    // Structure des données pour la sidebar
    const sidebarStructure = {
        "semaine-1": {
            "electronique": [
                {"name": "gyroscope-accelerometre.md", "title": "Gyroscope et Accéléromètre"}
            ],
            "it": [
                {"name": "robot.md", "title": "Système de gestion Robot"},
                {"name": "classes-avancees.md", "title": "Classes Avancées"},
                {"name": "tests-unitaires.md", "title": "Tests Unitaires"}
            ],
            "mecanique": [
                {"name": "documentation_meca.md", "title": "Documentation Mécanique"}
            ]
        },
        "semaine-2": {
            "electronique": [
                {"name": "boite-noire.md", "title": "La Boîte Noire"}
            ],
            "it": [
                {"name": "ros2-intro.md", "title": "Introduction à ROS2"}
            ],
            "mecanique": [
                {"name": "niveau-intermediaire.md", "title": "Niveau Intermédiaire"}
            ]
        },
        "semaine-3": {
            "electronique": [
                {"name": "afficheur-7segments.md", "title": "Afficheur 7 Segments"}
            ],
            "it": [
                {"name": "pathfinding.md", "title": "Algorithme de Pathfinding"}
            ],
            "mecanique": [
                {"name": "niveau-avance.md", "title": "Niveau Avancé"}
            ]
        },
        "test-final": [
            {"name": "convoyeur.md", "title": "Système de Convoyeur"}
        ]
    };
    
    // Construire la sidebar
    function buildSidebar() {
        const docContainer = document.getElementById('documentation');
        if (!docContainer) return;
        
        // Vider le contenu dynamique mais garder les éléments statiques
        const staticElements = Array.from(docContainer.querySelectorAll('li:not([data-dynamic])'));
        docContainer.innerHTML = '';
        staticElements.forEach(el => docContainer.appendChild(el));
        
        // Créer chaque section
        Object.keys(sidebarStructure).forEach(sectionKey => {
            const sectionData = sidebarStructure[sectionKey];
            const sectionElement = createSection(sectionKey, sectionData);
            docContainer.appendChild(sectionElement);
        });
        
        setupMainDocToggle();
    }
    
    // Créer une section (semaine ou test-final)
    function createSection(sectionKey, sectionData) {
        const li = document.createElement('li');
        li.setAttribute('data-dynamic', 'true');
        
        // Header de section avec toggle
        const header = document.createElement('div');
        header.className = 'sidebar-section-header';
        header.innerHTML = `
            <span class="section-icon">${getSectionIcon(sectionKey)}</span>
            <span class="section-name">${getSectionName(sectionKey)}</span>
            <span class="toggle-arrow">▶</span>
        `;
        header.style.cssText = `
            padding: 8px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #b9bbbe;
            font-size: 14px;
            font-weight: 500;
        `;
        
        // Container pour le contenu
        const content = document.createElement('ul');
        content.className = 'sidebar-section-content';
        content.style.cssText = `
            list-style: none;
            padding: 0;
            margin: 0;
            display: none;
        `;
        
        // Remplir le contenu
        if (Array.isArray(sectionData)) {
            // Section simple (test-final)
            sectionData.forEach(file => {
                content.appendChild(createFileItem(file, sectionKey));
            });
        } else {
            // Section avec domaines (semaines)
            Object.keys(sectionData).forEach(domainKey => {
                content.appendChild(createDomain(domainKey, sectionData[domainKey], sectionKey));
            });
        }
        
        // Event listener pour le toggle
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const arrow = header.querySelector('.toggle-arrow');
            const isVisible = content.style.display !== 'none';
            
            if (isVisible) {
                content.style.display = 'none';
                arrow.textContent = '▶';
                console.log(`${sectionKey} fermé`);
            } else {
                content.style.display = 'block';
                arrow.textContent = '▼';
                console.log(`${sectionKey} ouvert`);
            }
        });
        
        li.appendChild(header);
        li.appendChild(content);
        return li;
    }
    
    // Créer un domaine (electronique, it, mecanique)
    function createDomain(domainKey, files, parentSection) {
        const li = document.createElement('li');
        
        // Header du domaine
        const header = document.createElement('div');
        header.className = 'sidebar-domain-header';
        header.innerHTML = `
            <span class="domain-icon">${getDomainIcon(domainKey)}</span>
            <span class="domain-name">${getDomainName(domainKey)}</span>
            <span class="toggle-arrow">▶</span>
        `;
        header.style.cssText = `
            padding: 6px 35px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #b9bbbe;
            font-size: 13px;
        `;
        
        // Container pour les fichiers
        const filesList = document.createElement('ul');
        filesList.className = 'sidebar-files-list';
        filesList.style.cssText = `
            list-style: none;
            padding: 0;
            margin: 0;
            display: none;
        `;
        
        // Ajouter les fichiers
        files.forEach(file => {
            filesList.appendChild(createFileItem(file, parentSection, domainKey));
        });
        
        // Event listener pour le domaine
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const arrow = header.querySelector('.toggle-arrow');
            const isVisible = filesList.style.display !== 'none';
            
            if (isVisible) {
                filesList.style.display = 'none';
                arrow.textContent = '▶';
                console.log(`${domainKey} fermé`);
            } else {
                filesList.style.display = 'block';
                arrow.textContent = '▼';
                console.log(`${domainKey} ouvert`);
            }
        });
        
        li.appendChild(header);
        li.appendChild(filesList);
        return li;
    }
    
    // Créer un item de fichier
    function createFileItem(file, section, domain = null) {
        const li = document.createElement('li');
        
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'nav-link file-link';
        link.textContent = file.title;
        link.style.cssText = `
            display: block;
            padding: 6px 50px;
            color: #b9bbbe;
            text-decoration: none;
            font-size: 12px;
            border-left: 2px solid transparent;
        `;
        
        // Event listener pour le fichier
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`Clic sur fichier: ${file.title}`);
            
            // Retirer l'état actif des autres liens
            document.querySelectorAll('.file-link').forEach(l => {
                l.style.backgroundColor = '';
                l.style.borderLeftColor = 'transparent';
                l.style.color = '#b9bbbe';
            });
            
            // Activer ce lien
            this.style.backgroundColor = '#5865f2';
            this.style.borderLeftColor = '#fff';
            this.style.color = '#fff';
            
            // Afficher le contenu du fichier
            displayFileContent(file, section, domain);
        });
        
        li.appendChild(link);
        return li;
    }
    
    // Afficher le contenu d'un fichier
    function displayFileContent(file, section, domain) {
        const contentBody = document.querySelector('.content-body');
        const fileId = file.name.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
        
        // Créer ou trouver la section
        let fileSection = document.getElementById(fileId);
        if (!fileSection) {
            fileSection = document.createElement('section');
            fileSection.id = fileId;
            contentBody.appendChild(fileSection);
        }
        
        const filePath = domain ? 
            `Documentation/${section}/${domain}/${file.name}` : 
            `Documentation/${section}/${file.name}`;
        
        fileSection.innerHTML = `
            <h2>📄 ${file.title}</h2>
            <div class="file-content">
                <div class="info-box">
                    <span class="info-icon">📄</span>
                    <div>
                        <p><strong>Fichier:</strong> <code>${filePath}</code></p>
                        <p><strong>Section:</strong> ${getSectionName(section)}</p>
                        ${domain ? `<p><strong>Domaine:</strong> ${getDomainName(domain)}</p>` : ''}
                        <p><strong>Statut:</strong> Prêt pour la documentation</p>
                    </div>
                </div>
            </div>
        `;
        
        // Scroll vers la section
        fileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Setup du toggle principal Documentation
    function setupMainDocToggle() {
        const mainToggle = document.querySelector('[data-section="documentation"]');
        const docSection = document.getElementById('documentation');
        
        if (!mainToggle || !docSection) return;
        
        const arrow = mainToggle.querySelector('.arrow');
        if (arrow) arrow.textContent = '▼'; // Ouvert par défaut
        
        mainToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Toggle Documentation principal');
            
            docSection.classList.toggle('collapsed');
            if (docSection.classList.contains('collapsed')) {
                arrow.textContent = '▶';
                console.log('Documentation fermée');
            } else {
                arrow.textContent = '▼';
                console.log('Documentation ouverte');
            }
        });
    }
    
    // Fonctions utilitaires
    function getSectionName(key) {
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
    
    // Initialiser la sidebar
    buildSidebar();
});

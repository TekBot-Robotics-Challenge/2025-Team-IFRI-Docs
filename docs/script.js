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

        // CORRECTION: Configurer SEULEMENT le toggle principal
        setupDocumentationToggle();
        console.log('Section Documentation mise à jour avec succès');
    }

    // Configurer SEULEMENT le toggle principal de Documentation
    function setupDocumentationToggle() {
        const docToggle = document.querySelector('[data-section="documentation"]');
        const documentationSection = document.getElementById('documentation');
        
        if (!docToggle || !documentationSection) {
            console.error('Toggle ou section documentation non trouvés');
            return;
        }

        // État initial : OUVERT pour voir le contenu
        documentationSection.classList.remove('collapsed');
        const arrow = docToggle.querySelector('.arrow');
        if (arrow) arrow.textContent = '▼';
        
        console.log('Toggle Documentation configuré');
    }

    // Créer une sous-section AVEC event listeners intégrés
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

            // AJOUTER l'event listener DIRECTEMENT ici
            toggle.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const arrow = this.querySelector('.arrow');
                console.log(`Clic sur ${sectionKey}`);
                
                ul.classList.toggle('expanded');
                if (ul.classList.contains('expanded')) {
                    arrow.textContent = '▼';
                    console.log(`${sectionKey} ouvert`);
                } else {
                    arrow.textContent = '▶';
                    console.log(`${sectionKey} fermé`);
                }
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

            // AJOUTER l'event listener DIRECTEMENT ici
            toggle.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const arrow = this.querySelector('.arrow');
                console.log(`Clic sur ${sectionKey}`);
                
                ul.classList.toggle('expanded');
                if (ul.classList.contains('expanded')) {
                    arrow.textContent = '▼';
                    console.log(`${sectionKey} ouvert`);
                } else {
                    arrow.textContent = '▶';
                    console.log(`${sectionKey} fermé`);
                }
            });

            li.appendChild(toggle);
            li.appendChild(ul);
        }

        return li;
    }

    // Créer un domaine AVEC event listener intégré
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

        // AJOUTER l'event listener DIRECTEMENT ici
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const arrow = this.querySelector('.arrow');
            console.log(`Clic sur ${domainKey} de ${parentSection}`);
            
            ul.classList.toggle('expanded');
            if (ul.classList.contains('expanded')) {
                arrow.textContent = '▼';
                console.log(`${domainKey} ouvert`);
            } else {
                arrow.textContent = '▶';
                console.log(`${domainKey} fermé`);
            }
        });

        li.appendChild(toggle);
        li.appendChild(ul);
        return li;
    }

    // Créer un élément de fichier avec liens corrects
    function createFileItem(file) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        const displayName = file.title || getFileDisplayName(file.name);
        const fileId = file.name.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
        
        a.href = `#${fileId}`;
        a.className = 'nav-link file-link';
        a.textContent = displayName;
        a.setAttribute('data-file', file.path);
        
        // Event listener pour charger le fichier
        a.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Clic sur fichier: ${file.path}`);
            loadFileContent(file.path, fileId, displayName);
            
            // Mettre à jour l'état actif
            document.querySelectorAll('.file-link').forEach(link => 
                link.classList.remove('active-file'));
            this.classList.add('active-file');
        });
        
        li.appendChild(a);
        return li;
    }

    // Charger contenu d'un fichier avec vérification des liens
    async function loadFileContent(filePath, targetId, displayName) {
        try {
            console.log(`Tentative de chargement du fichier: ${filePath}`);
            
            let targetSection = document.getElementById(targetId);
            if (!targetSection) {
                targetSection = document.createElement('section');
                targetSection.id = targetId;
                document.querySelector('.content-body').appendChild(targetSection);
            }
            
            // Essayer de charger le fichier réel
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    targetSection.innerHTML = `
                        <h2>📄 ${displayName}</h2>
                        <div class="file-content">
                            <div class="markdown-content">${content}</div>
                        </div>
                    `;
                    console.log(`Fichier chargé avec succès: ${filePath}`);
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (fetchError) {
                console.warn(`Impossible de charger ${filePath}, affichage du placeholder`);
                targetSection.innerHTML = `
                    <h2>📄 ${displayName}</h2>
                    <div class="file-content">
                        <div class="info-box">
                            <span class="info-icon">📄</span>
                            <div>
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

    // SUPPRIMER toutes les anciennes fonctions de toggle
    // Ne plus utiliser setupDynamicToggles() ni setupAllToggles()

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

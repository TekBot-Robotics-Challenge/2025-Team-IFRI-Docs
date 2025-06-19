document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour charger automatiquement la structure des fichiers
    async function loadDocumentStructure() {
        try {
            const documentStructure = await scanDocumentFiles();
            console.log('Structure chargée:', documentStructure);
            updateDocumentationSection(documentStructure);
        } catch (error) {
            console.error('Erreur lors du chargement de la structure:', error);
        }
    }

    // Fonction pour scanner les fichiers markdown
    async function scanDocumentFiles() {
        // Essayer d'abord de charger depuis le fichier généré
        if (window.getDocumentStructure) {
            const structure = window.getDocumentStructure();
            return convertFlatToHierarchical(structure);
        }
        
        // Structure fallback basée sur vos fichiers existants
        return {
            'root': ['index.md', 'accueil.md'],
            'semaine-1': {
                'electronique': ['gyroscope-accelerometre.md'],
                'it': ['robot.md'],
                'mecanique': ['documentation_meca.md']
            },
            'semaine-2': {
                'electronique': ['boite-noire.md'],
                'it': ['ros2-intro.md'],
                'mecanique': ['niveau-intermediaire.md']
            },
            'semaine-3': {
                'electronique': ['afficheur-7segments.md'],
                'it': ['pathfinding.md'],
                'mecanique': ['niveau-avance.md']
            },
            'test-final': ['convoyeur.md']
        };
    }

    // Convertir la structure plate en structure hiérarchique
    function convertFlatToHierarchical(flatStructure) {
        const hierarchical = {
            'root': flatStructure.root || []
        };

        Object.keys(flatStructure).forEach(key => {
            if (key === 'root') return;
            
            const parts = key.split('/');
            if (parts.length === 2) {
                const [semaine, domaine] = parts;
                if (!hierarchical[semaine]) {
                    hierarchical[semaine] = {};
                }
                hierarchical[semaine][domaine] = flatStructure[key];
            } else if (parts.length === 1) {
                hierarchical[key] = flatStructure[key];
            }
        });

        return hierarchical;
    }

    // Fonction pour mettre à jour la section Documentation
    function updateDocumentationSection(structure) {
        const documentationSection = document.getElementById('documentation');
        if (!documentationSection) {
            console.error('Section documentation non trouvée');
            return;
        }

        console.log('Mise à jour de la section Documentation', structure);

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
                const fileItem = createFileItem(file, 'Documentation');
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

        // Configurer le toggle principal
        setupDocumentationToggle();
        console.log('Section Documentation mise à jour avec succès');
    }

    // Configurer le toggle de la section Documentation
    function setupDocumentationToggle() {
        const docToggle = document.querySelector('[data-section="documentation"]');
        const documentationSection = document.getElementById('documentation');
        
        if (docToggle && documentationSection) {
            console.log('Configuration du toggle Documentation');
            
            // État initial : fermé
            documentationSection.classList.add('collapsed');
            const arrow = docToggle.querySelector('.arrow');
            if (arrow) arrow.textContent = '▶';
            
            // Supprimer anciens listeners
            docToggle.removeEventListener('click', handleDocumentationToggle);
            docToggle.addEventListener('click', handleDocumentationToggle);
        }
    }

    // Handler pour le toggle Documentation
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

    // Créer une sous-section
    function createDocumentationSubSection(sectionKey, sectionData) {
        const li = document.createElement('li');
        const sectionName = getSectionDisplayName(sectionKey);
        const sectionIcon = getSectionIcon(sectionKey);

        if (Array.isArray(sectionData)) {
            // Section simple
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
            // Section avec domaines
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

    // Créer un domaine
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

    // Créer un élément de fichier
    function createFileItem(filename, path) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        const displayName = getFileDisplayName(filename);
        const fileId = filename.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
        
        a.href = `#${fileId}`;
        a.className = 'nav-link file-link';
        a.textContent = displayName;
        a.setAttribute('data-file', `${path}/${filename}`);
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            loadFileContent(`${path}/${filename}`, fileId);
            
            document.querySelectorAll('.file-link').forEach(link => 
                link.classList.remove('active-file'));
            this.classList.add('active-file');
        });
        
        li.appendChild(a);
        return li;
    }

    // Charger contenu d'un fichier
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
                
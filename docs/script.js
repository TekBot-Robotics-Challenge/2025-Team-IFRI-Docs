document.addEventListener('DOMContentLoaded', function() {
    console.log('Démarrage de la sidebar avec auto-détection');
    
    // Charger la structure et construire la sidebar
    loadAndBuildSidebar();
    
    async function loadAndBuildSidebar() {
        try {
            // Essayer de charger le JSON d'abord
            const response = await fetch('structure.json');
            let structure = await response.json();
            
            // Vérifier et compléter avec les fichiers réels
            structure = await autoDetectFiles(structure);
            buildSidebar(structure);
        } catch (error) {
            console.error('Erreur chargement structure:', error);
            // Fallback: auto-détection complète
            const structure = await autoDetectFiles({});
            buildSidebar(structure);
        }
    }
    
    // Auto-détection des fichiers MD dans la structure Documentation
    async function autoDetectFiles(baseStructure) {
        console.log('Auto-détection des fichiers...');
        
        // Liste des fichiers potentiels à vérifier
        const filesToCheck = [
            // Semaine 1
            { section: 'semaine-1', domain: 'electronique', files: ['gyroscope-accelerometre.md', 'capteurs-avances.md', 'circuits-analogiques.md'] },
            { section: 'semaine-1', domain: 'it', files: ['robot.md', 'classes-avancees.md', 'tests-unitaires.md', 'architecture.md'] },
            { section: 'semaine-1', domain: 'mecanique', files: ['documentation_meca.md', 'conception-3d.md', 'materiaux.md'] },
            
            // Semaine 2
            { section: 'semaine-2', domain: 'electronique', files: ['boite-noire.md', 'communication-serie.md', 'protocoles.md'] },
            { section: 'semaine-2', domain: 'it', files: ['ros2-intro.md', 'ros2-nodes.md', 'ros2-topics.md'] },
            { section: 'semaine-2', domain: 'mecanique', files: ['niveau-intermediaire.md', 'assemblage.md', 'tolerances.md'] },
            
            // Semaine 3
            { section: 'semaine-3', domain: 'electronique', files: ['afficheur-7segments.md', 'interfaces.md', 'pcb-design.md'] },
            { section: 'semaine-3', domain: 'it', files: ['pathfinding.md', 'algorithmes-avances.md', 'optimisation.md'] },
            { section: 'semaine-3', domain: 'mecanique', files: ['niveau-avance.md', 'simulation.md', 'analyse-contraintes.md'] },
            
            // Test final
            { section: 'test-final', domain: null, files: ['convoyeur.md', 'integration.md', 'tests-systeme.md'] }
        ];
        
        const detectedStructure = { ...baseStructure };
        
        for (const item of filesToCheck) {
            for (const filename of item.files) {
                const path = item.domain ? 
                    `Documentation/${item.section}/${item.domain}/${filename}` :
                    `Documentation/${item.section}/${filename}`;
                
                try {
                    // Tenter de charger le fichier pour vérifier s'il existe
                    const response = await fetch(path, { method: 'HEAD' });
                    if (response.ok) {
                        // Le fichier existe, l'ajouter à la structure
                        if (!detectedStructure[item.section]) {
                            detectedStructure[item.section] = item.domain ? {} : [];
                        }
                        
                        if (item.domain) {
                            if (!detectedStructure[item.section][item.domain]) {
                                detectedStructure[item.section][item.domain] = [];
                            }
                            
                            // Vérifier si le fichier n'est pas déjà dans la liste
                            const exists = detectedStructure[item.section][item.domain].some(f => f.name === filename);
                            if (!exists) {
                                detectedStructure[item.section][item.domain].push({
                                    name: filename,
                                    title: generateTitle(filename),
                                    path: path
                                });
                                console.log(`Fichier détecté: ${path}`);
                            }
                        } else {
                            // Section sans domaine (test-final)
                            const exists = detectedStructure[item.section].some(f => f.name === filename);
                            if (!exists) {
                                detectedStructure[item.section].push({
                                    name: filename,
                                    title: generateTitle(filename),
                                    path: path
                                });
                                console.log(`Fichier détecté: ${path}`);
                            }
                        }
                    }
                } catch (error) {
                    // Fichier n'existe pas, continuer
                    console.log(`Fichier non trouvé: ${path}`);
                }
            }
        }
        
        return detectedStructure;
    }
    
    // Générer un titre à partir du nom de fichier
    function generateTitle(filename) {
        return filename
            .replace('.md', '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    function buildSidebar(structure) {
        const container = document.getElementById('documentation');
        if (!container) return;
        
        console.log('Construction sidebar avec structure:', structure);
        
        // Garder les éléments statiques
        const staticHTML = `
            <li><a href="#presentation" class="nav-link">Présentation du Challenge</a></li>
            <li><a href="#objectifs" class="nav-link">Objectifs</a></li>
            <li><a href="#format-epreuves" class="nav-link">Format des Épreuves</a></li>
        `;
        
        // Construire la structure dynamique
        let dynamicHTML = '';
        
        Object.keys(structure).forEach(sectionKey => {
            const sectionData = structure[sectionKey];
            dynamicHTML += createSectionHTML(sectionKey, sectionData);
        });
        
        // Injecter le HTML
        container.innerHTML = staticHTML + dynamicHTML;
        
        // Attacher les événements
        attachEvents();
        
        // Configurer le toggle principal
        setupMainToggle();
        
        console.log('Sidebar construite avec succès');
    }
    
    function createSectionHTML(sectionKey, sectionData) {
        const sectionName = getSectionName(sectionKey);
        const sectionIcon = getSectionIcon(sectionKey);
        
        let html = `
            <li data-dynamic="true">
                <div class="section-header" data-section="${sectionKey}">
                    ${sectionIcon} ${sectionName}
                    <span class="arrow">▶</span>
                </div>
                <ul class="section-content" id="content-${sectionKey}" style="display: none;">
        `;
        
        if (Array.isArray(sectionData)) {
            // Section simple (test-final)
            sectionData.forEach(file => {
                html += `<li><a href="#" class="file-link" data-file='${JSON.stringify(file)}'>${file.title}</a></li>`;
            });
        } else {
            // Section avec domaines
            Object.keys(sectionData).forEach(domainKey => {
                const domainName = getDomainName(domainKey);
                const domainIcon = getDomainIcon(domainKey);
                const domainFiles = sectionData[domainKey];
                
                html += `
                    <li>
                        <div class="domain-header" data-domain="${sectionKey}-${domainKey}">
                            ${domainIcon} ${domainName} (${domainFiles.length})
                            <span class="arrow">▶</span>
                        </div>
                        <ul class="domain-content" id="content-${sectionKey}-${domainKey}" style="display: none;">
                `;
                
                domainFiles.forEach(file => {
                    html += `<li><a href="#" class="file-link" data-file='${JSON.stringify(file)}'>${file.title}</a></li>`;
                });
                
                html += `</ul></li>`;
            });
        }
        
        html += `</ul></li>`;
        return html;
    }
    
    function attachEvents() {
        // Events pour les sections
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', function() {
                const sectionKey = this.getAttribute('data-section');
                const content = document.getElementById(`content-${sectionKey}`);
                const arrow = this.querySelector('.arrow');
                
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    arrow.textContent = '▼';
                } else {
                    content.style.display = 'none';
                    arrow.textContent = '▶';
                }
            });
        });
        
        // Events pour les domaines
        document.querySelectorAll('.domain-header').forEach(header => {
            header.addEventListener('click', function() {
                const domainKey = this.getAttribute('data-domain');
                const content = document.getElementById(`content-${domainKey}`);
                const arrow = this.querySelector('.arrow');
                
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    arrow.textContent = '▼';
                } else {
                    content.style.display = 'none';
                    arrow.textContent = '▶';
                }
            });
        });
        
        // Events pour les fichiers
        document.querySelectorAll('.file-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const fileData = JSON.parse(this.getAttribute('data-file'));
                showFileContent(fileData);
                
                // Retirer active des autres
                document.querySelectorAll('.file-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    function showFileContent(file) {
        const contentBody = document.querySelector('.content-body');
        const fileId = file.name.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
        
        // Créer la section
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
                        <p><strong>Fichier:</strong> ${file.path}</p>
                        <p><strong>Statut:</strong> Documentation disponible</p>
                    </div>
                </div>
            </div>
        `;
        
        section.scrollIntoView({ behavior: 'smooth' });
    }
    
    function setupMainToggle() {
        const mainToggle = document.querySelector('[data-section="documentation"]');
        const docSection = document.getElementById('documentation');
        
        if (mainToggle && docSection) {
            const arrow = mainToggle.querySelector('.arrow');
            if (arrow) arrow.textContent = '▼'; // Ouvert par défaut
            
            mainToggle.addEventListener('click', function() {
                docSection.classList.toggle('collapsed');
                if (docSection.classList.contains('collapsed')) {
                    arrow.textContent = '▶';
                } else {
                    arrow.textContent = '▼';
                }
            });
        }
    }
    
    // Ajouter une fonction pour rafraîchir la sidebar
    window.refreshSidebar = async function() {
        console.log('Rafraîchissement de la sidebar...');
        await loadAndBuildSidebar();
    };
    
    // Auto-refresh toutes les 30 secondes en mode développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setInterval(async () => {
            console.log('Auto-refresh de la sidebar...');
            await loadAndBuildSidebar();
        }, 30000); // 30 secondes
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
        return key.startsWith('semaine') ? '📅' : '🏆';
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
});
            
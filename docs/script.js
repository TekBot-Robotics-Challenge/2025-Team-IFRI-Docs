document.addEventListener('DOMContentLoaded', function() {
    console.log('Démarrage de la sidebar');
    
    // Charger la structure et construire la sidebar
    loadAndBuildSidebar();
    
    async function loadAndBuildSidebar() {
        try {
            const response = await fetch('structure.json');
            const structure = await response.json();
            buildSidebar(structure);
        } catch (error) {
            console.error('Erreur chargement structure:', error);
        }
    }
    
    function buildSidebar(structure) {
        const container = document.getElementById('documentation');
        if (!container) return;
        
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
                html += `
                    <li>
                        <div class="domain-header" data-domain="${sectionKey}-${domainKey}">
                            ${domainIcon} ${domainName}
                            <span class="arrow">▶</span>
                        </div>
                        <ul class="domain-content" id="content-${sectionKey}-${domainKey}" style="display: none;">
                `;
                
                sectionData[domainKey].forEach(file => {
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

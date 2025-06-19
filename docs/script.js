document.addEventListener('DOMContentLoaded', function() {
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
                } else {
                    arrow.textContent = '▼';
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
                } else {
                    arrow.textContent = '▶';
                }
            }
        });
    });
    
    // Get main elements
    const mainContent = document.getElementById('main-content');
    const mainHeader = document.getElementById('main-header');
    const markdownContainer = document.getElementById('markdown-container');
    
    // Handle markdown file links
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('markdown-link')) {
            e.preventDefault();
            const filePath = e.target.getAttribute('data-file');
            loadMarkdownFile(filePath);
            
            // Update active state
            document.querySelector('.nav-item.active')?.classList.remove('active');
            e.target.closest('.nav-item')?.classList.add('active');
        }
    });
    
    // Function to load markdown files
    async function loadMarkdownFile(filePath) {
        try {
            console.log('Loading file:', filePath);
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const markdownText = await response.text();
            const htmlContent = convertMarkdownToHTML(markdownText);
            
            // Hide main content and show markdown content
            if (mainContent) mainContent.classList.add('hidden');
            if (mainHeader) mainHeader.classList.add('hidden');
            if (markdownContainer) {
                markdownContainer.classList.add('active');
                markdownContainer.innerHTML = `
                    <a href="#" class="back-button" id="back-to-main">Retour à l'accueil</a>
                    <div class="markdown-wrapper">
                        ${htmlContent}
                    </div>
                `;
            }
            
            // Handle back button
            const backButton = document.getElementById('back-to-main');
            if (backButton) {
                backButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    showMainContent();
                });
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('Error loading markdown file:', error);
            
            // Show error message
            if (markdownContainer) {
                markdownContainer.innerHTML = `
                    <a href="#" class="back-button" id="back-to-main">Retour à l'accueil</a>
                    <div class="info-box" style="background-color: #dc3545; margin: 20px 0;">
                        <span class="info-icon">⚠️</span>
                        <div>
                            <p style="margin: 0; color: white;"><strong>Erreur lors du chargement du fichier:</strong></p>
                            <p style="margin: 0; color: white;">${filePath}</p>
                            <p style="margin: 5px 0 0 0; color: white; font-size: 14px;">${error.message}</p>
                        </div>
                    </div>
                `;
                
                if (mainContent) mainContent.classList.add('hidden');
                if (mainHeader) mainHeader.classList.add('hidden');
                markdownContainer.classList.add('active');
                
                const backButton = document.getElementById('back-to-main');
                if (backButton) {
                    backButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        showMainContent();
                    });
                }
            }
        }
    }
    
    // Function to show main content
    function showMainContent() {
        if (mainContent) mainContent.classList.remove('hidden');
        if (mainHeader) mainHeader.classList.remove('hidden');
        if (markdownContainer) markdownContainer.classList.remove('active');
        
        // Reset active navigation to home
        document.querySelector('.nav-item.active')?.classList.remove('active');
        const homeLink = document.querySelector('a[href="#accueil"]');
        if (homeLink) {
            homeLink.closest('.nav-item')?.classList.add('active');
        }
    }
    
    // Improved markdown to HTML converter
    function convertMarkdownToHTML(markdown) {
        let html = markdown;
        
        // Remove front matter (YAML between ---)
        html = html.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
        
        // Convert headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Convert bold and italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Convert links
        html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '<a href="$2" class="link">$1</a>');
        
        // Convert code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Convert inline code
        html = html.replace(/`([^`]*)`/g, '<code>$1</code>');
        
        // Convert tables
        const tableRegex = /\|(.+)\|\n\|[-\s\|]+\|\n((?:\|.+\|\n?)*)/g;
        html = html.replace(tableRegex, function(match, header, rows) {
            const headerCells = header.split('|').filter(cell => cell.trim()).map(cell => `<th>${cell.trim()}</th>`).join('');
            const rowsHtml = rows.trim().split('\n').map(row => {
                const cells = row.split('|').filter(cell => cell.trim()).map(cell => `<td>${cell.trim()}</td>`).join('');
                return `<tr>${cells}</tr>`;
            }).join('');
            return `<table><thead><tr>${headerCells}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
        });
        
        // Convert line breaks to paragraphs
        html = html.split('\n\n').map(paragraph => {
            paragraph = paragraph.trim();
            if (paragraph && !paragraph.startsWith('<')) {
                return `<p>${paragraph}</p>`;
            }
            return paragraph;
        }).join('\n');
        
        // Clean up empty paragraphs and fix formatting
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<table>[\s\S]*?<\/table>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>[\s\S]*?<\/pre>)<\/p>/g, '$1');
        
        return html;
    }
    
    // Handle regular navigation links
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link') && 
            !e.target.classList.contains('markdown-link') && 
            e.target.getAttribute('href') && 
            e.target.getAttribute('href').startsWith('#')) {
            
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            // Show main content if markdown is active
            if (markdownContainer && markdownContainer.classList.contains('active')) {
                showMainContent();
            }
            
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
            
            // Update active state
            document.querySelector('.nav-item.active')?.classList.remove('active');
            e.target.closest('.nav-item')?.classList.add('active');
        }
    });
    
    // Search functionality
    if (searchInput) {
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
    }
    
    // Initialize collapsed state for some sections
    const initialCollapsed = ['semaine2', 'semaine3', 'test-final'];
    initialCollapsed.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('collapsed');
        }
    });
});
});

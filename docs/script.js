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
    const mainContent = document.getElementById('main-content');
    const mainHeader = document.getElementById('main-header');
    const markdownContainer = document.getElementById('markdown-container');
    
    // Handle markdown file links
    const markdownLinks = document.querySelectorAll('.markdown-link');
    markdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filePath = this.getAttribute('data-file');
            loadMarkdownFile(filePath);
            
            // Update active state
            document.querySelector('.nav-item.active')?.classList.remove('active');
            this.closest('.nav-item')?.classList.add('active');
        });
    });
    
    // Function to load markdown files
    async function loadMarkdownFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error('File not found');
            
            const markdownText = await response.text();
            const htmlContent = convertMarkdownToHTML(markdownText);
            
            // Hide main content and show markdown content
            mainContent.classList.add('hidden');
            mainHeader.classList.add('hidden');
            markdownContainer.classList.add('active');
            
            // Add back button and content
            markdownContainer.innerHTML = `
                <a href="#" class="back-button" id="back-to-main">Retour à l'accueil</a>
                ${htmlContent}
            `;
            
            // Handle back button
            document.getElementById('back-to-main').addEventListener('click', function(e) {
                e.preventDefault();
                showMainContent();
            });
            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('Error loading markdown file:', error);
            // Show error message
            markdownContainer.innerHTML = `
                <a href="#" class="back-button" id="back-to-main">Retour à l'accueil</a>
                <div class="info-box" style="background-color: #dc3545;">
                    <span class="info-icon">⚠️</span>
                    <p>Erreur lors du chargement du fichier: ${filePath}</p>
                </div>
            `;
            
            mainContent.classList.add('hidden');
            mainHeader.classList.add('hidden');
            markdownContainer.classList.add('active');
            
            document.getElementById('back-to-main').addEventListener('click', function(e) {
                e.preventDefault();
                showMainContent();
            });
        }
    }
    
    // Function to show main content
    function showMainContent() {
        mainContent.classList.remove('hidden');
        mainHeader.classList.remove('hidden');
        markdownContainer.classList.remove('active');
        
        // Reset active navigation
        document.querySelector('.nav-item.active')?.classList.remove('active');
        document.querySelector('a[href="#accueil"]').closest('.nav-item').classList.add('active');
    }
    
    // Simple markdown to HTML converter
    function convertMarkdownToHTML(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
        
        // Links
        html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="link">$1</a>');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
        
        // Inline code
        html = html.replace(/`([^`]*)`/gim, '<code>$1</code>');
        
        // Tables
        html = html.replace(/\|(.+)\|/g, function(match, content) {
            const cells = content.split('|').map(cell => cell.trim());
            return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
        
        html = html.replace(/(<tr>.*<\/tr>)/s, '<table>$1</table>');
        
        // Paragraphs
        html = html.replace(/\n\n/gim, '</p><p>');
        html = '<p>' + html + '</p>';
        
        // Clean up
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<table>)/g, '$1');
        html = html.replace(/(<\/table>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        
        return html;
    }
    
    // Smooth scrolling for regular navigation links
    navLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#') && !link.classList.contains('markdown-link')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                // Show main content if markdown is active
                if (markdownContainer.classList.contains('active')) {
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
                this.closest('.nav-item')?.classList.add('active');
            });
        }
    });
    
    // Highlight current section on scroll
    function updateActiveSection() {
        if (markdownContainer.classList.contains('active')) return;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.startsWith('#') && !link.classList.contains('markdown-link')) {
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
});

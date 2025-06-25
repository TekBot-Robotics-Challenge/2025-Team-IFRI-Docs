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
    
    // Handle collapsible sections - Fix the toggle functionality
    const sectionToggles = document.querySelectorAll('.section-toggle');
    
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            const arrow = this.querySelector('.arrow');
            
            console.log('Toggling section:', sectionId); // Debug
            
            if (section) {
                // Toggle classes
                if (section.classList.contains('collapsed')) {
                    section.classList.remove('collapsed');
                    section.classList.add('expanded');
                    arrow.textContent = '▼';
                    console.log('Expanded section:', sectionId); // Debug
                } else {
                    section.classList.remove('expanded');
                    section.classList.add('collapsed');
                    arrow.textContent = '▶';
                    console.log('Collapsed section:', sectionId); // Debug
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
            document.querySelector('.nav-link.active')?.classList.remove('active');
            e.target.classList.add('active');
        }
    });
    
    // Function to load markdown files - Updated for better file loading
    async function loadMarkdownFile(filePath) {
        try {
            console.log('Loading file:', filePath);
            
            // Try different path variations for GitHub Pages
            const possiblePaths = [
                filePath,
                `./${filePath}`,
                `../${filePath}`,
                `/${filePath}`
            ];
            
            let response = null;
            let workingPath = null;
            
            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) {
                        workingPath = path;
                        break;
                    }
                } catch (err) {
                    console.log(`Failed to load from: ${path}`);
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`Could not load file: ${filePath}`);
            }
            
            console.log(`Successfully loaded from: ${workingPath}`);
            const markdownText = await response.text();
            const htmlContent = convertMarkdownToHTML(markdownText);
            
            // Hide main content and show markdown content
            if (mainContent) mainContent.classList.add('hidden');
            // Don't hide header anymore: if (mainHeader) mainHeader.classList.add('hidden');
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
            showErrorMessage(filePath, error.message);
        }
    }
    
    // Function to show error message - Updated to keep header visible
    function showErrorMessage(filePath, errorMessage) {
        if (markdownContainer) {
            markdownContainer.innerHTML = `
                <a href="#" class="back-button" id="back-to-main">Retour à l'accueil</a>
                <div class="info-box" style="background-color: #dc3545; margin: 40px;">
                    <span class="info-icon">⚠️</span>
                    <div>
                        <p style="margin: 0; color: white;"><strong>Erreur lors du chargement du fichier:</strong></p>
                        <p style="margin: 0; color: white;">${filePath}</p>
                        <p style="margin: 5px 0 0 0; color: white; font-size: 14px;">${errorMessage}</p>
                        <p style="margin: 10px 0 0 0; color: white; font-size: 12px;">Vérifiez que le fichier existe dans le dossier Documentation.</p>
                    </div>
                </div>
            `;
            
            if (mainContent) mainContent.classList.add('hidden');
            // Don't hide header: if (mainHeader) mainHeader.classList.add('hidden');
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
    
    // Function to show main content - Keep header always visible
    function showMainContent() {
        if (mainContent) mainContent.classList.remove('hidden');
        // Header stays visible: if (mainHeader) mainHeader.classList.remove('hidden');
        if (markdownContainer) markdownContainer.classList.remove('active');
        
        // Reset active navigation to home
        document.querySelector('.nav-link.active')?.classList.remove('active');
        const homeLink = document.querySelector('a[href="#accueil"]');
        if (homeLink) {
            homeLink.classList.add('active');
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
        
        // Convert images (must come before links)
        html = html.replace(/!\[([^\]]*)\]\(([^\)]*)\)/g, '<img src="$2" alt="$1">');
        
        // Convert links
        html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '<a href="$2">$1</a>');
        
        // Enhanced code blocks with language detection
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, language, content) {
            const lang = language || 'text';
            return `<pre data-language="${lang}"><code>${content}</code></pre>`;
        });
        
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
        
        // Convert unordered lists
        html = html.replace(/^\* (.+$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Convert numbered lists
        html = html.replace(/^\d+\. (.+$)/gim, '<li>$1</li>');
        
        // Convert line breaks to paragraphs
        html = html.split('\n\n').map(paragraph => {
            paragraph = paragraph.trim();
            if (paragraph && !paragraph.startsWith('<') && !paragraph.match(/^(#{1,6}|[-*]|\d+\.)/)) {
                return `<p>${paragraph}</p>`;
            }
            return paragraph;
        }).join('\n');
        
        // Clean up empty paragraphs and fix formatting
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<table>[\s\S]*?<\/table>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>[\s\S]*?<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>[\s\S]*?<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ol>[\s\S]*?<\/ol>)<\/p>/g, '$1');
        
        return html;
    }
    
    // Handle regular navigation links
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link') && 
            !e.target.classList.contains('markdown-link') && 
            !e.target.classList.contains('disabled') &&
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
            document.querySelector('.nav-link.active')?.classList.remove('active');
            e.target.classList.add('active');
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
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('backToTop');
    
    // Show button when user scrolls down 300px from the top
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mobile sidebar toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Open sidebar
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
    });
    
    // Close sidebar functions
    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Close sidebar when X is clicked
    sidebarClose.addEventListener('click', closeSidebar);
    
    // Close sidebar when overlay is clicked
    overlay.addEventListener('click', closeSidebar);
    
    // Close sidebar when a link is clicked (mobile only)
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
});

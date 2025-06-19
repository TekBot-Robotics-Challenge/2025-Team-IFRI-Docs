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
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Update active state
                document.querySelector('.nav-item.active')?.classList.remove('active');
                this.closest('.nav-item')?.classList.add('active');
            });
        }
    });
    
    // Highlight current section on scroll
    function updateActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.startsWith('#')) {
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

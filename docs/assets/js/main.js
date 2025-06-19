document.addEventListener('DOMContentLoaded', function() {
    // Handle sidebar toggle for dropdown menus
    const toggleButtons = document.querySelectorAll('.sidebar-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            
            if (submenu && submenu.classList.contains('sidebar-submenu')) {
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                    this.classList.remove('expanded');
                } else {
                    submenu.style.display = 'block';
                    this.classList.add('expanded');
                }
            }
        });
    });

    // Auto-expand current section in sidebar based on URL
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.sidebar-nav-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href)) {
            // Mark as active
            item.classList.add('active');
            
            // Expand all parent menus
            let parent = item.parentElement;
            while (parent) {
                if (parent.classList.contains('sidebar-submenu')) {
                    parent.style.display = 'block';
                    const parentToggle = parent.previousElementSibling;
                    if (parentToggle && parentToggle.classList.contains('sidebar-toggle')) {
                        parentToggle.classList.add('expanded');
                    }
                }
                parent = parent.parentElement;
            }
        }
    });

    // Generate table of contents for the current page
    const headers = document.querySelectorAll('.primary-content h2, .primary-content h3');
    const tocContainer = document.getElementById('toc-container');
    
    if (headers.length > 0 && tocContainer) {
        const tocList = document.createElement('ul');
        
        headers.forEach(function(header) {
            // Create anchor ID if not exists
            if (!header.id) {
                header.id = header.textContent.toLowerCase()
                    .replace(/[^\w\s]/gi, '')
                    .replace(/\s+/g, '-');
            }
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#' + header.id;
            link.textContent = header.textContent;
            
            // Indent h3 elements
            if (header.tagName === 'H3') {
                listItem.style.paddingLeft = '15px';
            }
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        tocContainer.appendChild(tocList);
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('open');
        });
    }
});

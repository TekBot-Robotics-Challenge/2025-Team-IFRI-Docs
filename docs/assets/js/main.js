document.addEventListener('DOMContentLoaded', function() {
    // Auto-expand active section in sidebar
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.sidebar-nav-item');
    
    menuItems.forEach(item => {
        if (currentPath.includes(item.getAttribute('href'))) {
            // Expand all parent submenu elements
            let parent = item.parentElement;
            while (parent) {
                if (parent.classList.contains('sidebar-submenu')) {
                    parent.style.display = 'block';
                }
                parent = parent.parentElement;
            }
        }
    });

    // Handle submenu toggles
    const submenuParents = document.querySelectorAll('.sidebar-nav-item + .sidebar-submenu');
    
    submenuParents.forEach(submenu => {
        const parentLink = submenu.previousElementSibling;
        
        // Initially hide all submenus
        if (!submenu.querySelector('.active')) {
            submenu.style.display = 'none';
        }
        
        // Toggle submenu visibility on click
        parentLink.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            
            if (submenu && submenu.classList.contains('sidebar-submenu')) {
                submenu.style.display = submenu.style.display === 'none' || submenu.style.display === '' ? 'block' : 'none';
            }
        });
    });
});

// Gestion du menu mobile et du thème
document.addEventListener('DOMContentLoaded', function() {
  // Configuration du menu mobile
  if (window.innerWidth <= 768) {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    
    document.body.appendChild(menuToggle);
    
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.transform = 'translateX(-100%)';
    sidebar.style.transition = 'transform 0.3s ease-in-out';
    
    menuToggle.addEventListener('click', function() {
      if (sidebar.style.transform === 'translateX(-100%)') {
        sidebar.style.transform = 'translateX(0)';
      } else {
        sidebar.style.transform = 'translateX(-100%)';
      }
    });
  }
  
  // Gestion des sections déroulantes de la barre latérale
  const sectionTitles = document.querySelectorAll('.nav-section-title');
  sectionTitles.forEach(function(title) {
    title.addEventListener('click', function() {
      const section = this.parentElement;
      section.classList.toggle('collapsed');
    });
  });
  
  // Détecter la section active et s'assurer qu'elle est déroulée
  const navSections = document.querySelectorAll('.nav-section');
  navSections.forEach(function(section) {
    const activeItem = section.querySelector('.nav-item.active');
    if (activeItem) {
      section.classList.remove('collapsed');
    }
  });
  
  // Gestion du thème clair/sombre
  const themeToggle = document.getElementById('themeToggle');
  
  if (themeToggle) {
    // Vérifier si l'utilisateur a une préférence stockée
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      themeToggle.textContent = '☀️';
    } else {
      document.body.classList.remove('light-theme');
      themeToggle.textContent = '🌙';
    }
    
    // Basculer entre thème clair et sombre
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('light-theme');
      
      if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '☀️';
      } else {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '🌙';
      }
    });
  }
  
  // Recherche
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm.length > 0) {
          window.location.href = `https://github.com/search?q=${encodeURIComponent(searchTerm)}+repo:${encodeURIComponent(window.location.pathname.split('/')[1])}&type=code`;
        }
      }
    });
  }
});

// Highlight current section in sidebar
document.addEventListener('DOMContentLoaded', function() {
  // Get current path
  const path = window.location.pathname;
  
  // Find the corresponding nav item and add active class
  document.querySelectorAll('.sidebar-nav .nav-item a').forEach(function(link) {
    if (link.getAttribute('href') === path) {
      link.parentElement.classList.add('active');
    }
  });
});

// Gestion des sous-menus
document.addEventListener('DOMContentLoaded', function() {
  // Gestion des sous-menus (IT)
  const itemsWithChildren = document.querySelectorAll('.nav-item-with-children');
  itemsWithChildren.forEach(function(item) {
    const parent = item.querySelector('.nav-item-parent');
    parent.addEventListener('click', function() {
      item.classList.toggle('collapsed');
    });
    
    // Détecter si un enfant est actif et ouvrir le parent
    const activeChild = item.querySelector('.nav-item.active');
    if (activeChild) {
      item.classList.remove('collapsed');
    } else {
      item.classList.add('collapsed');
    }
  });
});

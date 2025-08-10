// Fonction pour inclure les fragments HTML (menu, header, footer, etc.)


function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');

    elements.forEach(el => {
        let file = el.getAttribute('data-include');

        const loc = window.location;
        const base = loc.origin;
        const path = loc.pathname;
        const rootFolder = path.split('/')[1];

        if (!file.startsWith('/')) {
            file = base + '/' + rootFolder + '/' + file;
        } else {
            file = base + '/' + rootFolder + file;
        }

        fetch(file)
            .then(response => {
                if (!response.ok) throw new Error('Erreur ' + response.status);
                return response.text();
            })
            .then(data => {
                el.innerHTML = data;
                // Après avoir inséré le HTML, on initialise les sous-menus
                initSubmenuToggle();
            })
            .catch(err => {
                console.error("Erreur chargement include:", file, err);
                el.innerHTML = `<p style="color: red;">Erreur chargement include: ${file}</p>`;
            });
    });
}

// Fonction pour attacher les événements click sur les liens des sous-menus
function initSubmenuToggle() {
    const menuItems = document.querySelectorAll(".menu-item.has-submenu > a");

    menuItems.forEach(item => {
        // On retire les éventuels anciens écouteurs pour éviter doublons
        item.removeEventListener("click", toggleSubmenu);
        item.addEventListener("click", toggleSubmenu);
    });
}

// Fonction appelée au clic sur un lien avec sous-menu : ouverture / fermeture
function toggleSubmenu(e) {
    e.preventDefault();

    const parent = e.currentTarget.parentElement;
    const submenu = parent.querySelector(".submenu");

    parent.classList.toggle("open");

    if (parent.classList.contains("open")) {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
    } else {
        submenu.style.maxHeight = null;
    }
}



// Au chargement du DOM, on lance l'inclusion des fragments HTML
document.addEventListener("DOMContentLoaded", function () {
    includeHTML();

    const mainContent = document.getElementById("main-content");

    // Charger le contenu si l'URL actuelle pointe vers une sous-page
    if (window.location.pathname.endsWith(".html") && !window.location.pathname.endsWith("index.html")) {
        fetch(window.location.pathname)
            .then(r => r.text())
            .then(html => mainContent.innerHTML = html);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("main-content");

    document.addEventListener("click", function (e) {
        const link = e.target.closest("a[data-link]");
        if (link) {
            e.preventDefault();
            const url = link.getAttribute("href");

            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
                    return response.text();
                })
                .then(html => {
                    mainContent.innerHTML = html;
                    window.history.pushState({ path: url }, "", url); // Change l'URL sans recharger
                })
                .catch(err => {
                    mainContent.innerHTML = `<p style="color:red;">Erreur de chargement: ${err.message}</p>`;
                });
        }
    });

    // Permet navigation avec bouton "Retour" du navigateur
    window.addEventListener("popstate", function (e) {
        if (e.state && e.state.path) {
            fetch(e.state.path)
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                });
        }
    });
});

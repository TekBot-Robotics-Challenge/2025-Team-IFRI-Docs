# Documentation du Projet : Dashboard Industriel de Tri des Déchets

Ce document retrace l'intégralité du processus de développement, de débogage et d'amélioration du projet de tableau de bord industriel.

---

## 1. Objectif du Projet

L'objectif principal est de développer un système de supervision en temps réel pour une chaîne de tri de déchets. Le système doit permettre de visualiser les données envoyées par un convoyeur (simulé ou via un microcontrôleur ESP32), de les stocker, et d'interagir avec un assistant IA pour obtenir des analyses et des rapports.



---

## 2. Accès à l'Application

L'application est déployée et accessible en ligne à l'adresse suivante :

**[https://convoyeur-front-r5y5.vercel.app/](https://convoyeur-front-r5y5.vercel.app/)**

---

## 3. Instructions d'Installation et de Lancement

Voici la procédure pour mettre en place et lancer l'environnement de développement complet.

### Prérequis
- Node.js et npm installés sur votre machine.
- Un compte MongoDB Atlas avec une base de données créée.
- Une clé d'API pour Google Gemini.

### Étape 1 : Configuration du Backend (`/server`)

1.  **Installer les dépendances :**
    ```bash
    cd server
    npm install
    ```

2.  **Créer le fichier de configuration :**
    Créez un fichier `.env` à la racine du dossier `server`.

3.  **Remplir le fichier `.env` :**
    Ce fichier doit contenir les clés et adresses de vos services externes.
    ```
    MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>...
    GEMINI_API_KEY=AIzaSy...votre_cle_api
    ```

### Étape 2 : Configuration du Frontend (`/client`)

1.  **Installer les dépendances :**
    ```bash
    cd client
    npm install
    ```

### Étape 3 : Lancement de l'Application

Pour faire fonctionner le projet, vous devez lancer les 3 composants dans 3 terminaux distincts :

-   **Terminal 1 : Lancer le Serveur Backend**
    ```bash
    cd server
    npm start
    ```
    *(Cette commande utilise `nodemon` pour un redémarrage automatique du serveur lors des modifications.)*

-   **Terminal 2 : Lancer l'Application Frontend**
    ```bash
    cd client
    npm start
    ```
    *(Le dashboard sera accessible à l'adresse http://localhost:3000)*

-   **Terminal 3 : Lancer le Simulateur (optionnel)**
    ```bash
    cd server
    node simulate.js
    ```
    *(Ce script envoie des événements de couleur au serveur pour simuler l'ESP32.)*

---

## 4. Guide de Déploiement

Cette section explique comment déployer l'application en production. La stratégie repose sur une séparation claire entre le frontend (l'application React) et le backend (le serveur Node.js).

### Principe d'Architecture

-   **Frontend (Client) :** C'est une application statique. Après la compilation (`build`), elle est composée de fichiers HTML, CSS et JavaScript qui peuvent être servis par n'importe quel service d'hébergement statique.
-   **Backend (Serveur) :** C'est une application Node.js qui doit tourner en permanence sur un serveur pour répondre aux requêtes API et gérer la connexion WebSocket.

### Étape 1 : Préparer le Frontend pour la Production

1.  **Configurer l'URL du Backend :** Dans le code du frontend (par exemple, dans `client/src/socket.js`), l'URL de connexion au serveur est actuellement en "dur" (`http://localhost:3001`). Pour la production, il faut qu'elle pointe vers l'URL de votre serveur déployé.
    *   **Ancienne approche (non recommandée) :** Modifier directement l'URL dans le code avant de `build`.
    *   **Nouvelle approche (recommandée) :** Utiliser les variables d'environnement de React. Créez un fichier `.env.production` dans le dossier `client` et ajoutez-y :
        ```
        REACT_APP_BACKEND_URL=https://votre-backend.onrender.com
        ```
        Utilisez ensuite `process.env.REACT_APP_BACKEND_URL` dans votre code pour que l'URL soit automatiquement sélectionnée lors du build de production.

2.  **Compiler l'application :**
    *   Placez-vous dans le dossier `client`.
    *   Lancez la commande : `npm run build`.
    *   Cela va créer un dossier `build` contenant tous les fichiers statiques optimisés pour la production.

### Étape 2 : Déployer le Frontend sur Vercel (Déjà effectué)

Le frontend a été déployé avec succès sur Vercel.

- **URL de Production :** [https://convoyeur-front-r5y5.vercel.app/](https://convoyeur-front-r5y5.vercel.app/)

Pour référence, voici les étapes qui ont été suivies :

1.  Créez un compte sur Vercel et liez-le à votre compte GitHub/GitLab.
2.  Importez votre projet.
3.  Configurez le déploiement :
    *   **Framework Preset :** `Create React App`.
    *   **Build Command :** `npm run build`.
    *   **Output Directory :** `client/build` (Vercel le détecte souvent automatiquement).
    *   **Root Directory :** `client`.
4.  Vercel déploiera automatiquement votre frontend à chaque `push` sur votre branche principale.

### Étape 3 : Déployer le Backend

Le serveur Node.js peut être hébergé sur des plateformes comme **Render** ou Heroku. Render offre un plan gratuit généreux.

1.  Créez un compte sur Render.
2.  Créez un nouveau "Web Service" et connectez-le à votre dépôt Git.
3.  Configurez le service :
    *   **Environment :** `Node`.
    *   **Build Command :** `npm install`.
    *   **Start Command :** `node index.js`.
    *   **Root Directory :** `server`.
4.  **Variables d'Environnement :** C'est l'étape la plus importante. Allez dans l'onglet "Environment" de votre service Render et ajoutez les variables secrètes :
    *   `MONGODB_URI` : Votre chaîne de connexion MongoDB Atlas.
    *   `GEMINI_API_KEY` : Votre clé API Gemini.
    *   `PASSWORD_ADMIN` : Le mot de passe pour la section admin.
    *   `CLIENT_URL`: L'URL de votre frontend déployé sur Vercel (ex: `https://votre-frontend.vercel.app`). Cette variable est cruciale pour la configuration de CORS.

Une fois ces étapes terminées, votre application sera entièrement en ligne, avec un frontend et un backend qui communiquent de manière sécurisée.

---

## 5. Chronologie du Développement et Résolution des Problèmes

Cette section détaille les défis rencontrés et les solutions apportées de manière chronologique.

### Phase 1 : Le simulateur ne communique pas

-   **Problème Identifié :** Le script `simulate.js` tentait d'envoyer des données au serveur via une requête `POST /api/event`, mais le serveur n'avait pas de route pour gérer cette requête. Le serveur renvoyait une erreur `404 Not Found`.
-   **Solution Apportée :** Ajout d'une nouvelle route `app.post('/api/event', ...)` dans `server/index.js`. Cette route a été conçue pour :
    1.  Recevoir la couleur de l'événement.
    2.  Créer un nouvel enregistrement dans la base de données MongoDB.
    3.  Émettre un événement `newEvent` via Socket.IO pour notifier le frontend en temps réel.

### Phase 2 : Améliorer l'efficacité du développement

-   **Problème Identifié :** Le redémarrage manuel du serveur (`Ctrl+C` puis `node index.js`) après chaque modification du code était répétitif et ralentissait le développement.
-   **Solution Apportée :**
    1.  Installation de la dépendance de développement `nodemon` : `npm install nodemon --save-dev`.
    2.  Ajout d'un script `"start": "nodemon index.js"` dans le fichier `package.json` du serveur.
    3.  Adoption de la commande `npm start` comme standard pour lancer le serveur.

### Phase 3 : Sécuriser et centraliser la configuration

-   **Problème Identifié :** La chaîne de connexion à la base de données MongoDB était écrite en dur dans le fichier `server/index.js`. C'est une faille de sécurité et un problème de maintenance majeur.
-   **Solution Apportée :**
    1.  Déplacement de la chaîne de connexion `MONGO_URI` dans le fichier `.env`.
    2.  Modification du code `mongoose.connect()` pour qu'il utilise `process.env.MONGODB_URI`.
    3.  Le fichier `.env` est ainsi devenu le seul endroit pour gérer toutes les clés et configurations sensibles.

### Phase 4 : Diagnostic des erreurs de services externes

### Phase 5 : Rendre l'application entièrement responsive

Rendre une application de bureau complexe et dense en informations parfaitement utilisable sur un écran de téléphone est un défi majeur. Cette phase a nécessité plusieurs itérations pour surmonter des problèmes de mise en page CSS profonds.

-   **Objectif :** L'application doit être fluide et esthétique sur mobile, sans altérer le design sur grand écran.

-   **Défi n°1 : Le défilement vertical et la navigation par onglets cassés**
    -   *Symptômes :* En réduisant la taille de l'écran, la barre de navigation des onglets devenait inaccessible (coupée par le bord de l'écran) et, lors des tentatives de correction, le défilement vertical de tout le contenu se cassait.
    -   *Analyse et tentatives infructueuses :*
        1.  **Première tentative (`overflow: visible`) :** Modifier la propriété `overflow` du conteneur principal pour la rendre `visible` a bien révélé les onglets, mais a complètement supprimé la contrainte de hauteur, ce qui a cassé le défilement vertical. **Échec.**
        2.  **Deuxième tentative (`overflow: auto` et `min-height: 0`) :** Plusieurs tentatives ont été faites en utilisant des combinaisons de `overflow: auto` et le correctif classique `min-height: 0` pour les conteneurs flexbox dans une grille. Étonnamment, ces solutions standards n'ont pas fonctionné, indiquant un conflit plus profond entre la grille CSS principale de l'application et la mise en page flexbox des onglets. **Échec.**
    -   **Solution Finale et Robuste :** La décision a été prise de refactoriser la mise en page interne du composant `Tabs`. La mise en page **Flexbox a été remplacée par une mise en page CSS Grid** (`display: grid; grid-template-rows: auto 1fr;`). Cette approche est beaucoup plus robuste pour ce cas d'usage car elle définit explicitement que la barre d'onglets prend sa hauteur naturelle (`auto`) et que la zone de contenu prend tout le reste de l'espace (`1fr`) tout en étant scrollable. Cela a résolu définitivement le conflit.

-   **Défi n°2 : Des widgets vides sur mobile**
    -   *Symptômes :* Le graphique de répartition et le journal d'événements apparaissaient comme des boîtes vides, avec seulement un titre.
    -   *Analyse :* La cause était que ces widgets, pour être responsifs, avaient besoin que leur conteneur parent ait une hauteur définie. Or, sur mobile, la grille principale avait des lignes à hauteur automatique (`grid-template-rows: auto`), ce qui donnait une hauteur de `0` à ces conteneurs.
    -   **Solution Apportée :** Une hauteur minimale fixe (`min-height: 250px`) a été ajoutée via une media query aux classes `.proportions-area` et `.ticker-area` dans `App.css`. Cela garantit que les conteneurs ont une taille suffisante pour que leur contenu (graphique ou liste) puisse s'afficher correctement.

### Phase 6 : Diagnostic des erreurs de services externes

-   **Problème 1 : Instabilité de la connexion MongoDB**
    -   *Symptômes :* Erreurs `Buffering timed out` puis `MongoNetworkError: read ETIMEDOUT` dans la console du serveur.
    -   *Diagnostic :* Ces erreurs indiquent que le serveur n'arrive plus à communiquer avec la base de données MongoDB Atlas. La cause la plus probable est que **l'adresse IP publique de la machine de développement a changé** et n'est plus autorisée dans la **liste d'accès IP (IP Access List)** de MongoDB Atlas.
    -   *Solution :* Se connecter à son tableau de bord MongoDB Atlas, naviguer vers `Network Access` et ajouter l'adresse IP actuelle (`Add Current IP Address`).

-   **Problème 2 : Erreurs de l'API Google Gemini**
    -   *Symptômes :* Erreurs `503 Service Unavailable` et `404 Not Found`.
    -   *Diagnostic :* Une erreur `503` signifie que les serveurs de Google sont temporairement surchargés. Une erreur `404` signifie que le nom du modèle demandé (ex: `gemini-1.0-pro`, `gemini-2.0-flash`) n'est pas valide ou pas accessible via l'API. Le nom correct pour le modèle le plus récent est `gemini-1.5-flash-latest`.
    -   *Solution :* Utiliser le nom de modèle correct et patienter en cas de surcharge des services de Google.

---

## 6. Évolution des Objectifs et Étapes Suivantes

Cette section, initialement une simple liste de "prochaines étapes", a été restructurée pour refléter l'évolution des priorités du projet.

### Objectifs Initiaux (Maintenant Atteints)

-   **Stabiliser la connexion à la base de données :** C'était une priorité absolue pour fiabiliser l'application. *Cet objectif a été atteint en documentant la procédure de mise à jour de la liste d'accès IP sur MongoDB Atlas (voir Phase 6).*
-   **Robustesse du code :** L'objectif était d'améliorer la gestion des erreurs pour éviter les crashs. *Cet objectif a été largement atteint grâce à l'ajout de blocs `try...catch` sur les points critiques (appels IA, requêtes DB) et à la sécurisation des routes backend.*
-   **Finaliser l'intégration ESP32 :** Le but était de fournir un code fonctionnel pour le microcontrôleur. *Un code d'exemple (`esp32_sender.ino`) a été fourni et la logique serveur est prête à le recevoir.*

### Nouveaux Objectifs et Vision à Long Terme

Avec une base stable et fonctionnelle, les nouvelles ambitions du projet se tournent vers l'industrialisation et l'intelligence.

1.  **Déploiement en Production :** Mettre l'application en ligne sur des services d'hébergement professionnels (ex: Vercel, Render) pour la rendre accessible publiquement et en continu.
2.  **Enrichissement des Capacités de l'IA :** Aller au-delà des questions/réponses. L'IA pourrait, à l'avenir, détecter des anomalies de manière proactive (ex: "Alerte : pic inhabituel de déchets rouges depuis 15 minutes") et envoyer des notifications.
3.  **Tests et Optimisation des Performances :** Mettre en place des tests automatisés et analyser les performances du backend et du frontend sous une charge de travail élevée pour garantir la scalabilité.
4.  **Amélioration Continue de l'UX :** Recueillir les retours des utilisateurs pour continuer à affiner l'interface, ajouter des options de personnalisation et rendre le dashboard encore plus intuitif.

---

## 7. Justification des Choix Technologiques
-   **Communication en Temps Réel :** Le cœur du projet est la supervision en temps réel. Au lieu que le frontend demande constamment au serveur s'il y a de nouvelles données (polling), nous avons adopté une approche "push" avec Socket.IO. Dès qu'un événement arrive au serveur, c'est lui qui notifie immédiatement tous les clients connectés. C'est beaucoup plus efficace et instantané.

-   **Source de Données Agnostique :** Le serveur a été conçu pour être agnostique à la source des données. Qu'un événement provienne du `simulate.js` ou d'un véritable ESP32, il arrive sur le même point d'entrée (`POST /api/event`). Cela a permis de développer et tester toute la logique applicative sans dépendre du matériel physique.

---

## 7. Architecture Détaillée et Flux de Données

Comprenons en détail comment une information traverse le système, de sa création à son affichage.

**Flux d'un événement :**

1.  **Génération (ESP32 / Simulateur) :**
    -   Un capteur sur le convoyeur détecte un objet (ex: couleur "blue").
    -   Le script (`simulate.js` ou le code sur l'ESP32) forge une requête HTTP `POST` vers l'endpoint `http://<ip_du_serveur>:5000/api/event` avec un corps JSON : `{ "color": "blue" }`.

2.  **Réception et Traitement (Serveur Node.js) :**
    -   Le framework **Express.js** intercepte la requête sur la route `POST /api/event`.
    -   Le contrôleur de cette route exécute la logique :
        a.  Il utilise le modèle **Mongoose** `Event` pour créer un nouvel objet représentant l'événement.
        b.  Il sauvegarde cet objet dans la collection `events` de la base de données **MongoDB Atlas**. La base de données répond que l'enregistrement est réussi.
        c.  Le serveur renvoie une réponse `201 Created` au simulateur/ESP32 pour lui dire que tout s'est bien passé.
        d.  Simultanément, le serveur utilise **Socket.IO** pour émettre un message sur le canal `newEvent`, en y joignant les données du nouvel événement (ex: `{ color: 'blue', timestamp: '...' }`).

3.  **Affichage (Client React) :**
    -   L'application React, au démarrage, a établi une connexion permanente avec le serveur via Socket.IO.
    -   Elle possède un "écouteur" (`socket.on('newEvent', ...)`).
    -   Dès que le serveur émet le message `newEvent`, cet écouteur se déclenche.
    -   La fonction de l'écouteur met à jour l'état de l'application React (par exemple, en ajoutant le nouvel événement à un tableau de données).
    -   Grâce à la magie de **React**, le changement d'état provoque un nouveau rendu automatique des composants de l'interface, affichant ainsi le nouvel événement en temps réel sur le tableau de bord, sans que l'utilisateur n'ait eu à rafraîchir la page.

---

## 8. Justification des Choix Technologiques

Chaque technologie a été choisie pour répondre à un besoin spécifique du projet.

-   **Node.js (Backend) :** Idéal pour les applications I/O-intensives (qui font beaucoup d'entrées/sorties, comme des requêtes réseau ou des accès base de données). Son modèle non-bloquant lui permet de gérer des milliers de connexions simultanées (clients web, ESP32) avec une faible consommation de ressources, ce qui est parfait pour un projet IoT.

-   **Express.js (Framework Backend) :** C'est le standard de facto pour Node.js. Minimaliste, rapide et robuste, il simplifie énormément la création de routes, de middlewares et de l'API REST.

-   **MongoDB (Base de Données) :** En tant que base de données NoSQL orientée document, elle est extrêmement flexible. Nous n'avons pas besoin de définir un schéma strict à l'avance, ce qui est parfait pour des projets en évolution. Les données sont stockées en format BSON (similaire au JSON), ce qui rend la communication avec notre backend en JavaScript très naturelle.

-   **Mongoose (ODM pour MongoDB) :** Il ajoute une couche de structuration et de validation au-dessus de MongoDB. Il permet de définir des schémas de données (`EventSchema`) directement dans le code, ce qui rend les interactions avec la base de données plus sûres, plus prévisibles et plus faciles à maintenir.

-   **React.js (Frontend) :** C'est la bibliothèque de référence pour créer des interfaces utilisateur modernes et réactives. Son système de composants permet de construire des UI complexes en assemblant des briques logiques et réutilisables. Son DOM virtuel assure des mises à jour de l'affichage ultra-performantes, essentielles pour un tableau de bord qui doit réagir en temps réel.

-   **Socket.IO (Communication Temps Réel) :** C'est la solution la plus complète pour la communication bidirectionnelle. Elle gère automatiquement la meilleure méthode de connexion (WebSockets, polling, etc.) et assure la fiabilité des messages, ce qui est crucial pour ne perdre aucun événement provenant du convoyeur.

-   **JSON Web Token (JWT) (Sécurité) :** Pour sécuriser les points d'API sensibles (comme la configuration), une authentification par token JWT a été mise en place. C'est une méthode standard, "stateless" (sans état) et sécurisée qui permet au serveur de vérifier l'identité de l'utilisateur à chaque requête sans stocker de session côté serveur, ce qui améliore la scalabilité.

---

## 9. Fonctionnalités Clés : De la Vision à l'Implémentation

Cette section fusionne la présentation des fonctionnalités (ce que l'utilisateur voit) et les détails de leur implémentation technique (comment ça marche).

### a. Tableau de Bord Temps Réel

Le tableau de bord principal affiche un flux en direct des événements provenant du convoyeur. Chaque nouvel événement apparaît instantanément sans qu'il soit nécessaire de rafraîchir la page, accompagné d'une animation visuelle pour attirer l'attention. La communication est assurée par Socket.IO pour une instantanéité maximale.

*![GIF animé du tableau de bord principal recevant un nouvel événement](URL_DE_VOTRE_IMAGE_ICI "Tableau de bord principal")*

### b. Visualisations et Statistiques

L'application présente des statistiques agrégées sous forme de graphiques (camemberts, histogrammes) pour visualiser la répartition des différents types de déchets triés sur une période donnée. Ces graphiques sont construits avec la bibliothèque Recharts et sont rendus responsives grâce à des conteneurs dédiés.

*![Capture d'écran des graphiques statistiques](URL_DE_VOTRE_IMAGE_ICI "Statistiques visuelles")*

### c. Page d'Historique, Exports et Rapports

Un onglet "Historique" donne accès à une page dédiée à la consultation de l'intégralité des événements, conçue pour la performance et l'ergonomie.

- **Interface et Expérience Utilisateur :**
    - **Interface Épurée :** Le bug de la "double barre de défilement" a été corrigé. La page utilise une mise en page moderne qui assure une seule barre de défilement pour le contenu du tableau.
    - **En-tête de Tableau Fixe (`Sticky Header`) :** Les en-têtes de colonne restent toujours visibles lors du défilement.
    - **Chargement Intelligent :** La page charge les 50 derniers événements, avec un bouton "Voir plus" pour charger les suivants, assurant des performances optimales.

- **Implémentation Technique du Système d'Export :**
    - **Route d'API Unique :** Une seule route Express `app.get('/api/export/events')` gère les trois types d'export (PDF, CSV, JSON) via un paramètre de requête `?format=...`.
    - **Génération Côté Serveur :** Le serveur récupère l'intégralité des données et les formate. Pour le PDF, les bibliothèques `jspdf` et `jspdf-autotable` sont utilisées pour créer un document professionnel avec une page de garde contenant des statistiques clés.
    - **Simplicité Côté Client :** Les boutons d'export sont de simples liens `<a>` pointant vers l'API, ce qui délègue le téléchargement au navigateur.

- **Formats d'Export :**
    - **PDF :** Idéal pour le reporting, avec page de garde et statistiques.
    - **CSV :** Pour l'analyse dans des tableurs.
    - **JSON :** Pour l'intégration avec d'autres applications.

*![Capture d'écran de la nouvelle page d'historique avec pagination et boutons d'export](URL_DE_VOTRE_IMAGE_ICI "Page d'historique et exports")*

### d. Assistant IA Conversationnel (Gemini)

L'assistant IA permet un véritable dialogue. Il comprend le contexte du projet et l'état actuel du système.

- **Philosophie d'Architecture :** L'IA n'est pas connectée directement à la base de données. Le serveur Node.js agit comme un **intermédiaire intelligent**.
- **Flux de Traitement :**
    1. Le frontend envoie la question via Socket.IO.
    2. Le serveur collecte le contexte en temps réel (statistiques de la DB).
    3. Il construit un **prompt riche** contenant le rôle de l'IA, le contexte du projet, les données fraîches et la question de l'utilisateur.
    4. Le prompt est envoyé à l'API Gemini.
    5. La réponse est retransmise au client via Socket.IO.
- **Interface Utilisateur :** Le composant `AIAssistant.js` gère la conversation et intègre la **Web Speech API** pour la reconnaissance vocale.

*![GIF animé d'une conversation avec l'assistant IA](URL_DE_VOTRE_IMAGE_ICI "Assistant IA")*

### e. Page de Paramètres Avancés et Sécurisés

L'onglet "Paramètres" est un centre de contrôle incluant une section administrative sécurisée.

-   **Section "Admin" Protégée par JWT :**
    -   **Authentification Robuste :** L'accès est sécurisé via JSON Web Tokens (JWT). Lors de la connexion avec le mot de passe correct, le serveur génère un token signé qu'il envoie au client. Ce token est ensuite inclus dans les en-têtes de chaque requête vers les routes admin, permettant au serveur de vérifier l'identité et les autorisations sans avoir à redemander le mot de passe.
    -   **Fonctionnalités Protégées :** Cette authentification protège des actions sensibles comme la mise à jour de la clé API Gemini ou la réinitialisation complète de la base de donnes (qui nécessite une double confirmation).
-   **Améliorations Générales :**
    -   **Thème Clair/Sombre :** Sélecteur de thème fonctionnel et thème clair entièrement revu.
    -   **Ergonomie :** Affichage/masquage du mot de passe, harmonisation des styles.

*![Capture d'écran de la section Admin dans les paramètres](URL_DE_VOTRE_IMAGE_ICI "Paramètres Admin")*

---

## 10. Code Source du Microcontrôleur (ESP32)

Pour une utilisation en conditions réelles, un code d'exemple pour un microcontrôleur ESP32 est fourni dans le dossier `misc`. Ce code est conçu pour être simple et adaptable.

**Fichier : `misc/esp32_sender.ino`**

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

// Vos identifiants WiFi
const char* ssid = "VOTRE_SSID_WIFI";
const char* password = "VOTRE_MOT_DE_PASSE_WIFI";

// L'URL du serveur backend
// IMPORTANT : Utilisez l'adresse IP locale de votre serveur, pas localhost !
const char* serverName = "http://192.168.1.XX:3001/api/event";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi network");
}

void loop() {
  // Simule la détection d'une couleur (ex: "green")
  String color = "green"; 
  
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"color\":\"" + color + "\"}";
    
    int httpResponseCode = http.POST(jsonPayload);

    if(httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.print("Response: ");
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  // Attend 5 secondes avant d'envoyer le prochain événement
  delay(5000);
}
```
---

## 11. Vidéo de Démonstration

Une vidéo complète présentant le fonctionnement de l'application, de la simulation d'un événement à son analyse par l'IA, est disponible ci-dessous. Elle montre le flux de travail complet et l'interactivité du système.

*<a href="#" target="_blank"><img src="https://i.imgur.com/placeholder.png" alt="Vidéo de démonstration du projet" /></a>*
*(Cliquez pour voir la vidéo - Remplacez le lien # par l'URL de votre vidéo)*

---

## 12. Conclusion et Remerciements

Ce projet a été une excellente démonstration de développement full-stack moderne, intégrant des technologies temps réel, des bases de données cloud, et de l'intelligence artificielle. Chaque défi, du débogage CSS à la stabilisation des connexions externes, a été une opportunité d'apprentissage documentée dans ce fichier.

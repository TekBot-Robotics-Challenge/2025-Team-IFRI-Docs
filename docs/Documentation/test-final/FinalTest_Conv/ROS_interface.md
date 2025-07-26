# Projet de Supervision de Convoyeur Intelligent

Bienvenue dans le centre de contrôle de notre système de convoyeur intelligent. Ce document technique est destiné à un public d'évaluateurs et de développeurs. Il détaille l'architecture, les choix techniques, les fonctionnalités et les perspectives d'évolution du projet.

## Philosophie du Projet

L'objectif est de construire un écosystème de contrôle industriel **robuste, intuitif et évolutif**. Au-delà du simple tri d'objets, le projet explore l'intégration d'une interface homme-machine (IHM) moderne avec un framework robotique standard de l'industrie (ROS2), en posant les bases d'un système maintenable et extensible.

---

## 🏛️ Architecture Technique Détaillée

Le système est découplé en trois blocs principaux qui communiquent de manière asynchrone :

 <!-- Placeholder: A real diagram would be ideal here -->

1.  **Le Cerveau (Backend ROS2) :** Gère la logique métier, le contrôle bas niveau et l'abstraction matérielle.
2.  **L'Interface (Frontend Electron/React) :** Offre à l'opérateur la visualisation et l'interaction.
3.  **Le Pont de Communication (`rosbridge`) :** Le traducteur qui permet à ces deux mondes de dialoguer.

### 1. Le Cerveau : Backend ROS2 (`ros2_ws`)

Le cœur de la logique robotique. Il est composé de plusieurs nœuds et de définitions d'interfaces personnalisées.

*   **`convoyeur_controller` :** Le nœud orchestrateur. Il ne contient **aucune logique de simulation**. Son rôle est de faire le lien entre les demandes de haut niveau (venant de l'IHM) et les commandes bas niveau envoyées au matériel (ou au simulateur). Il expose des services comme `/motor/set_speed` ou `/calibration/set_color_references`.

*   **`hardware_simulator_node` :** Un nœud clé pour le développement itératif. Il simule le comportement du matériel physique (moteur, capteur de couleur, objets). Il souscrit aux mêmes topics et expose les mêmes services que le vrai matériel, le rendant **interchangeable** avec les vrais drivers sans modifier une seule ligne de code dans `convoyeur_controller` ou l'IHM. C'est un exemple de **HIL (Hardware-in-the-Loop)** simplifié.

*   **`custom_interfaces` :** Un package essentiel qui définit des types de messages, services (`.srv`) et actions (`.action`) spécifiques au projet. Par exemple, le service `CaptureColorFootprint.srv` définit une transaction où le client demande une capture et le serveur répond avec une structure de données `ColorFootprint`. Utiliser des interfaces custom garantit une communication **fortement typée et sans ambiguïté** entre les nœuds.

### 2. L'Interface : Frontend Electron/React (`electron_convoyeur`)

L'application de bureau qui sert de poste de contrôle.

*   **Electron :** Le conteneur qui transforme une application web en application de bureau native. Il donne accès au système de fichiers, à la gestion des fenêtres et à un environnement Node.js complet.
*   **React :** La bibliothèque de construction de l'interface. L'application est structurée en **composants fonctionnels** (`<Dashboard>`, `<LiveControl>`, etc.) qui gèrent leur propre état via des hooks (`useState`, `useEffect`).
*   **Gestion d'état global (`React Context`) :** Pour éviter le *prop-drilling*, un `RosContext` est utilisé. Il encapsule l'instance de l'objet `roslibjs` et l'état de la connexion. N'importe quel composant enfant peut ainsi accéder à l'objet ROS et être notifié des changements d'état (connexion/déconnexion) sans passer les props à travers toute l'arborescence.

### 3. Le Pont de Communication : `rosbridge_server`

C'est la pièce maîtresse qui rend l'intégration possible. Il expose l'écosystème ROS2 à travers une **API WebSocket**.

*   **Le Flux de Communication :**
    1.  Un composant React veut envoyer une commande (ex: changer la vitesse du moteur).
    2.  Il utilise l'instance `ros` du `RosContext` et appelle une fonction de `roslibjs` (ex: `topic.publish(message)` ou `service.callService(request)`).
    3.  `roslibjs` formate la demande en **JSON** et l'envoie via la connexion WebSocket au `rosbridge_server`.
    4.  `rosbridge_server` reçoit le JSON, le traduit en une véritable commande ROS2 (publication sur un topic, appel de service) et l'injecte dans le graphe ROS.
    5.  Les réponses (d'un service) ou les données (d'un topic) font le chemin inverse, permettant à l'interface de réagir en temps réel.

Ce découplage est puissant : le frontend n'a pas besoin de savoir comment ROS2 fonctionne en interne, il ne fait que consommer une API web. On pourrait remplacer l'IHM par une application mobile ou un site web sans changer le backend ROS.

---

##  GUI : Guide Détaillé des Pages de l'Interface

Cette section détaille chaque écran de l'application de contrôle, en justifiant les choix de conception et d'implémentation, et en soulignant les défis techniques surmontés. C'est le reflet du travail réalisé sur l'interface homme-machine.

### 1. Page du Tableau de Bord (Dashboard)
![Dashboard](Documentation/test-final/FinalTest_Conv/ass/dashboard.png)
<!-- Placer le fichier 'dashboard.png' dans le dossier 'ass' -->

*   **Objectif et Pertinence :** Fournir à l'opérateur une vue d'ensemble centralisée et intuitive de l'état de santé et de la performance du système. Dans un contexte industriel, un tel tableau de bord est essentiel pour la supervision : il permet de détecter les anomalies d'un seul coup d'œil, de suivre la production et de réduire le temps de réaction en cas de problème. C'est le poste de pilotage principal.

*   **Fonctionnalités Clés et Implémentation :**

    *   **Widgets de Statut en Temps Réel :**
        *   **Comment :** Chaque widget est un composant React qui utilise le hook `useRos` pour extraire une donnée spécifique du `RosContext` (ex: `const { isConnected, motorRpm } = useRos();`). L'affichage est conditionnel en fonction de la valeur (ex: couleur verte si `isConnected` est `true`).
        *   **Justification :** L'utilisation d'un **Context global** est un choix d'architecture clé. Il évite de devoir passer les données ROS à travers de multiples niveaux de composants (*prop drilling*) et centralise la logique de souscription aux topics ROS en un seul endroit, rendant le code plus propre et plus facile à maintenir.

    *   **Graphique d'Activité Moteur :**
        *   **Comment :** Le composant utilise la bibliothèque **`Recharts`**. Un `useEffect` écoute les changements de la valeur `motorRpm` venant du `RosContext`. À chaque changement, un nouvel objet `{ time, 'Vitesse (RPM)': motorRpm }` est ajouté à un état local (`activityData`). Pour des raisons de performance, cet état est limité aux 20 derniers points.
        *   **Justification :** `Recharts` a été choisie pour son intégration native avec React. Elle permet de créer des graphiques dynamiques de manière déclarative, ce qui est plus simple et plus en phase avec la philosophie de React que des bibliothèques plus impératives comme D3.js pour ce cas d'usage.

    *   **Compteurs de Tri :**
        *   **Comment :** Le `RosContext` souscrit au topic `/waste_counts`. Ce topic publie un message contenant les totaux pour chaque couleur. Le composant du Dashboard se contente d'afficher les valeurs reçues depuis le contexte.
        *   **Justification :** Cette fonctionnalité démontre la capacité du système à agréger des données et à présenter des statistiques de production, une fonction essentielle pour évaluer l'efficacité du tri.

*   **Défis et Solutions :**
    *   **Performance :** Le défi principal était d'afficher des données haute fréquence sans ralentir l'interface. La solution a été double : l'utilisation du `Context` de React qui optimise les re-rendus, et la limitation de la taille du jeu de données pour le graphique (`activityData.slice(-20)`), empêchant une surcharge du DOM.

### 2. Page de Calibration
![Calibration](Documentation/test-final/FinalTest_Conv/ass/calibrate.png)
<!-- Placer le fichier 'calibrate.png' dans le dossier 'ass' -->

*   **Objectif et Pertinence :** Aucun système physique n'est parfait. La calibration est une fonctionnalité professionnelle qui permet d'adapter le logiciel aux imperfections et aux variations du monde réel (usure des pièces, changement de lumière). Elle transforme un simple programme en un outil industriellement viable et robuste.

*   **Fonctionnalités Clés et Implémentation :**

    *   **Capture d'Empreinte Couleur :**
        *   **Comment :** Un clic sur le bouton "Capturer" déclenche un appel au service ROS `/calibration/capture_color_footprint` via une fonction encapsulée dans `rosService.js`. La réponse du service (l'empreinte) est ajoutée à un tableau dans l'état du composant parent `Calibration.js`.
        *   **Justification :** L'utilisation d'un **Service ROS** est cruciale ici. C'est une action ponctuelle qui nécessite une réponse. Un topic serait inadapté. Le concept d'"empreinte" (plutôt qu'une simple valeur RGB) est une décision de conception majeure : il déporte l'intelligence de la calibration côté ROS, là où elle doit être, et rend le système beaucoup moins sensible aux variations environnementales.

    *   **Synchronisation des Données entre Modules :**
        *   **Comment :** Le `MotorControlModule` a besoin de connaître les couleurs capturées par le `ColorSensorModule`. Pour résoudre ce problème de communication entre composants "frères", le patron de conception React **"remontée d'état" (lifting state up)** a été appliqué. L'état (la liste des couleurs) est stocké dans le composant parent (`Calibration.js`) et passé en props aux deux enfants. Quand le `ColorSensorModule` ajoute une couleur, il appelle une fonction du parent qui met à jour l'état, provoquant un re-rendu des deux modules avec les nouvelles données.
        *   **Justification :** C'est la manière idiomatique et la plus propre de gérer un état partagé en React. Elle garantit un flux de données unidirectionnel, ce qui rend l'application plus facile à débugger et à comprendre, contrairement à des solutions plus complexes (et souvent inutiles pour ce cas) comme Redux.

*   **Défis et Solutions :**
    *   Le défi était de créer une **expérience utilisateur fluide**. La solution `lifting state up` a permis que, dès qu'une couleur est capturée dans un module, elle apparaisse instantanément dans la liste déroulante de l'autre module, sans rechargement de page, offrant une interaction dynamique et intuitive.

### 3. Page de Contrôle en Direct (Live Control)
![Live Control](Documentation/test-final/FinalTest_Conv/ass/livecontrol.png)
<!-- Placer le fichier 'livecontrol.png' dans le dossier 'ass' -->

*   **Objectif et Pertinence :** Offrir un contrôle direct et une visualisation fidèle du système. C'est essentiel pour le débogage, les démonstrations et la compréhension fine du comportement du convoyeur. Le "jumeau numérique" 3D permet de valider la logique de tri sans avoir besoin du matériel physique, ce qui accélère considérablement le développement.

*   **Fonctionnalités Clés et Implémentation :**

    *   **Visualisation 3D en temps réel :**
        *   **Comment :** La scène est construite avec **`@react-three/fiber`**, un moteur de rendu React pour `three.js`. Des composants React (`<Box>`, `<Cylinder>`) sont utilisés pour représenter les objets. Un `useEffect` souscrit au topic ROS `/detected_object`. Quand un message arrive, l'état contenant la liste des objets 3D est mis à jour, ce qui déclenche un re-rendu de la scène 3D pour afficher, déplacer ou supprimer un objet.
        *   **Justification :** `@react-three/fiber` est un choix puissant car il permet de gérer une scène 3D complexe en utilisant la logique et les patrons de conception de React (composants, état, props). C'est beaucoup plus intégré qu'une solution de visualisation externe. La présence d'un jumeau numérique est une fonctionnalité avancée qui démontre une maîtrise des concepts de simulation.

    *   **Terminal Interactif :**
        *   **Comment :** Le composant `<RosTerminal>` utilise la bibliothèque **`xterm.js`** (encapsulée dans `xterm-react`). Il instancie un terminal et expose une fonction pour y écrire. Les commandes entrées par l'utilisateur sont interceptées et utilisées pour appeler des services ROS ou publier sur des topics.
        *   **Justification :** `xterm.js` est la référence absolue pour les terminaux web, c'est le moteur de celui de VSCode. L'intégrer fournit un outil de débogage de bas niveau extrêmement puissant, permettant d'interagir avec le système d'une manière qui serait impossible avec de simples boutons.

*   **Défis et Solutions :**
    *   **Synchronisation 3D/ROS :** Le défi était de traduire les messages ROS (qui sont de simples données) en événements dans la scène 3D (création, animation, suppression d'objets). La solution a été de maintenir une liste d'objets dans l'état React et de la synchroniser à chaque message reçu du topic ROS, en s'assurant que les animations restent fluides.

### 4. Page de Supervision ROS
![Supervision ROS](Documentation/test-final/FinalTest_Conv/ass/ros_supervision.png)
<!-- Placer le fichier 'ros_supervision.png' dans le dossier 'ass' -->

*   **Objectif et Pertinence :** Fournir une vue de "debug" de bas niveau, similaire aux outils en ligne de commande de ROS (comme `ros2 topic list`), mais intégrée directement dans l'IHM. C'est une page essentielle pour un développeur qui a besoin de vérifier rapidement si tous les nœuds communiquent correctement, sans avoir à quitter l'application.

*   **Fonctionnalités Clés et Implémentation :**

    *   **Listage des entités ROS :**
        *   **Comment :** Au chargement de la page, un `useEffect` appelle les fonctions natives de `roslibjs` : `ros.getTopics()`, `ros.getServices()`, et `ros.getNodes()`. Ces fonctions retournent des `Promise` qui, une fois résolues, contiennent les listes de noms. Ces listes sont ensuite stockées dans l'état React du composant pour être affichées.
        *   **Justification :** Utiliser les fonctions natives de `roslibjs` est la méthode la plus directe et la plus fiable pour obtenir ces informations. Elle s'appuie directement sur les capacités du `rosbridge_server`, garantissant que les données affichées sont une représentation fidèle de l'état du graphe ROS.

    *   **Système de Ping pour la Fiabilité :**
        *   **Comment :** Bien que l'interface de ping ne soit pas sur cette page, le service `/diagnostics/ping_component` est un élément clé de la supervision. Il a été implémenté comme un service ROS standard. Le serveur attend une requête avec le nom d'un composant, et renvoie une réponse `is_alive: true`.
        *   **Justification :** La création d'un service de diagnostic dédié est une pratique courante dans les systèmes distribués. Elle permet de tester non seulement si un nœud est en cours d'exécution, mais aussi si toute la chaîne de communication vers ce nœud est fonctionnelle. C'est une brique de base pour la **maintenabilité prédictive**.

*   **Défis et Solutions :**
    *   **Abandon du graphe dynamique :** Le défi majeur ici a été de reconnaître les limites d'une approche et de pivoter. L'ambition initiale d'un graphe dynamique (similaire à `rqt_graph` avec `React Flow`) a été abandonnée suite à un problème d'architecture (l'objet `ros` n'étant pas dans un `useState`, les mises à jour de connexion ne déclenchaient pas de re-rendu). La décision de **simplifier intentionnellement** la fonctionnalité en listes textuelles est une démonstration de pragmatisme : il est préférable d'avoir une fonctionnalité plus simple mais robuste et fonctionnelle, plutôt qu'une fonctionnalité ambitieuse mais défaillante.

### 5. Page des Logs
![Logs](Documentation/test-final/FinalTest_Conv/ass/logs.png)
<!-- Placer le fichier 'logs.png' dans le dossier 'ass' -->

*   **Objectif et Pertinence :** Fournir une traçabilité complète des événements système. Pour un développeur, c'est un outil de débogage indispensable. Pour un opérateur, c'est un moyen de comprendre ce qu'il s'est passé en cas de comportement inattendu. La capacité de filtrer par source (`origin`) est ce qui rend cet outil véritablement puissant.

*   **Fonctionnalités Clés et Implémentation :**

    *   **Collecte et Affichage des Logs :**
        *   **Comment :** L'architecture repose sur un **`LogContext`** React. Un `LogProvider` expose une fonction `addLog`. N'importe quel composant de l'application peut importer ce contexte et appeler `addLog({ message, origin })` pour enregistrer un événement. La page `Logs` utilise ce même contexte pour récupérer le tableau complet des logs et l'afficher. Le filtrage est réalisé avec une simple fonction `Array.prototype.filter()` sur ce tableau.
        *   **Justification :** Cette approche est un excellent exemple de la puissance des Contextes React pour la gestion d'état global simple. Elle est bien plus légère et adaptée à ce besoin qu'une bibliothèque de gestion d'état complète comme Redux. Elle découple complètement les producteurs de logs (n'importe quel composant) du consommateur (la page `Logs`), ce qui est très propre architecturalement.

*   **Défis et Solutions :**
    *   **Éviter la sur-ingénierie :** Le défi initial était de ne pas tomber dans le piège de recréer un système complexe basé sur le topic `/rosout` de ROS, ce qui aurait nécessité beaucoup de plomberie. La solution finale, purement côté frontend avec un `Context`, est une démonstration de pragmatisme et d'application du principe **YAGNI (You Ain't Gonna Need It)**. Elle est plus simple, plus performante pour ce cas d'usage, et répond parfaitement au besoin sans complexité inutile.

---

### 6. Utilisation et Lancement

Cette section décrit les étapes pour configurer l'environnement et lancer l'ensemble du système.

#### A. Prérequis

*   **ROS 2 Humble Hawksbill :** Le système est développé et testé avec cette version. L'installation doit inclure `colcon` et les outils de développement courants.
*   **Node.js et npm :** Nécessaires pour faire fonctionner l'application Electron. (Version LTS recommandée).
*   **Python 3 :** Avec les librairies `pyserial` et `numpy`.

#### B. Configuration de l'Espace de Travail ROS 2

1.  **Cloner le dépôt :**
    ```bash
    git clone <URL_DU_DEPOT>
    cd <nom_du_depot>
    ```

2.  **Compiler l'espace de travail :**
    Le code ROS se trouve dans `ros2_ws`. Pour le compiler :
    ```bash
    cd ros2_ws
    colcon build
    ```

3.  **Sourcer l'environnement :**
    À chaque fois que vous ouvrez un nouveau terminal pour lancer un nœud ROS, vous devez sourcer l'environnement pour que ROS trouve vos packages custom.
    ```bash
    # Depuis le dossier ros2_ws
    source install/setup.bash
    ```

#### C. Lancement du Système (4 terminaux nécessaires)

L'ordre de lancement est important.

*   **Terminal 1 : Lancer le Pont de Communication (rosbridge)**
    ```bash
    # Assurez-vous que l'environnement ROS 2 de base est sourcé
    source /opt/ros/humble/setup.bash
    
    # Lancer le serveur rosbridge
    ros2 launch rosbridge_server rosbridge_websocket_launch.xml
    ```

*   **Terminal 2 : Lancer le Simulateur Matériel**
    ```bash
    # Naviguer vers le workspace
    cd ros2_ws
    
    # Sourcer l'environnement local
    source install/setup.bash
    
    # Lancer le nœud de simulation
    ros2 run convoyeur_controller hardware_simulator_node
    ```

*   **Terminal 3 : Lancer l'Orchestrateur**
    ```bash
    # Naviguer vers le workspace
    cd ros2_ws
    
    # Sourcer l'environnement local
    source install/setup.bash
    
    # Lancer le nœud principal
    ros2 run convoyeur_controller convoyeur_node
    ```

*   **Terminal 4 : Lancer l'Application Electron**
    ```bash
    # Naviguer à la racine du projet
    cd /chemin/vers/electron_convoyeur
    
    # Installer les dépendances (la première fois)
    npm install
    
    # Lancer l'application
    npm start
    ```

---

## 🔭 Évolution et Perspectives : La Vision Micro-ROS

Ce projet pose les bases, mais une évolution majeure a été envisagée : l'intégration de **Micro-ROS**.

*   **L'Idée :** Actuellement, un seul PC (ou Raspberry Pi) fait tourner tous les nœuds ROS. La vision Micro-ROS est de décentraliser l'intelligence sur des microcontrôleurs à bas coût comme des **ESP32**. Chaque composant matériel (moteur, capteur) aurait son propre microcontrôleur, qui ferait tourner un nœud ROS ultra-léger.

*   **Les Avantages :**
    1.  **Modularité Extrême :** Le convoyeur deviendrait un assemblage de modules intelligents et autonomes. Ajouter un capteur se résumerait à brancher un nouveau module sur le réseau.
    2.  **Robustesse :** Le crash d'un microcontrôleur n'affecterait que son propre composant, pas le système entier.
    3.  **Performance :** Les tâches temps-réel (comme le contrôle moteur PID) seraient gérées localement sur le microcontrôleur, libérant le PC central pour des tâches de supervision.

*   **Les Défis Rencontrés :** L'implémentation a été écartée par manque de temps, principalement à cause de la **complexité de l'environnement de développement**. Mettre en place une chaîne de compilation croisée (toolchain) pour flasher le firmware Micro-ROS sur un ESP32, configurer l'agent Micro-ROS sur le PC hôte et débugger la communication (série, WiFi ou Ethernet) représente une courbe d'apprentissage très raide pour un débutant et sortait du cadre initial du projet. Cette perspective reste cependant la suite logique et passionnante pour amener ce projet à un niveau de maturité industrielle.

---

## 🚀 Démarrage Rapide : Lancer le Système

(Les instructions de cette section sont conservées de la version précédente)

### Terminal 1 : Lancer l'environnement ROS2

1.  **Sourcez votre environnement ROS2 :**
    ```bash
    source /opt/ros/humble/setup.bash
    ```
2.  **Naviguez jusqu'à votre espace de travail et sourcez-le :**
    ```bash
    cd ~/ros2_ws
    source install/setup.bash
    ```
3.  **Lancez le nœud principal :**
    *   Pour le **convoyeur PHYSIQUE** : `ros2 launch convoyeur_controller convoyeur.launch.py`
    *   Pour la **SIMULATION** : `ros2 launch convoyeur_controller simulation.launch.py`

### Terminal 2 : Lancer l'Interface de Contrôle

1.  **Naviguez jusqu'au dossier du projet :**
    ```bash
    cd /home/ashlynx/Documents/electron_convoyeur
    ```
2.  **Lancez l'application :**
    ```bash
    npm start
    ```

---

## 🐙 Gestion des Versions avec Git & GitHub

(Les instructions de cette section sont conservées de la version précédente)

Pour maintenir un code propre, le projet doit être versionné sur deux branches distinctes.

*   `electron-app` : Contient tout le code de l'interface utilisateur (React, Electron, CSS).
*   `ros-workspace` : Contient tout le code du système robotique (nœuds ROS2, messages custom, fichiers de lancement).

### Guide de Mise en Place

1.  **Créez un dépôt vide sur GitHub.**
2.  **Initialisez Git à la racine du projet** (le dossier contenant `electron_convoyeur` et `ros2_ws`).
    ```bash
    git init && git branch -M main
    git remote add origin VOTRE_URL_GITHUB.git
    ```
3.  **Créez et populez la branche `ros-workspace` :**
    ```bash
    git checkout -b ros-workspace
    git add ros2_ws/
    git commit -m "Initial commit for ROS workspace"
    git push -u origin ros-workspace
    ```
4.  **Créez et populez la branche `electron-app` :**
    ```bash
    git checkout -b electron-app
    git add electron_convoyeur/
    git commit -m "Initial commit for Electron application"
    git push -u origin electron-app
    ```
5.  **Utilisez la branche `main` pour la documentation.**
    ```bash
    git checkout main
    git add README.md .gitignore
    git commit -m "Add project documentation and gitignore"
    git push -u origin main
    ```

    depot git ici https://github.com/hantanHugues/convoyeur-ROS

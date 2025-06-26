# Recherche de chemin A* pour robot sur grille

## Présentation

Ce projet propose une solution efficace de pathfinding pour un robot évoluant sur une grille à obstacles, en utilisant l'algorithme A* (A-star). Il est conçu pour être intégré dans un environnement de simulation ROS2 et Gazebo, avec visualisation possible dans RViz 2. L'objectif est de permettre au robot de rejoindre une cible tout en évitant les obstacles, de manière optimale et reproductible.

---

## 1. Configuration ROS2 et Gazebo

> **Note :** Ce projet fournit la logique de pathfinding. L'intégration complète avec ROS2 et Gazebo nécessite d'adapter les scripts pour publier/écouter sur les bons topics ROS2 et interfacer avec les plugins de simulation. Voici les grandes lignes pour une intégration typique :

- **ROS2** :
  - Créez un package ROS2 (ex : `robot_pathfinding`).
  - Ajoutez ce projet dans le dossier `src/` du workspace ROS2.
  - Adaptez `main_astar.py` pour recevoir la grille, la position initiale et la cible via des topics ou services ROS2 (ex : `/map`, `/initial_pose`, `/goal_pose`).
  - Publiez le chemin trouvé sur un topic (ex : `/planned_path`).
- **Gazebo** :
  - Utilisez un monde Gazebo avec une carte d'occupation (OccupancyGrid) correspondant à la matrice utilisée.
  - Le robot doit être contrôlé pour suivre le chemin calculé (via un contrôleur ROS2).
- **RViz 2** :
  - Visualisez la carte, la position du robot, la cible et le chemin planifié en important les topics correspondants.

---

## 2. Algorithme de pathfinding : A*

L'algorithme A* est un algorithme de recherche informée qui combine le coût réel du chemin parcouru et une estimation heuristique du coût restant pour atteindre la cible. Il garantit de trouver le chemin le plus court si l'heuristique est admissible.

### Fonctionnement détaillé :
- **État** : chaque case de la grille est un état (x, y).
- **Actions** : le robot peut se déplacer dans 8 directions (haut, bas, gauche, droite, et diagonales), à condition que la case cible soit libre.
- **Coût** : 1 pour un déplacement orthogonal, √2 pour un déplacement diagonal.
- **Heuristique** : distance octile (adaptée à la 8-connexité), qui guide efficacement la recherche vers la cible.
- **Gestion des obstacles** :
  - Les cases avec une valeur différente de 0 sont considérées comme des obstacles infranchissables.
  - Le robot ne peut pas « couper les coins » entre deux obstacles en diagonale (vérification supplémentaire dans le code).

### Justification du choix :
- **A*** est reconnu pour son efficacité et son optimalité sur les grilles avec obstacles.
- L'heuristique choisie (distance octile) est parfaitement adaptée à la 8-connexité et accélère la recherche sans compromettre l'optimalité.
- La gestion stricte des obstacles garantit la sécurité du robot.

---

## 3. Gestion des obstacles

- Les obstacles sont définis dans la matrice d'occupation (`1` = obstacle, `0` = libre).
- Le robot vérifie à chaque étape que la case cible est libre avant de s'y déplacer.
- Pour les déplacements en diagonale, le robot vérifie que le passage n'est pas bloqué par deux obstacles adjacents (pas de « corner cutting »).
- Cette gestion assure que le robot ne tente jamais de traverser un obstacle, même partiellement.

---

## 4. Simulation et visualisation (Gazebo & RViz 2)

- **Simulation dans Gazebo** :
  - Importez la carte d'occupation dans Gazebo.
  - Placez le robot à la position initiale.
  - Utilisez le chemin calculé pour générer des commandes de déplacement (ex : via un contrôleur ROS2).
- **Visualisation dans RViz 2** :
  - Affichez la carte (`/map`), la position du robot (`/odom` ou `/pose`), la cible, et le chemin planifié (`/planned_path`).
  - Le chemin peut être visualisé comme une suite de points ou une ligne reliant les étapes.
- **Conseils** :
  - Vérifiez la correspondance entre la matrice utilisée pour le calcul et la carte affichée dans Gazebo/RViz.
  - Utilisez des couleurs distinctes pour le robot, la cible et le chemin pour une meilleure lisibilité.

---

## 5. Documentation de l'algorithme, des choix techniques et des résultats

### Explication de l'algorithme
- Voir section 2 ci-dessus pour le détail du fonctionnement d'A* et de la gestion des obstacles.

### Choix techniques
- **Python** pour la rapidité de prototypage et la lisibilité.
- **A*** pour l'optimalité et la rapidité sur grille.
- **8-connexité** pour permettre des déplacements naturels et efficaces.
- **Gestion stricte des obstacles** pour la sécurité et la robustesse.

### Résultats obtenus
- Le programme affiche le chemin trouvé, le nombre de nœuds explorés et le temps de calcul.
- Sur la grille d'exemple, le chemin optimal est trouvé en quelques millisecondes.
- Le robot évite systématiquement tous les obstacles.

#### Exemple de sortie :
```
Chemin trouvé (liste d'états (x,y)) :
  Étape 0: (0, 0)
  Étape 1: (1, 1)
  ...
Nombre de nœuds explorés par A*: 23
Temps de calcul A*: 0.0021 s
```

---

## 6. Utilisation rapide

1. Modifiez la grille, la position initiale et la cible dans `main_astar.py`.
2. Lancez le programme :
   ```bash
   python main_astar.py
   ```
3. Intégrez le code dans votre package ROS2 pour une utilisation en simulation.

---

## 7. Structure des fichiers

- **main_astar.py** : point d'entrée, configuration et lancement de la recherche.
- **robot_search.py** : définition du problème de déplacement sur grille.
- **search.py** : algorithmes de recherche (A*, etc.).
- **utils.py** : fonctions utilitaires.

---

## 8. Documentation détaillée des fichiers du projet

### 1. `main_astar.py`
**Rôle :**
- Point d'entrée du projet.
- Permet de configurer la grille (obstacles, cases libres), la position de départ et la cible.
- Instancie le problème de pathfinding et lance l'algorithme A*.
- Affiche le chemin trouvé, le nombre de nœuds explorés et le temps de calcul.

**Principales fonctions :**
- `main()` : fonction principale qui orchestre la configuration, l'appel à l'algorithme et l'affichage des résultats.

**Utilisation :**
- À exécuter pour lancer une recherche de chemin sur une grille définie dans le code.

---

### 2. `robot_search.py`
**Rôle :**
- Définit le problème de déplacement du robot sur une grille à obstacles.
- Gère la logique de déplacement, la vérification des obstacles, et la génération des voisins accessibles.

**Principales classes :**
- `GridAccessor` : interface pour accéder à la grille et vérifier si une case est libre ou occupée.
- `RobotSolving` : classe héritée de `Problem` (définie dans `search.py`), qui formalise le problème de pathfinding pour le robot (états, actions, coût, heuristique, etc.).

**Points clés :**
- Gère la 8-connexité (déplacements diagonaux autorisés).
- Empêche le robot de « couper les coins » entre deux obstacles.
- Fournit une méthode d'heuristique adaptée à A* (distance octile).

---

### 3. `search.py`
**Rôle :**
- Contient les algorithmes de recherche génériques (A*, recherche en largeur, profondeur, etc.).
- Définit les structures de base pour la résolution de problèmes (problème, nœud, etc.).

**Principales classes/fonctions :**
- `Problem` : classe abstraite à hériter pour définir un problème de recherche d'état.
- `Node` : représente un nœud dans l'arbre de recherche (état, parent, coût, etc.).
- `astar_search(problem, h=None, display=False)` : implémente l'algorithme A*.
- D'autres algorithmes de recherche (largeur, profondeur, etc.) sont aussi présents pour comparaison ou extension.

**Utilisation :**
- `RobotSolving` hérite de `Problem` et utilise `astar_search` pour la recherche de chemin.

---

### 4. `utils.py`
**Rôle :**
- Fournit des fonctions utilitaires utilisées par les autres modules (mathématiques, manipulation de listes, statistiques, etc.).

**Principales fonctions :**
- Fonctions de manipulation de séquences, de calculs mathématiques, de statistiques, de gestion de files de priorité, etc.
- Certaines fonctions sont utilisées dans les algorithmes de recherche pour optimiser les calculs ou la gestion des structures de données.

**Utilisation :**
- Importé par `search.py` pour fournir des outils de base nécessaires à la recherche et à la manipulation des données.
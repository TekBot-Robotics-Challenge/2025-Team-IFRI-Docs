

---

# Documentation du script d'exploration autonome pour Nav2

---

## **But du script**

Ce script implémente une stratégie **d'exploration autonome par frontières** pour un robot utilisant Nav2. Son objectif est de cartographier un environnement inconnu (comme un labyrinthe) de manière entièrement automatique.

Le principe est le suivant :
1.  Le robot analyse en permanence la carte construite par un algorithme de SLAM.
2.  Il identifie les **"frontières"** : des zones connues et accessibles situées juste à côté de zones encore inconnues.
3.  Il choisit la frontière la plus prometteuse (ici, la plus proche) comme nouvel objectif.
4.  Il utilise Nav2 pour naviguer jusqu'à cet objectif, révélant ainsi une nouvelle partie de la carte.
5.  Le processus se répète jusqu'à ce qu'il n'y ait plus de frontières à explorer, signifiant que la carte est complète.

---

## **Comment utiliser ce script ?**

1.  **Lancement de la simulation complète** : Démarrez votre environnement de simulation (Gazebo), le robot, le nœud SLAM (`slam_toolbox`) et la pile de navigation Nav2.
    ```bash
    # Exemple de commande de lancement
    ros2 launch mon_robot_config simulation_avec_nav2.launch.py
    ```
2.  **Lancement du script d'exploration** : Dans un nouveau terminal (après avoir sourcé votre workspace), lancez ce nœud.
    ```bash
    ros2 run mon_paquet_exploration nom_de_l_executable
    ```
3.  **Observation** : Dans RViz, vous devriez voir le robot recevoir des objectifs de navigation (flèches vertes) et se déplacer de manière autonome pour explorer la carte. La carte se complétera progressivement.

---

## **Explication détaillée du code**

### 1. **Initialisation (`__init__`)**

```python
class Nav2AutoExplorerImproved(Node):
    def __init__(self):
        super().__init__('nav2_auto_explorer_improved')
        # ... Définition des publishers, subscribers, et du TF listener ...
        self.timer = self.create_timer(self.exploration_timer_period, self.explore)
```

-   **Rôles des composants** :
    -   `goal_pub` : Pour envoyer des objectifs de navigation (`PoseStamped`) à Nav2 sur le topic `/goal_pose`.
    -   `map_sub` : Pour recevoir la carte (`OccupancyGrid`) en temps réel depuis SLAM.
    -   `tf_buffer` et `tf_listener` : Un outil essentiel pour obtenir la position exacte du robot (`base_link`) dans le repère de la carte (`map`).
-   **Le cœur du rythme** :
    -   `self.timer` : C'est le métronome du script. Il déclenche la fonction principale `explore` à intervalle régulier (toutes les 10 secondes par défaut).

---

### 2. **`find_frontier_points` (Le Détecteur de Frontières)**

C'est ici que la "magie" de la détection a lieu.
```python
def find_frontier_points(self):
    # ...
    # Une frontière est une cellule libre (0) adjacente à une cellule inconnue (-1)
    if grid[y, x] == 0:  # C'est une cellule libre
        # ...
        if grid[y + dy, x + dx] == -1: # Voisin est inconnu
            is_frontier = True
            # ...
```
-   **Principe** : La fonction parcourt chaque pixel de la carte.
-   **Condition** : Si un pixel est **libre** (valeur 0, le robot peut y aller) ET qu'au moins un de ses 8 voisins est **inconnu** (valeur -1, zone non explorée), alors ce pixel est considéré comme une "frontière".
-   **Résultat** : La fonction retourne une liste de toutes les coordonnées `(x, y)` des frontières trouvées sur la carte.

---

### 3. **`select_best_frontier` (Le Stratège)**

Une fois que nous avons une liste de toutes les frontières possibles, il faut choisir la meilleure.
```python
def select_best_frontier(self, frontiers, robot_pose):
    # ...
    # Calcule la distance euclidienne
    dist = math.sqrt((robot_pose.x - wx)**2 + (robot_pose.y - wy)**2)
    if dist < min_dist:
        min_dist = dist
        best_frontier = (wx, wy)
    # ...
```
-   **Stratégie** : La stratégie implémentée est simple et efficace : **choisir la frontière la plus proche du robot**.
-   **Logique** :
    1.  Pour chaque frontière dans la liste, elle convertit ses coordonnées de grille en coordonnées du monde (en mètres).
    2.  Elle calcule la distance directe entre la position actuelle du robot et cette frontière.
    3.  Elle garde en mémoire la frontière qui a la plus petite distance.
-   **Avantage** : Cette méthode est efficace car elle minimise les longs trajets inutiles et encourage le robot à explorer méthodiquement les zones adjacentes.

---

### 4. **`explore` (Le Chef d'Orchestre)**

Cette fonction, appelée par le timer, orchestre tout le processus de décision.
```python
def explore(self):
    # 1. Obtenir la position actuelle du robot
    robot_pose = self.get_robot_pose()
    # 2. Trouver tous les points frontières sur la carte
    frontiers = self.find_frontier_points()
    # Si plus de frontières, on a fini !
    if not frontiers:
        self.get_logger().info("Exploration terminée !")
        self.timer.cancel() # Arrête le timer pour ne plus chercher
        return
    # 3. Sélectionner la meilleure frontière (la plus proche)
    goal_pos = self.select_best_frontier(frontiers, robot_pose)
    # 4. Envoyer le but à Nav2
    # ... création et publication du message PoseStamped ...
```
Le déroulement est une séquence logique simple : **Où suis-je ? -> Où puis-je aller ? -> Quelle est la meilleure option ? -> Allons-y !**

---

## **Analyse du Problème : "Pourquoi le robot se coince ?"**

Votre observation est excellente et pointe vers une limitation classique de cette approche simple "fire-and-forget" (tire et oublie).

**Le problème fondamental est que le script n'a pas de "mémoire" de l'objectif en cours ni de retour sur l'état de la navigation de Nav2.**

Voici le scénario qui se produit quand le robot est entouré de zones déjà explorées :

1.  **Situation** : Le robot est dans une grande salle qu'il a déjà entièrement cartographiée. La seule frontière restante est loin, peut-être de l'autre côté d'un couloir étroit.
2.  **Décision** : Le script `explore` se lance, trouve cette frontière lointaine et envoie un objectif à Nav2.
3.  **Navigation** : Nav2 commence son travail. Atteindre ce but peut prendre du temps (plus que les 10 secondes du timer) ou même échouer si le chemin est complexe.
4.  **Le Timer se déclenche à nouveau** : Après 10 secondes, la fonction `explore` est rappelée.
5.  **Amnésie** : Le script ne sait pas que Nav2 est déjà en train de travailler sur un objectif. Il regarde la position *actuelle* du robot (qui n'a pas beaucoup bougé), refait toute l'analyse, et trouve... la même frontière lointaine !
6.  **Conflit** : Le script envoie un **nouvel** objectif au même endroit, ce qui annule et remplace la tâche de navigation précédente.

**Le cas critique (le "blocage") :**
Si Nav2 n'arrive pas à atteindre la destination (par exemple, le robot est physiquement coincé), il entre en mode de récupération (il tourne sur lui-même, recule, etc.). Pendant ce temps, notre script, ignorant totalement cet échec, continue toutes les 10 secondes à lui envoyer le même ordre, le coinçant dans une boucle d'échec sans fin.

---

## **Pistes d'Amélioration (Comment résoudre le problème)**

Pour rendre le script plus intelligent, il doit savoir si Nav2 est "occupé".

### Solution 1 : Simple (avec un "drapeau")

On peut ajouter un simple drapeau `self.is_navigating`.

```python
# Dans __init__
self.is_navigating = False

# Dans explore, au début
if self.is_navigating:
    self.get_logger().info("Navigation déjà en cours, en attente...")
    return # Ne rien faire si on navigue déjà

# ... après avoir trouvé un but ...

# Juste avant de publier le but
self.is_navigating = True
self.goal_pub.publish(goal)
```
Le problème de cette approche est : comment savoir quand remettre `self.is_navigating` à `False` ? On ne sait pas quand Nav2 a terminé ou échoué.

### Solution 2 : Robuste (Utiliser un "Action Client" ROS 2)

La bonne manière de faire avec Nav2 est d'utiliser son **Serveur d'Action**, qui s'appelle `/navigate_to_pose`. Un "Action" est comme un service mais pour des tâches longues : il donne un retour continu et un résultat final (succès, échec, annulé).

Le script deviendrait un **Client d'Action**. La logique serait :

1.  Dans `explore`, si aucune action n'est en cours :
    -   Trouver une frontière.
    -   Envoyer le but via le client d'action.
    -   Enregistrer une fonction de "callback" qui sera appelée **uniquement quand l'action sera terminée**.
2.  Dans cette fonction de callback :
    -   Analyser le résultat : Si c'est un succès, super ! Si c'est un échec, on peut décider d'une autre stratégie (ex: choisir la 2ème frontière la plus proche).
    -   Le `timer` peut alors relancer une nouvelle exploration.

Cette approche est plus complexe à coder mais elle est la seule qui soit vraiment robuste pour interagir avec des systèmes comme Nav2.

---

## 📥 Télécharger ce script

[⬇️ Télécharger le fichier Cartographie Nav2.md](Documentation/semaine-3/IT/Cartographie_Nav2.md)
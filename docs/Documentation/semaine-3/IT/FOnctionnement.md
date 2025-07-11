# Fonctionnement général du projet

---

## Présentation de l’approche

Nous avons choisi de réaliser un algorithme de pathfinding basé sur **A\***. Pour cela, les membres de la team IA ont développé le paquet [`algo_search`](Documentation/semaine-3/IT/algo_search(1).zip), dont la description détaillée des fichiers se trouve dans le document [`Algo.md`](Algo.md)Détaillé dans les pages suivantes.

Ce paquet prend en entrée une carte convertie en grille (selon le format expliqué dans les sections suivantes), traite cette carte, puis fournit en sortie le chemin optimal sous forme de tuples `(x, y)` permettant de résoudre le labyrinthe.

---

## Étapes du fonctionnement

1. **Cartographie automatique** du labyrinthe avec Nav2  
   Un script ROS2 explore et cartographie automatiquement le labyrinthe à l’aide de Nav2 et d’un algorithme SLAM.

2. **Résolution du labyrinthe**  
   Une fois la cartographie terminée, la carte est transmise à `algo_search` dans le format attendu.  
   Les couples `(x, y)` retournés par `algo_search` sont ensuite convertis en coordonnées réelles de la carte, puis envoyés à Nav2 sous forme de waypoints.  
   Nav2 se charge alors de la navigation locale, tandis que `algo_search` est utilisé pour la planification globale du chemin.

---

## Limites et remarques

⏳ Le temps nécessaire pour réaliser ces deux étapes est assez long, et les capacités limitées de nos ordinateurs ne nous permettent pas d’obtenir une résolution complète du labyrinthe dans un temps optimal.  
📸 Nous ne disposons donc pas encore de captures d’écran complètes de la résolution du labyrinthe par le robot.

---

## Vidéos de tests

Vous trouverez ci-dessous quelques vidéos de tests illustrant notre approche :


<
<iframe width="560" height="315" src="https://youtu.be/YuOMKYcWptI" frameborder="0" allowfullscreen></iframe>
>

<iframe width="560" height="315" src="https://youtu.be/0EAR1gDy_T8" frameborder="0" allowfullscreen></iframe>
---

> ℹ️ N’hésitez pas à consulter les sections suivantes pour en apprendre davantage sur notre approche et nos choix techniques. git add .
git commit -m "corections des bugs"git push origin dev 
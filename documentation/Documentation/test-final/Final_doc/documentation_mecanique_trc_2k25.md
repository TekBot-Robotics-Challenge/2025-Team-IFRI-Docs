## Documentation mécanique - TRC 2025

### 1. Vue générale du projet

**Titre du projet :** Conception du système de convoyeur intelligent **"WasteFlow"** pour le tri des déchets.

##### Contexte multidisciplinaire

Dans le cadre du test final **Tekbot Robotics Challenge 2025**, les équipes participantes doivent développer un système complet de tri automatisé de déchets reposant sur trois volets : 
* **Électronique,** 
* **Informatique et**
* **Mécanique**.

Le projet a pour but de concevoir et de réaliser un **convoyeur intelligent** capable de trier **quatre types de déchets** représentés par des **cubes de couleur (vert, jaune, rouge, bleu)**. Ces cubes seront détectés, identifiés puis orientés manuellement vers les bennes adéquates selon la consigne fournie par le système intelligent. L’état du tri est visualisé en temps réel via une interface web.

## Objectifs du volet mécanique

Le volet mécanique constitue la base physique du système. Il vise à :

- Concevoir le système de convoyage complet en 3D (CAO), 
- Garantir la compatibilité avec les capteurs électroniques (laser, couleur), 
- Respecter les contraintes de dimensions, de masses et d’impression 3D, 
- Optimiser la stabilité, l’assemblage et la faisabilité technique.

Ce volet permet de rendre le système fonctionnel, robuste et adaptable aux évolutions prévues pour les épreuves finales.

## Approche méthodique adoptée

La démarche suivie est structurée de manière logique et progressive :

1. **Analyse des besoins** : identification des fonctions mécaniques essentielles
2. **Étude des contraintes** : environnement, espace, matériaux, impression 3D
3. **Conception CAO** : modélisation des pièces et assemblages sous SolidWorks
4. **Prototypage** : ajustements, orientation, optimisation pour la fabrication
5. **Assemblage et tests** : validation du fonctionnement et du montage réel
6. **Finalisation** : documentation détaillée, tableaux de bord, rendus, vidéos

Cette documentation a pour objectif de tracer l’ensemble du processus, des premières idées jusqu’à la version finale livrable du système "WasteFlow".



# 2. Analyse des besoins et contraintes mécaniques

## 2.1 Objectifs fonctionnels

Le système de convoyeur "WasteFlow" a pour but d’assurer un tri physique des déchets représentés par des cubes colorés (30 mm). Il doit notamment :

- transporter les déchets sur une bande motorisée
- s’arrêter dès qu’un déchet est détecté
- positionner le déchet pour permettre sa lecture par capteur de couleur
- déplacer un système de glissière contenant les 4 poubelles vers la position correspondant à la couleur détectée
- permettre une collecte manuelle facile à l’extrémité du convoyeur
- garantir la stabilité, la fiabilité et la compacité du système

## 2.2 Contraintes générales

<table>
  <thead>
    <tr>
      <th>Élément</th>
      <th>Contraintes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dimensions globales</td>
      <td>longueur du convoyeur : 650 mm<br>hauteur du tapis : 100 mm</td>
    </tr>
    <tr>
      <td>type de déchet</td>
      <td>cube de 30 mm, masse à définir</td>
    </tr>
    <tr>
      <td>motorisation</td>
      <td>déplacement uniquement sur détection<br>un seul sens de déplacement</td>
    </tr>
    <tr>
      <td>intégration capteurs</td>
      <td>support prévu pour capteur de couleur + laser ou photorésistance</td>
    </tr>
    <tr>
      <td>système de tri</td>
      <td>glissière mobile supportant les 4 poubelles<br>positionnement automatique selon la couleur (en option)</td>
    </tr>
    <tr>
      <td>assemblage</td>
      <td>doit être démontable et imprimable en 3D</td>
    </tr>
    <tr>
      <td>logiciel</td>
      <td>SolidWorks</td>
    </tr>
  </tbody>
</table>

## 2.3 contraintes spécifiques au volet mécanique

- compatibilité avec les composants électroniques et les capteurs
- simplicité de fabrication et d’assemblage
- robustesse et stabilité durant le fonctionnement
- modularité du système (en vue d’une évolution)
- tolérances adaptées à l’impression 3D
- centre de masse correctement placé

## 2.4 Hypothèses techniques

Pour guider la conception, on suppose :

- moteurs DC basiques pour le tapis et pour la glissière
- la glissière est linéaire (type crémaillère ou glissière imprimée)
- le tapis peut être rigide (type plaque lisse sur rouleaux) ou souple imprimé
- les supports de capteurs sont réglables et fixés à la structure principale

## 2.5 Rappel des spécifications minimales

- longueur du convoyeur : 650 mm
- hauteur du tapis : 100 mm
- cube à trier : 30 mm de côté
- alimentation : batterie lithium
- capteurs : couleur et présence



# 3. Analyse fonctionnelle

## 3.1 Fonctions principales

<table>
  <thead>
    <tr>
      <th>fonction</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>FP1</td>
      <td>transporter les déchets détectés jusqu’à la zone de tri</td>
    </tr>
    <tr>
      <td>FP2</td>
      <td>permettre la détection et l'identification du type de déchet</td>
    </tr>
    <tr>
      <td>FP3</td>
      <td>positionner la glissière mobile des poubelles selon la consigne de tri</td>
    </tr>
    <tr>
      <td>FP4</td>
      <td>guider le déchet vers la poubelle correspondante</td>
    </tr>
  </tbody>
</table>

## 3.2 Fonctions contraintes

<table>
  <thead>
    <tr>
      <th>fonction</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>FC1</td>
      <td>respecter les dimensions imposées (650 mm de long, 100 mm de haut)</td>
    </tr>
    <tr>
      <td>FC2</td>
      <td>être compatible avec une alimentation sur batterie lithium</td>
    </tr>
    <tr>
      <td>FC3</td>
      <td>intégrer des capteurs électroniques sans gêner la mécanique</td>
    </tr>
    <tr>
      <td>FC4</td>
      <td>être imprimable en 3D avec des tolérances maîtrisées</td>
    </tr>
    <tr>
      <td>FC5</td>
      <td>permettre un montage/démontage rapide pour maintenance</td>
    </tr>
  </tbody>
</table>



# 4. Conception mécanique et modélisation CAO

Cette section présente en détail les choix mécaniques retenus, les principes de conception et les modélisations réalisées sous SolidWorks. L’objectif est de proposer une structure fonctionnelle, imprimable, respectant l’ensemble des contraintes imposées par le cahier des charges.

## 4.1 Approche générale

Le système "WasteFlow" est conçu de manière modulaire et évolutive, autour des éléments suivants :

- un **Châssis principal** assurant le support global
- deux **tambours** (avant et arrière) pour guider la bande
- une **bande de transport** rigide ou souple pour déplacer les déchets
- un **support de capteurs** intégré à la structure
- une **glissière mobile** supportant les 4 bennes de tri
- des **pieds** assurant la hauteur de 100 mm par rapport au sol

L’ensemble est pensé pour l'impression 3D, le démontage facile et la compatibilité avec les composants électroniques.

## 4.2 Réponse aux contraintes

<table>
  <thead>
    <tr>
      <th>contrainte</th>
      <th>réponse apportée</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>longueur de 650 mm</td>
      <td>structure divisée en segments assemblables pour respecter cette longueur</td>
    </tr>
    <tr>
      <td>hauteur de tapis à 100 mm</td>
      <td>réglée par la hauteur des pieds et la position des tambours</td>
    </tr>
    <tr>
      <td>détection efficace</td>
      <td>capteur laser et capteur de couleur fixés à une zone de détection centrale</td>
    </tr>
    <tr>
      <td>tri par glissière</td>
      <td>plateforme mobile déplacée latéralement par moteur linéaire ou crémaillère</td>
    </tr>
    <tr>
      <td>alimentation par batterie</td>
      <td>emplacement prévu dans la base du châssis</td>
    </tr>
    <tr>
      <td>compatibilité impression 3D</td>
      <td>pièces découpées, orientées et tolérées pour le FDM</td>
    </tr>
  </tbody>
</table>

## 4.3 Sous-ensembles modélisés

### châssis principal

Structure de base supportant l’ensemble des éléments. Il est composé de deux flancs latéraux, de traverses, et d’une plaque inférieure.


### tambours

Deux tambours de forme cylindrique assurent le guidage de la bande. L’un des tambours est relié à un moteur.


### bande transporteuse

Elle est modélisée sous forme rigide ou souple selon les matériaux disponibles. Sa tension est assurée par les tambours.


### glissière de tri (en option)

Ce système linéaire déplace la base contenant les quatre poubelles vers la bonne position, en fonction de la couleur détectée.


### support capteurs

Un système de fixation est intégré pour recevoir le capteur de couleur centré au-dessus du tapis, ainsi qu’un système laser/photodiode en amont.


## 4.4 contraintes de fabrication

Toutes les pièces ont été modélisées en respectant les contraintes suivantes :

- **volume imprimable** ≤ 220 x 220 x 250 mm
- **épaisseur minimale** : ≥ 2 mm pour la rigidité
- **jeux fonctionnels** : ≥ 0.3 mm pour les pièces en mouvement
- **perçages** compatibles avec vis M3 et M4
- **support d’assemblage** : emboîtements, vis, ou colliers selon les zones

La conception permet une **réimpression facile**, un **montage modulaire** et une **intégration propre** des composants électroniques.


# 5. Impression 3D et fabrication

Cette section décrit la préparation des pièces pour l’impression 3D, les paramètres utilisés, les contraintes rencontrées, et les choix faits pour garantir une fabrication fiable et propre. Elle permet de valider la faisabilité physique du système conçu.

## 5.1 Préparation à l’impression

Toutes les pièces ont été exportées au format `.stl` depuis SolidWorks, puis vérifiées sous un slicer (Cura / PrusaSlicer / autre). La découpe a été réalisée en fonction du volume maximal de notre imprimante (ex: 220 x 220 x 250 mm).

**type d’imprimante utilisée** : à préciser  
**matériau utilisé** : PLA (ou autre)  
**épaisseur de couche** : 0.2 mm  
**remplissage** : 15 à 30 % selon les pièces  
**support** : activé uniquement pour les surplombs > 45°  
**orientation** : optimisée pour éviter les supports et renforcer la résistance mécanique

#### Quelques photos des slicings
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-1.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-2.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-3.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-4.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-5.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-6.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-7.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-8.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-9.png" width="200">
</div>



## 5.2 découpe des pièces

Les grandes pièces (châssis, glissière, plateau) ont été découpées en sous-parties à assembler après impression.

- emboîtements et logements prévus dans la CAO
- vis M3 utilisées pour la fixation
- ajustement des tolérances à ±0.3 mm pour les zones d’assemblage



## 5.3 problèmes rencontrés et ajustements

<table>
  <thead>
    <tr>
      <th>problème</th>
      <th>solution apportée</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>décollement du plateau (warping)</td>
      <td>changement de l’orientation de la pièce + ajout de bords (brim)</td>
    </tr>
    <tr>
      <td>jeu trop serré entre deux pièces</td>
      <td>modification des tolérances dans la CAO (+0.3 mm)</td>
    </tr>
    <tr>
      <td>fragilité d’un support</td>
      <td>renfort ajouté sur la face inférieure de la pièce</td>
    </tr>
    <tr>
      <td>temps d'impression trop long pour une pièce</td>
      <td>découpage en deux éléments assemblables</td>
    </tr>
  </tbody>
</table>


### Quelques images et photos de problèmes rencontrés essentiellement lors de l'impression

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab_10.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/impression_bambulab-11.png" width="200">
</div>

## 5.4 post-traitement

Les étapes suivantes ont été appliquées après impression :

- retrait des supports
- ponçage léger des zones d’ajustement
- perçage à la main pour passage de vis
- collage ou vissage selon les cas


# 6. assemblage et vérifications mécaniques

Après l’impression des différentes pièces, cette étape consiste à assembler le système complet, vérifier la compatibilité des éléments, tester la mobilité des sous-systèmes (bande, glissière, supports), et corriger les défauts éventuels.

## 6.1 génération des fichiers STL et G-code

Chaque pièce modélisée sous SolidWorks a été exportée individuellement au format `.stl`. Ces fichiers ont été ensuite importés dans un slicer pour générer le code machine `.gcode` pour l’imprimante 3D.

**outils utilisés** :

- logiciel de CAO : SolidWorks 2023
- slicer : Cura / PrusaSlicer (à préciser)
- imprimante : modèle à indiquer
- matériau : PLA (ou autre)

**paramètres généraux utilisés dans le slicer** :

<table>
  <thead>
    <tr>
      <th>paramètre</th>
      <th>valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>hauteur de couche</td>
      <td>0.2 mm</td>
    </tr>
    <tr>
      <td>remplissage</td>
      <td>20 à 30 % selon la pièce</td>
    </tr>
    <tr>
      <td>température buse</td>
      <td>200 à 210 °C</td>
    </tr>
    <tr>
      <td>température plateau</td>
      <td>60 °C</td>
    </tr>
    <tr>
      <td>supports</td>
      <td>activés pour les porte-à-faux > 45°</td>
    </tr>
    <tr>
      <td>vitesse</td>
      <td>50 mm/s</td>
    </tr>
  </tbody>
</table>


<!-- slicer preview -->

## 6.2 Organisation des fichiers

On mettra un tableau récapitulatif ici avec tous les fichiers et leur noms et des photos illustratives

---

## 7. Galerie

### Section 1 — Premières versions & Prototypage

Voici quelques images des premières versions de WasteFlow, avec les premiers essais CAO, impressions et montages.

<!-- galerie images section 1 -->
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v0.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur-v0.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/first_coulisse.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/first_jointure.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/first-step_jointure.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/zero_jointure.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v1.png" width="200">
</div>

---

### section 2 — Conception finale & Impressions réussies

On retrouve ici les versions plus stables, les impressions finales, les ajustements et le convoyeur entièrement assemblé.

<!-- galerie images section 2 -->
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v2-assemblage.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v2-assemblage-dessus.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v2-assemblage-face.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v2-assemblage-dessous.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v2-assemblage_part1.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v2-assemblage-part1-moteur.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v2-assemblage_part2.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/convoyeur_v2-assemblage-pofil.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/axe_moteur.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/axe_moteur0.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/capteur_couleur.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/capteur_laser.png" width="200">
</div>


### Notre version réelle (première impression réussie)
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="Documentation/test-final/Final_doc/asset/images/conv-real-img_1.jpg" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv-real-img_2.jpg" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv-real-img_3.jpg" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv-real-img_4.jpg" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv-real-img_5.jpg" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv-real-img_6.jpg" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv-real-img_7.jpg" width="200">
  
</div>



#### Système de guidage et de fixation au sol

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="Documentation/test-final/Final_doc/asset/images/guidage.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv_1.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv_2.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv_3.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv_4.png" width="200">
  <img src="Documentation/test-final/Final_doc/asset/images/conv_5.png" width="200">
  
</div>



#### Assets

Vous pouvez télécharger notre assemblage ici.


<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="Documentation/test-final/Final_doc/asset/images/3D_img.png" width="500">
</div>

Télécharger [Assemblage_IFRI_Convoyeur](Documentation/test-final/Final_doc/asset/ASSEMBLAGE_IFRI_CONVOYEUR.STEP)





---

## Conclusion

Ce travail a permis de concevoir un système complet et fonctionnel, avec une forte valeur pédagogique. La modularité et la simplicité mécanique de WasteFlow en font une bonne base pour le challenge final, tout en respectant les contraintes imposées.


**Néanmoins, rien n'est encore faire. nous avons du travail.**

---


# Documentation Mécanique

**Test 2 – Niveau Intermédiaire**

## Table des matières
1. [Introduction et Contexte](#introduction-et-contexte)
2. [Objectifs du Projet](#objectifs-du-projet)
3. [Portée et Livrables](#port%C3%A9e-et-livrables)
4. [Matériel, Outils et Environnement](#mat%C3%A9riel-outils-et-environnement)
5. [Conception et Réalisation des Pièces](#conception-et-r%C3%A9alisation-des-pi%C3%A8ces)
   - [5.1. Concept et Cahier des Charges](#51-concept-et-cahier-des-charges)
   - [5.2. Modélisation Paramétrique](#52-mod%C3%A9lisation-param%C3%A9trique)
   - [5.3. Processus de modélisation](#53-processus-%C3%A9tape-par-%C3%A9tape)
     - [5.3.1. Préparation du Fichier](#531-pr%C3%A9paration-du-fichier)
     - [5.3.2. Esquisse 2D Detailée](#532-esquisse-2d-detail%C3%A9e)
     - [5.3.3. Définition des Variables Globales](#533-d%C3%A9finition-des-variables-globales)
     - [5.3.4. Opérations de Volume (Extrusion, Congés)](#534-op%C3%A9rations-de-volume-extrusion-cong%C3%A9s)
     - [5.3.5. Contrôles et Validation Géométrique](#535-contr%C3%B4les-et-validation-g%C3%A9om%C3%A9trique)
     - [5.3.6. Exportation des Pièces](#536-exportation-des-pi%C3%A8ces)
   - [5.4. Illustrations et Captures d’Écran](#54-illustrations-et-captures-d%C3%A9cran)
6. [Difficultés Rencontrées et Solutions Apportées](#difficult%C3%A9s-rencontr%C3%A9es-et-solutions-apport%C3%A9es)
7. [Résultats et Réponses aux Questions du Test](#r%C3%A9sultats-et-r%C3%A9ponses-aux-questions-du-test)
   - [7.1. Partie 1 – Variations de A, B, C](#71-partie-1--variations-de-a-b-c)
   - [7.2. Partie 2 – Cas supplémentaire](#72-partie-2--cas-suppl%C3%A9mentaire)
   - [7.3. Partie 3 – Exemple de réduction](#73-partie-3--exemple-de-r%C3%A9duction)
   - [7.4. Assemblage et Centre de Masse](#74-assemblage-et-centre-de-masse)
8. [Section Vidéo et Médias](#section-vid%C3%A9o-et-m%C3%A9dias)
9. [Annexes Techniques](#annexes-techniques)
10. [Glossaire](#glossaire)
11. [Résumé pour Présentation (2 min)](#r%C3%A9sum%C3%A9-pour-pr%C3%A9sentation-2-min)
12. [Références et Liens Utiles](#r%C3%A9férences-et-liens-utiles)

## Introduction et Contexte
Le pôle mécanique a pour mission de concevoir, modéliser et valider des composants assurant la solidité et la précision du robot. Cette documentation vise à :
- Décrire en détail la démarche de modélisation paramétrique sous SolidWorks 2025.
- Fournir une traçabilité complète des choix techniques, des calculs et des validations.
- Servir de référence pour la maintenance et l’évolution future des pièces.

**Usage** : Ce document est destiné aux membres de l’équipe, au jury de la compétition et aux futurs référents techniques.

## Objectifs du Projet
1. Reproduire fidèlement une pièce 2D fournie selon un document de spécification technique.
2. Implémenter trois variables globales (A, B, C) pour automatiser les variations dimensionnelles.
3. Calculer la masse des pièces pour chaque jeu de paramètres.
4. Appliquer découpe, congés et assemblage conformément aux spécifications.
5. Répondre aux questions de position du centre de masse pour deux configurations angulaires.


## Portée et Livrables
- **Fichiers pièces** : `.SLDPRT` pour chaque configuration.  
- **Fichiers assemblage** : `.SLDASM` validés et annotés.  
- **Captures d’écran** : Vues d’esquisse, isométriques, plan et propriétés de masse.  
- **Vidéos** : Tutoriel de modélisation (2 minutes).


## Matériel, Outils et Environnement
| Élément            | Détail                                     |
|--------------------|--------------------------------------------|
| Logiciel           | SolidWorks 2025                            |
| Matériau           | Acier AISI 1020 (densité 0.0079 g/mm³)     |
| Unités             | MMGS (mm, g, s), précision ±0.01 mm/g      |
| Plugins/Librairies | Toolbox standard, équations globales       |


## Conception et Réalisation des Pièces

### 5.1. Concept et Cahier des Charges
- Pièce de support modulable, assurant la rigidité sous charge statique.
- Contraintes : trou Ø14 mm, congés internes/externes (R5, R29), angles critiques (45°, 10°).  
- Objectifs de flexibilité via variables : A (largeur), B (hauteur), C (épaisseur).

### 5.2. Modélisation Paramétrique
- **Variables globales** définies dans l’onglet « Équations ».

- Liaisons intelligentes : « Jusqu’à suivant » pour profondeur, « A » pour largeur de base, etc.

### 5.3. Processus de modélisation

#### 5.3.1. Préparation du Fichier
1. Ouvrir un nouveau document pièce, format MMGS.
2. Définir tolérances par défaut dans Propriétés du document.
3. Enregistrer sous `modele_base.SLDPRT`.

#### 5.3.2. Esquisse 2D Detailée
- Sélection du plan de face (= Front Plane).  
- Esquisse des profils :
  1. Ligne principale de base (longueur A).  
  2. Arcs et cercles (incl. trou Ø14 mm centré).  
  3. Positionnement des congés internes (R5) et externes (R29).  
  4. Cotes angulaires (45°, 10°) appliquées via contrainte de cote.  


#### 5.3.3. Définition des Variables Globales
- A = 81 / 84 mm  
- B = 57 / 59 mm  
- C = 43 / 45 mm  

#### 5.3.4. Opérations de Volume (Extrusion, Congés)
1. **Extrusion Bossage/Base** sur épaisseur C.  
2. **Découpe** : extrémités profilées selon A, B.  
3. **Congés** :
   - R5 sur arêtes internes avant enlèvement latéral.  
   - R29 sur bords externes en finition.  


#### 5.3.5. Contrôles et Validation Géométrique
- Utiliser la fonction « Vérifier géométrie » pour détecter surfaces non-manifold.  
- Visualiser la masse via Propriétés —> Propriétés de masse.  
- Comparer contre valeurs attendues.

#### 5.3.6. Exportation des Pièces
- Enregistrer chaque variante sous `partieX.SLDPRT`.  

### 5.4. Illustrations et Captures d’Écran
- Organisation des images dans un dossier `images/` contenant :
  - les fichiers images des différentes parties à chaque étape de la modélisation.
- Insérer légendes et repères (flèches, annotations) sur chaque capture.

## Résultats et Réponses aux Questions du Test

### 7.1. Partie 1 – Variations de A, B, C

![Vue détaillée de la pièce](Documentation/semaine-2/mecanique/images/picture_piece_partie1.png)

**Question A**

* Valeurs : A = 81 mm, B = 57 mm, C = 43 mm
* Fichier : [Télécharger la pièce](Documentation/semaine-2/mecanique/Partie%201/piece_partie1_a.SLDPRT)
* Masse : **939.54 grammes**
  ![Propriétés de masse](Documentation/semaine-2/mecanique/images/picture_mass_properties_partie1_a.jpg)


**Question B**

* Valeurs : A = 84 mm, B = 59 mm, C = 45 mm
* Fichier : [Télécharger la pièce](Documentation/semaine-2/mecanique/Partie%201/piece_partie1_b.SLDPRT)
* Masse : **1032.32 grammes**
  ![Propriétés de masse](Documentation/semaine-2/mecanique/images/picture_mass_properties_partie1_b.png)

### 7.2. Partie 2 – Cas supplémentaire
- Vue de la pièce modéliséé

![Vue détaillée de la pièce](Documentation/semaine-2/mecanique/images/picture_piece_partie2.png)

- Fichier contenant la pièce modélisée
Fichier : [Télécharger la pièce](Documentation/semaine-2/mecanique/Partie%202/piece_partie2.SLDPRT)

* Masse : **628.18 grammes**
  ![Propriétés de masse](Documentation/semaine-2/mecanique/images/picture_mass_properties_partie2.png)

### 7.3. Partie 3 – Exemple de réduction
- Vue de la pièce de modélisée : 
![Vue détaillée de la pièce](Documentation/semaine-2/mecanique/images/picture_piece_partie3.png)

Fichier contenant la pièce modélisée :
* Fichier : [Télécharger la pièce](Documentation/semaine-2/mecanique/Partie%203/picture_piece_partie3.SLDPRT)
* Masse : **432.58 grammes**
  ![Propriétés de masse](Documentation/semaine-2/mecanique/images/picture_mass_properties_partie3.png)



### 7.4. Assemblage et Centre de Masse
- **Fichiers** : `assemblage_question_a.SLDASM`, `assemblage_question_b.SLDASM`  
- **Centre de masse** :
  - Config. A (A=25°, B=125°, C=130°): (X=327.67, Y=-98.39, Z=-102.91)  
  - Config. B (A=30°, B=115°, C=135°): (X=348.66, Y=-88.48, Z=-91.40)

**Image Assemblage:**
![Vue détaillée de la pièce - Question a](Documentation/semaine-2/mecanique/images/picture_assemblage_a.png)
![Vue détaillée de la pièce - Question b](Documentation/semaine-2/mecanique/images/picture_assemblage_b.png)

**Résultat**

Fichiers : 
[Télécharger la pièce - Question a](Documentation/semaine-2/mecanique/Assemblage/Question_A.zip)

[Télécharger la pièce - Question b](Documentation/semaine-2/mecanique/Assemblage/Question_B.zip)


**Réponses aux questions**

![Question a](Documentation/semaine-2/mecanique/images/picture_mass_properties_a.png)
a) Les coordonnées du centre de masse pour A = 25 degrees ; B = 125 degrees ; C = 130 degrees sont : 
- X = **327.67**
- Y = **- 98.39**
- Z = **- 102.91**

![Question b](Documentation/semaine-2/mecanique/images/picture_mass_properties_b.png)
b) Les coordonnées du centre de masse pour A = 30 degrees ; B = 115 degrees ; C = 135 degrees sont :
- X = **348.66**
- Y = **- 88.48**
- Z = **- 91.40**

## Difficultés Rencontrées et Solutions Apportées
| Problème                                   | Analyse détaillée                                                                 | Solution mise en place                                                       |
|--------------------------------------------|-----------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| Application des congés dans espaces étroits| Impossibilité de sélectionner toutes les arêtes sans erreurs de géométrie         | Séparation en deux opérations : congés internes d’abord, puis externes       |                    |
| Validation du centre de masse              | Position non-conforme aux spécifications angulaires                               | Calibration via mesures sur assemblage simulé, ajustement des axes de référence |

---


## Section Vidéo et Médias
- **Vidéo tutoriel** : démonstration des étapes clés (2 min).  
- **Liens** : 
  - YouTube : `https://youtu.be/…`  
  - Repos GitHub : `https://github.com/TekBot-Robotics-Challenge/2025-Team-IFRI-Docs`

---

## Glossaire
- **Bossage/Base** : extrusion élémentaire créant un volume.  
- **Congé** : arrondi appliqué sur une arête.  
- **Équations globales** : variables paramétrant le modèle.  
- **Manifold** : surface continue sans discontinuité.

---

## Références et Liens Utiles
- Manuel SolidWorks 2025 – Chap. Équations et Variables
- Tutoriels suivis
  - https://youtu.be/PQHjY9_b94w?si=Ah0PxEUdaubB3jMf
  - https://youtu.be/ESkXkDUmsNc?si=8zdjJDQK-7fBHAwG

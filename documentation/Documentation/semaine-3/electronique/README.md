# Documentation Complète du Projet "Afficheur 7 Segments à Servomoteurs"

**Date :** 28 Juin 2025
**Équipe :** IFRI - Team Électronique

---

## Table des Matières
1.  [Introduction : Vision du Projet et Objectifs Initiaux](#1-introduction--vision-du-projet-et-objectifs-initiaux)
2.  [Conception Matérielle : Les Choix Techniques et la Réalisation Physique](#2-conception-matérielle--les-choix-techniques-et-la-réalisation-physique)
    * [2.1. Le Microcontrôleur : ATmega328P nu](#21-le-microcontrôleur--atmega328p-nu)
    * [2.2. Le Contrôleur de Servomoteurs : PCA9685](#22-le-contrôleur-de-servomoteurs--pca9685)
    * [2.3. L'Alimentation : Module MP1584EN](#23-lalimentation--module-mp1584en)
    * [2.4. La Conception Physique de l'Afficheur](#24-la-conception-physique-de-lafficheur)
    * [2.5. Connectique et Simplifications](#25-connectique-et-simplifications)
    * [2.6. Réalisation du Circuit sur Veroboard](#26-réalisation-du-circuit-sur-veroboard)
3.  [Conception Logicielle : Les Stratégies de Programmation](#3-conception-logicielle--les-stratégies-de-programmation)
    * [3.1. Gestion du Timing Non Bloquant (`millis()`)](#31-gestion-du-timing-non-bloquant-millis)
    * [3.2. Structuration du Code](#32-structuration-du-code)
    * [3.3. Contrôle des Servos et Valeurs Calibrées](#33-contrôle-des-servos-et-valeurs-calibrées)
    * [3.4. Logique de Comptage](#34-logique-de-comptage)
4.  [Mise en Œuvre : Programmation et Calibration Précise](#4-mise-en-œuvre--programmation-et-calibration-précise)
    * [4.1. Le Défi : Programmer un ATmega328P nu](#41-le-défi--programmer-un-atmega328p-nu)
    * [4.2. Option Retenue : Utilisation d'une carte Arduino Uno comme Programmeur Temporaire](#42-option-retenue--utilisation-dune-carte-arduino-uno-comme-programmeur-temporaire)
    * [4.3. Tests Unitaires et Calibration Individuelle des Segments](#43-tests-unitaires-et-calibration-individuelle-des-segments)
    * [4.4. Implications pour la Programmation sur Veroboard](#44-implications-pour-la-programmation-sur-veroboard)
5.  [Réalisation Finale et Démonstration](#5-réalisation-finale-et-démonstration)
    * [5.1. Intégration Matérielle et Assemblage Final](#51-intégration-matérielle-et-assemblage-final)
    * [5.2. Fonctionnement du Système Complet](#52-fonctionnement-du-système-complet)
    * [5.3. Conclusion et Bilan](#53-conclusion-et-bilan)

---

## 1. Introduction : Vision du Projet et Objectifs Initiaux

Ce document retrace le parcours de notre projet d'électronique pour le TEKBOT ROBOTICS CHALLENGE 2025 : la réalisation d'un **afficheur 7 segments d'un genre nouveau**. L'idée principale était de s'affranchir des afficheurs lumineux traditionnels pour innover et démontrer notre aptitude à relever des défis techniques originaux.

Nous avons choisi de matérialiser chaque segment de l'afficheur par un **servomoteur**. L'objectif est de contrôler ces 7 servomoteurs de manière synchronisée pour afficher les chiffres de 0 à 9, avec un décompte de 9 à 0.

Le défi technique majeur imposé par le challenge et relevé avec succès est la conception d'un système **sans utilisation de la fonction bloquante `delay()`** dans le code Arduino. Cette approche non bloquante garantit une réactivité optimale et permet l'intégration future d'autres fonctionnalités sans compromettre la fluidité du comptage.

Le concept clé de notre réalisation physique est une **structure imprimée en 3D formant la façade de l'afficheur**, avec des ouvertures hexagonales pour chaque segment. Chaque segment est une pièce mobile distincte, positionnée derrière son ouverture et connectée à un servomoteur par un fil de fer.
* Lorsque le segment est **inactif** (non concerné par le chiffre), le servomoteur tire le fil de fer, faisant rentrer le segment à l'intérieur du support. Sa face avant est alors **confondue** avec la surface du grand rectangle support, le rendant discret et visuellement intégré.
* Lorsque le segment est **actif** (doit faire partie du chiffre), le servomoteur pousse le fil de fer, faisant "sortir" le segment vers l'avant. Sa face avant est alors **en relief** par rapport au support, le rendant clairement visible et créant l'affichage du chiffre.

Cette approche innovante offre un rendu visuel dynamique et tactile, où les chiffres "émergent" littéralement de l'afficheur.

---

## 2. Conception Matérielle : Les Choix Techniques et la Réalisation Physique

Cette section détaille les composants électroniques choisis pour notre afficheur, les raisons derrière ces sélections, et les défis de conception matérielle rencontrés et surmontés lors de la réalisation physique.

### 2.1. Le Microcontrôleur : ATmega328P nu

Le cœur de notre système est le microcontrôleur **ATmega328P** en boîtier DIP-28. Ce choix s'est imposé pour plusieurs raisons :
* **Conformité au Challenge :** Utilisation directe d'un microcontrôleur plutôt qu'une carte Arduino complète.
* **Flexibilité :** Microcontrôleur polyvalent avec ressources suffisantes.
* **Coût :** Solution économique.
* **Familiarité :** Intégration facilitée dans l'écosystème Arduino.

Son rôle principal est d'orchestrer la logique du comptage et d'envoyer les commandes appropriées au contrôleur de servomoteurs.

### 2.2. Le Contrôleur de Servomoteurs : PCA9685

Pour piloter les 7 servomoteurs, nous avons opté pour le module **PCA9685**.
* **Nécessité de sorties PWM :** 7 servomoteurs nécessitent chacun un signal PWM dédié, que l'ATmega seul ne peut pas gérer efficacement.
* **Décharge du Microcontrôleur :** Le PCA9685 est un contrôleur PWM dédié, libérant l'ATmega de la génération continue des signaux.
* **Communication I2C :** L'ATmega communique avec le PCA9685 via le protocole I2C (broches SDA - PC4, SCL - PC5).

Voici une image du module PCA9685 que nous utilisons :
![Image du module PCA9685](Documentation/semaine-3/electronique/images_vids/pca9685.jpg)

Et notre schéma KiCad complet, illustrant l'intégration du PCA9685 via un connecteur :
![Image du schéma KiCad complet du circuit](Documentation/semaine-3/electronique/images_vids/pca9685-puce-servos.png)

### 2.3. L'Alimentation : Module MP1584EN

L'alimentation est assurée par une **batterie au lithium**, comme spécifié par le challenge.
* **Choix du Régulateur :** Module DC-DC step-down basé sur la puce **MP1584EN**.
    * **Justification :** Régulateur à découpage pour une meilleure **efficacité énergétique**, moins de chaleur, et une meilleure autonomie de la batterie LiPo. Capable de fournir le courant nécessaire aux servomoteurs.
* **Alimentation logique :** Le VCC logique est directement alimenté par le 5V fourni par le module MP1584EN. L'isolation LC initialement prévue a été omise en raison des contraintes d'approvisionnement.
* **Défi du footprint :** Création d'un footprint KiCad personnalisé pour le module MP1584EN, n'étant pas disponible en bibliothèque standard.
    ![Image des dimensions du module MP1584EN](Documentation/semaine-3/electronique/images_vids/dimensions_dcdc.png)
    ![Image du footprint KiCad personnalisé du MP1584EN](Documentation/semaine-3/electronique/images_vids/mp1584en_footprint_kicad.png)

### 2.4. La Conception Physique de l'Afficheur

La matérialisation des segments est au cœur de l'innovation de ce projet.
* **Structure 3D :** L'afficheur est construit autour d'une structure principale imprimée en 3D, formant le cadre et les ouvertures des segments.
    ![Image de la vue de face de l'afficheur 3D](Documentation/semaine-3/electronique/images_vids/face_afficheur1.jpeg)
* **Mécanisme des Segments :** Chaque segment est une pièce mobile connectée à un servomoteur par un fil de fer.
    * **Segment Actif (Visible) :** Le servo pousse le fil, segment en relief.
    * **Segment Inactif (Masqué) :** Le servo tire le fil, segment confondu avec la façade.
    ![Image de la vue latérale de la structure 3D avec servos](Documentation/semaine-3/electronique/images_vids/lateral_afficheur.jpeg)
    ![Image du détail du montage d'un servo sur la structure 3D](Documentation/semaine-3/electronique/images_vids/vid_montage_afficheur.mp4) 
    

### 2.5. Connectique et Simplifications

Le design a été adapté pour se concentrer sur la fonctionnalité essentielle.
* **Connecteurs :** Connecteurs femelles pour le PCA9685 et connecteurs 3 broches pour les servos, assurant modularité.
* **Simplifications :** Retrait du Header ISP et de la LED RGB pour respecter les délais et se concentrer sur la fonction principale.

### 2.6. Réalisation du Circuit sur Veroboard

Initialement prévu sur PCB, le circuit a été monté sur **veroboard** (carte à bandes perforées) en raison des contraintes de temps. Cette adaptation a permis de garantir la réalisation d'un circuit fonctionnel dans le délai imparti.

![Image du circuit minimal sur Kicad](Documentation/semaine-3/electronique/images_vids/circuit_minimal.png)
[Image du circuit minimal sur Kicad](Documentation/semaine-3/electronique/images_vids/pcb.png)

---

## 3. Conception Logicielle : Les Stratégies de Programmation

Cette section décrit les principes de programmation appliqués pour notre afficheur, axés sur la réactivité et la modularité.

### 3.1. Gestion du Timing Non Bloquant (`millis()`)

* **Problème de `delay()` :** Bloque l'exécution du microcontrôleur.
* **Solution `millis()` :** Utilisation de `millis()` pour des temporisations non bloquantes (`if (currentMillis - previousMillis >= interval)`).
* **Avantages :** Microcontrôleur réactif, traitement simultané d'autres tâches.

### 3.2. Structuration du Code

Code organisé de manière modulaire :
* **Fonctions dédiées :** `setSegmentState`, `displayDigit`.
* **Tableau de motifs :** `digitPatterns` centralise la définition des chiffres.

### 3.3. Contrôle des Servos et Valeurs Calibrées

* **Bibliothèque `Adafruit_PWMServoDriver` :** Simplifie l'interaction avec le PCA9685.
* **"Ticks" PWM et Calibration Individuelle :** La position des servos est définie par la durée de l'impulsion PWM ("ticks" 0-4095). Pour chaque segment, nous utilisons deux valeurs clés :
    * `SERVO_PULSE_EXTENDED` : Valeur pour pousser le segment (visible).
    * `SERVO_PULSE_RETRACTED` : Valeur pour tirer le segment (masqué).
    Ces valeurs sont stockées dans des **tableaux (`servoPulseExtended[7]`, `servoPulseRetracted[7]`)** dans le code principal. Elles ont été déterminées avec précision lors de la phase de calibration individuelle (voir section 4.3) pour compenser les variations physiques de montage.

### 3.4. Logique de Comptage

* **Algorithme :** Comptage de 0 à 9, puis décompte de 9 à 0. Inversion de la direction aux extrémités (après 9 et avant 0).
* **Feedback visuel :** La LED RGB initialement prévue a été retirée de la réalisation physique finale, mais la logique de comptage est robuste pour une éventuelle réintégration.

---

## 4. Mise en Œuvre : Programmation et Calibration Précise

Cette section détaille les étapes de programmation de l'ATmega328P et le processus crucial de calibration ayant mené à un fonctionnement précis de l'afficheur.

### 4.1. Le Défi : Programmer un ATmega328P nu

Un ATmega328P neuf n'a pas de bootloader Arduino, et le circuit sur veroboard n'a pas d'interface USB-série. Une méthode spécifique est requise pour téléverser le code.

### 4.2. Option Retenue : Utilisation d'une carte Arduino Uno comme Programmeur Temporaire

* **Processus :**
    1.  Retrait de l'ATmega d'origine de l'Arduino Uno.
    2.  Insertion de notre ATmega328P-PU dans le support DIP de l'Uno.
    3.  Téléversement du code Arduino via l'IDE sur notre ATmega (qui utilise alors le bootloader déjà présent).
    4.  Transfert de l'ATmega programmé sur le circuit veroboard final.
* **Justification :** Simplicité, pas d'achat de matériel ISP additionnel, utilisation d'outils familiers.

### 4.3. Tests Unitaires et Calibration Individuelle des Segments

Une étape fondamentale pour le succès du projet a été la calibration précise de chaque servomoteur. En raison des tolérances de fabrication, des montages et des longueurs de fils, chaque servo requiert des valeurs de pulse uniques pour les positions "étendu" et "rétracté".

* **Méthode :** Un **code de calibration spécifique** a été utilisé. Ce code permettait de :
    1.  Sélectionner une broche de segment cible (0 à 6).
    2.  Appliquer une valeur de pulse fixe à ce seul segment.
    3.  L'opérateur ajustait manuellement cette valeur dans le code, puis téléversait pour observer le mouvement.
    * Le processus était itératif : ajustement, téléversement, observation, jusqu'à obtenir la position parfaite pour les deux états (sorti/rentré) de chaque segment.
* **Importance :** Cette calibration unitaire a garanti que chaque segment se déplace avec précision, sans bloquer ni dépasser ses limites, assurant un affichage net et fiable des chiffres.
*

### 4.4. Implications pour la Programmation sur Veroboard

L'absence de header ISP sur le veroboard final (simplification due aux contraintes) signifie que les mises à jour logicielles nécessitent de retirer l'ATmega328P pour le reprogrammer via l'Arduino Uno. Le débogage série est également plus complexe.

---

## 5. Réalisation Finale et Démonstration

Cette section présente le résultat final du projet, son fonctionnement et une conclusion sur les accomplissements.

### 5.1. Intégration Matérielle et Assemblage Final

Le circuit électronique assemblé sur veroboard a été intégré à la structure 3D imprimée. Les 7 servomoteurs ont été montés avec précision et connectés au PCA9685. La batterie et le module d'alimentation MP1584EN ont été raccordés pour assurer une alimentation stable à l'ensemble du système.

**Vue d'ensemble du branchement physique final :**
![Image du branchement physique final](Documentation/semaine-3/electronique/images_vids/image_totale_1.jpeg)

![Image du branchement physique final](Documentation/semaine-3/electronique/images_vids/image.png)
![Image du branchement physique final](Documentation/semaine-3/electronique/images_vids/image_copy.png)
![Image du branchement physique final](Documentation/semaine-3/electronique/images_vids/image_copy1.png)
![Image du branchement physique final](Documentation/semaine-3/electronique/images_vids/image_copy2.png)
*Ces images montrent l'intégration de la carte veroboard avec l'ATmega, le PCA9685, le module d'alimentation, et les connexions vers les servomoteurs.*

### 5.2. Fonctionnement du Système Complet

Le système final fonctionne comme prévu, effectuant un cycle de comptage fluide de 0 à 9, puis un décompte de 9 à 0. Chaque chiffre est affiché par l'activation ou la désactivation précise des segments grâce aux servomoteurs, utilisant les valeurs de pulse calibrées. Le fonctionnement non bloquant du code garantit une transition fluide entre les chiffres.

**Vidéo de démonstration complète du fonctionnement :**
![Vidéo de démonstration complète](Documentation/semaine-3/electronique/images_vids/full_demo_video.mp4)

*Cette vidéo présente l'afficheur en action, démontrant le comptage ascendant et descendant, et la fluidité des mouvements des segments.*

### 5.3. Conclusion et Bilan

Le projet d’afficheur 7 segments à servomoteurs a été une réussite, même si certains obstacles techniques nous ont empêchés d’achever totalement le prototype. L’absence de résistance pour le reset sur le veroboard, ainsi que la faible résistance mécanique des fils de fer reliant les moteurs aux segments, ont constitué des freins majeurs à la finalisation complète du système. Malgré ces défis — utilisation d’un ATmega328P nu, contraintes de temps, et nécessité d’une calibration mécanique précise — nous avons su concevoir et réaliser un prototype fonctionnel et innovant. L’approche non bloquante du code et la rigueur apportée à la calibration ont été des facteurs clés de réussite. Ce projet illustre notre capacité à transformer une idée originale en réalisation concrète, en relevant des défis matériels et logiciels complexes.
---
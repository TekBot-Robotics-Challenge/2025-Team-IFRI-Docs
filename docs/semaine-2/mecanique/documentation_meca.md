# **Semaine 2**

## **Test 2 – Niveau Intermédiaire**

## **Présentation du Projet**

Ce test consiste à concevoir et modéliser un composant mécanique dans le cadre de l’examen de certification SolidWorks Associate – niveau intermédiaire. Cette pièce sert de support de validation pour démontrer des compétences avancées en modélisation, incluant la création de géométries complexes, la modification de fonctions et le respect précis des cotes et tolérances.
L'objectif est de modéliser une pièce mécanique dans **SolidWorks**, à partir d’un dessin technique 2D fourni, en utilisant les paramètres A, B et C, puis de déterminer la **masse de la pièce** pour différentes valeurs de ces paramètres.

## **Technologie utilisée**

Les différentes pièces ont été modélisées avec le logiciel **SolidWorks 2025**.

## **Spécifications techniques**

* **Matériau** : Acier AISI 1020
* **Densité** : 0.0079 g/mm³
* **Système d’unités** : MMGS (millimètre, gramme, seconde)
* **Précision décimale** : 2 chiffres après la virgule
* **Remarque** : Tous les perçages sont traversants, sauf indication contraire.

---

## **Présentation des esquisses**

### **Partie 1**

![Vue détaillée de la pièce](/docs/semaine-2/mecanique/Partie%201/picture_piece_partie1.png)

**Étapes de modélisation :**

1. **Créer un nouveau fichier pièce**

   * Unités : Millimètres (MMGS)
   * Plan de référence : Plan de face

2. **Esquisser le profil 2D**

   * Utiliser les outils **Ligne**, **Cercle**, et **Arc** pour reproduire le profil technique fourni.
   * Inclure les éléments suivants :

     * Un trou de Ø14 mm
     * Congés de rayon R5 et R29
     * Lignes inclinées à 45° et 10°
   * Ajouter toutes les autres cotes mentionnées sur le dessin technique.

3. **Définir les paramètres**

   * Définir trois variables globales via Outils > Équations :

     * A = 81 mm (ou 84 mm)
     * B = 57 mm (ou 59 mm)
     * C = 43 mm (ou 45 mm)
   * Lier les dimensions de l’esquisse à ces variables.

4. **Extrusion**

   * Utiliser la fonction **Bossage/Base extrudé** avec une épaisseur de **C**.

5. **Vérification**

   * Contrôler la géométrie 3D avec la vue isométrique fournie.

#### **Question A**

* Valeurs : A = 81 mm, B = 57 mm, C = 43 mm
* Fichier : [Télécharger la pièce](/docs/semaine-2/mecanique/Partie%201/piece_partie1_a.SLDPRT)
* Masse : **939.54 grammes**
  ![Propriétés de masse](/docs/semaine-2/mecanique/Partie%201/picture_mass_properties_partie1_a.png)

#### **Question B**

* Valeurs : A = 84 mm, B = 59 mm, C = 45 mm
* Fichier : [Télécharger la pièce](/docs/semaine-2/mecanique/Partie%201/piece_partie1_b.SLDPRT)
* Masse : **1032.32 grammes**
  ![Propriétés de masse](/docs/semaine-2/mecanique/Partie%201/picture_mass_properties_partie1_b.png)

### **Partie 2**

![Vue détaillée de la pièce](/docs/semaine-2/mecanique/Partie%202/picture_piece_partie2.png)

**Étapes de modélisation :**

1. **Mettre à jour les variables globales :**

   * A = 86 mm
   * B = 58 mm
   * C = 44 mm

2. **Esquisse sur le plan de face :**

   * Définir le contour avec l’outil Ligne.
   * Spécifier la surface à extruder.

3. **Découpes par extrusion :**

   * Utiliser la fonction **Enlèvement de matière extrudé** sur les zones définies.
   * Répéter l’opération sur le plan droit.

#### **Résultat :**

* Fichier : [Télécharger la pièce](/docs/semaine-2/mecanique/Partie%202/piece_partie2.SLDPRT)
* Masse : **628.18 grammes**
  ![Propriétés de masse](/docs/semaine-2/mecanique/Partie%202/picture_mass_properties_partie2.png)


### **Partie 3**

![Vue détaillée de la pièce](/docs/semaine-2/mecanique/Partie%203/picture_piece_partie3.png)

**Étapes de modélisation :**

1. **Découpe de poche latérale :**

   * Sélectionner la face concernée.
   * Esquisser le contour de la poche.
   * Utiliser **Enlèvement de matière extrudé** avec la profondeur demandée.

2. **Ajout de congés internes :**

   * Outil : **Congé**
   * Rayon : 5 mm
   * Appliquer à toutes les arêtes internes.

3. **Répétition linéaire des fonctions (si nécessaire) :**

   * Sélectionner la fonction à répéter.
   * Définir la direction, le nombre d’instances et l’espacement.

4. **Découpe finale – “Jusqu’à suivant” :**

   * Esquisser le profil final.
   * Utiliser **Enlèvement de matière extrudé – Jusqu’à suivant**.

5. **Inspection finale :**

   * Utiliser **Surlignage dynamique** pour vérifier chaque fonction.
   * Corriger les esquisses sous-définies ou références manquantes.

#### **Résultat :**

* Fichier : [Télécharger la pièce](/docs/semaine-2/mecanique/Partie%203/picture_piece_partie3.SLDPRT)
* Masse : **432.58 grammes**
  ![Propriétés de masse](/docs/semaine-2/mecanique/Partie%203/picture_mass_properties_partie3.png)


### **Assemblage**

![Vue détaillée de la pièce - Question a](/docs/semaine-2/mecanique/Assemblage/picture_assemblage_a.png)
![Vue détaillée de la pièce - Question b](/docs/semaine-2/mecanique/Assemblage/picture_assemblage_b.png)

**Etape de modélisation**
### 3. **Insertion des autres composants**

- Cliquer sur `Insertion de composant > Pièce existante`.
- Ajouter les autres composants :
  - Les **axes cylindriques** (1 et 2) en vert.
  - Les **maillons secondaires** .

### 4. **Définir les contraintes (liaisons/mates)**

Utiliser l’outil `Lier les composants (Mate)` dans l’onglet **Assemblage** pour créer les **liaisons mécaniques** entre les éléments.

### 5. **Respecter l’origine**

- Vérifie que le **premier maillon** est bien **fixé à l’origine**.
- Fixer l'origine dans le cas contraire.

### 6. **Contrôle final**

- Passe en **vue isométrique**
- Vérifie les points suivants :
  - ✅ L’assemblage suit bien la disposition donnée.
  - ✅ Toutes les contraintes sont bien définies et résolues.
  - ✅ Aucun composant ne reste **flottant** (non contraint).
  - ✅ L’origine et les unités sont respectées : **MMGS** et **2 décimales**.

**Résultat**
Fichiers : [Télécharger la pièce - Question a](/docs/semaine-2/mecanique/Assemblage/assemblage_question_a.SLDASM)
[Télécharger la pièce - Question b](/docs/semaine-2/mecanique/Assemblage/assemblage_question_b.SLDASM)
**Réponses aux questions**

![Question a](/docs/semaine-2/mecanique/Assemblage/picture_mass_properties_a.png)
a) Les coordonnées du centre de masse pour A = 25 degrees ; B = 125 degrees ; C = 130 degrees sont : 
- X = **327.67**
- Y = **-98.39**
- Z = **-102.91**

![Question b](/docs/semaine-2/mecanique/Assemblage/picture_mass_properties_b.png)
b) Les coordonnées du centre de masse pour A = 30 degrees ; B = 115 degrees ; C = 135 degrees sont :
- X = **348.66**
- Y = **-88.48**
- Z = **-91.40**
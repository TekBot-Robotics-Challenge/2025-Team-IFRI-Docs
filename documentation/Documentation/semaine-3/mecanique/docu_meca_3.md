# 🛠️ Documentation – Test 3 : Niveau Avancé

## 📋 Table des Matières

1. [Contexte et Objectif du Test](#contexte)  
2. [Spécifications et livrables](#specifications)  
3. [Processus et méthodologie](#processus)  
4. [Tâches à réaliser](#taches)  
5. [Critères de réussite](#criteres)  
6. [Pièce à modéliser](#piece)  
7. [Présentation des résultats](#resultats)  
8. [Ressources et références](#ressources)  
9. [Annexes](#annexes)

---

<a name="contexte"></a>
## 1. 🎯 Contexte et Objectif du Test

**Test 3 – Niveau avancé**  
Évaluer la capacité à concevoir, modéliser et valider une pièce mécanique complexe en respectant :
1. la géométrie donnée (plans + rendus 3D)  
2. la masse cible (calcul à la décimale près)  
3. la gestion des erreurs d’unités et d’arrondis  

---

<a name="specifications"></a>
## 2. 📐 Spécifications et livrables

1. **Unité** : MMGS (millimètre, gramme, seconde)  
2. **Décimales** : 2  
3. **Matériau** : Aluminium 1060 (ρ = 2700 kg/m³)  
4. **Congés filetés** : 12 × R10  
5. **Trous** : tous débouchants sauf indication contraire  

### Livrables

1. **Fichier CAO** de la pièce modélisée (.SLDPRT ou équivalent)  
2. **Tableau de calcul** des masses pour les trois jeux de dimensions  
3. **Rapport détaillé** décrivant la démarche et les arrondis appliqués  

---

<a name="processus"></a>
## 3. Processus et méthodologie

Nous avons respecté toutes les côtes et tolérances du document fourni. Chaque étape contient un emplacement pour insérer vos captures d’écran afin d’illustrer l’avancement.

---

### 1. Import des plans et préparation du fichier  
- **But** : récupérer les vues 2D/3D et caler l’origine.  
- **Actions** :  
  1. Ouvrir le modèle de base (template CAO).  
  2. Insérer les esquisses des vues (dessus, face, coupe).  
  3. Vérifier l’échelle (MMGS) et la position de l’origine. 

### 2. Esquisse de la forme principale  
- **But** : tracer la silhouette trapézoïdale et les grands évidements.  
- **Actions** :  
  1. Sur le plan supérieur, dessiner le contour extérieur avec les valeurs adéquates.  
  2. Ajouter les cavités carrées (grandes alvéoles) centrées.  
  3. Placer l’axe de symétrie pour assurer la symétrie des opérations suivantes.   

---

### 3. Extrusion et découpe initiale  
- **But** : donner l’épaisseur de base et définir les volumes à enlever.

- **Actions** :  
  1. Extruder la forme principale à la hauteur demandée (zones basses et hautes).  
  2. Appliquer une coupe droite pour séparer les deux hauteurs selon.  

---

### 4. Création des évidements secondaires et rainures  
- **But** : réaliser la rainure centrale et les évidements latéraux.

- **Actions** :  
  1. Sur la face supérieure, esquisser la rainure (épaisseur 5 mm, profondeur 2,5 mm).  
  2. Extruder enlevé sur la profondeur spécifiée.  
  3. Reproduire l’opération de chaque côté selon symétrie.   

---

### 5. Perçages et congés  
- **But** : ajouter tous les trous débouchants et arrondir les arêtes intérieures.  
- **Actions** :  
  1. Modéliser chaque perçage Ø10 aux emplacements spécifiés.  
  2. Appliquer les congés R10 sur les 12 arrêtes intérieures.  

---

### 6. Découpe inclinée et formes angulaires  
- **But** : réaliser une coupe à travers la pièce et les transitions.  
- **Actions** :  
  1. Esquisser la ligne de coupe inclinée sur la vue latérale.  
  2. Extruder enlevé en traversant tout le volume.  
  3. Vérifier l’angle et ajuster si nécessaire.  

---

### 7. Détails finaux et contrôle qualité  
- **But** : valider la pièce et préparer l’export final.  
- **Actions** :  
  1. Vérifier toutes les côtes critiques avec l’outil de mesure.  
  2. Comparer visuellement avec les rendus 3D fournis (couleur, placement des éléments).  
  3. Enregistrer et nommer correctement le fichier `.SLDPRT`.  


- **Illustrations en images** :  
  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_1.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_2.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_3.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_4.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_5.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_6.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_7.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_8.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_9.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_10.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_11.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_12.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_13.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_14.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_15.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_16.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_17.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_18.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_19.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_20.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_21.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_22.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_23.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_24.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_25.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_26.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_27.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_28.png)

  ![Import des vues](Documentation/semaine-3/mecanique/assets/processus_image/img_29.png)

  *Figure : Processus en image de construction de la pièce du test 3.*  

---

<a name="taches"></a>
## 4. 🛠️ Tâches à réaliser

Pour chaque jeu de dimensions, calculer la masse de la pièce (en grammes) :

1. **Q3a.** A = 193 mm ; B = 88 mm ; W = B/2 ; X = A/4 ; Y = B + 5,5 mm ; Z = B + 15 mm  
2. **Q3b.** A = 205 mm ; B = 100 mm ; W = B/2 ; X = A/4 ; Y = B + 5,5 mm ; Z = B + 15 mm  
3. **Q3c.** A = 210 mm ; B = 105 mm ; W = B/2 ; X = A/4 ; Y = B + 5,5 mm ; Z = B + 15 mm  

**À fournir** :  
1. - Les valeurs numériques (masse en g, arrondie à 2 décimales)  
2. - Capture d’écran du calcul de volume/masse dans le logiciel CAO  

---

<a name="criteres"></a>
## 5. ✅ Critères de réussite

1. **Exactitude** des masses (< ± 1 % d’écart)  
2. **Conformité géométrique** (tolérances dimensionnelles respectées)  
3. **Clarté** du rapport 
4. **Qualité** du fichier CAO (nommage, structure, mise en plan propre)

---

<a name="piece"></a>
## 6. 🧩 Pièce à Modéliser

![Plans et rendus 3D de la pièce - 1](Documentation/semaine-3/mecanique/assets/imgs/a_modeliser_1.png)
*Rendu 1 : Vue de dessus - de droite - trisométrie*

![Plans et rendus 3D de la pièce - 2](Documentation/semaine-3/mecanique/assets/imgs/a_modeliser_2.png)  
*Rendu 1 : Vue de face - trisométrie*

---


<a name="resultats"></a>
## 7. 📊 Présentation des Résultats
<table>
  <thead>
    <tr>
      <th>Cas</th>
      <th>A (mm)</th>
      <th>B (mm)</th>
      <th>Masse calculée (g)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Q3a</td>
      <td>193</td>
      <td>88</td>
      <td><strong>1393,82</strong></td>
    </tr>
    <tr>
      <td>Q3b</td>
      <td>205</td>
      <td>100</td>
      <td><strong>1492,49</strong></td>
    </tr>
    <tr>
      <td>Q3c</td>
      <td>210</td>
      <td>105</td>
      <td><strong>1531,19</strong></td>
    </tr>
  </tbody>
</table>

### Captures d’écran des masses obtenues

![Capture volume – Q3a](Documentation/semaine-3/mecanique/assets/imgs/a_masse.png)  
*Figure 1 : Calcul de volume et masse pour le cas Q3a*


![Capture volume – Q3b](Documentation/semaine-3/mecanique/assets/imgs/b_masse.png)  
*Figure 2 : Calcul de volume et masse pour le cas Q3b*


![Capture volume – Q3c](Documentation/semaine-3/mecanique/assets/imgs/c_masse.png)  
*Figure 3 : Calcul de volume et masse pour le cas Q3c*


### Captures d’écran CAO

![Capture realisation – top](Documentation/semaine-3/mecanique/assets/imgs/dessus_face.png)  
*Figure 1 : Présentation de la figure réalisée - vue de dessus*


![Capture realisation – front](Documentation/semaine-3/mecanique/assets/imgs/en_face.png)  
*Figure 2 : Présentation de la figure réalisée - vue de face*


![Capture realisation – right](Documentation/semaine-3/mecanique/assets/imgs/droite_face.png)  
*Figure 2 : Présentation de la figure réalisée - vue de droite*


![Capture realisation – trisométrie](Documentation/semaine-3/mecanique/assets/imgs/trisométrique.png)  
*Figure 2 : Présentation de la figure réalisée - vue trisométrique*

### Pièces réalisées

1. 🔗 [Pièce finale - Q3a](Documentation/semaine-3/mecanique/pieces-realises/third_test_final_piece-a.SLDPRT)

2. 🔗 [Pièce finale - Q3b](Documentation/semaine-3/mecanique/pieces-realises/third_test_final_piece-b.SLDPRT)

3. 🔗 [Pièce finale - Q3c](Documentation/semaine-3/mecanique/pieces-realises/third_test_final_piece-c.SLDPRT)


### Vidéos illustratives

<iframe src="https://player.vimeo.com/video/1097167515?h=204e839d21" 
        width="640" height="360" 
        frameborder="0" allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen>
</iframe>


1. **Vidéo de présentation de la pièce cible : [cliquez ici](https://vimeo.com/1097167515/204e839d21?share=copy)**

---

<a name="ressources"></a>
## 8. 📚 Ressources et Références

### 📘 Documentation technique

- *SolidWorks: Le guide du débutant* – [PDF]  


### 🛠️ Outils et logiciels
<table>
  <thead>
    <tr>
      <th>Outil</th>
      <th>Version</th>
      <th>Usage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SolidWorks</td>
      <td>2025</td>
      <td>Modélisation et calcul de volume</td>
    </tr>
  </tbody>
</table>


### ⚙️ Composants et matériaux / Fonctions

1. **Aluminium 1060** (ρ = 2700 kg/m³)  
2. **Filet R10** pour les congés  
3. **Perçages** : diamètre selon plan  

---


<a name="annexes"></a>
## 9. 📎 Annexes

Aucune annexe pour l’instant. Cette section pourra accueillir :  
1. plans détaillés  
2. calculs avancés  
3. échanges techniques  

---

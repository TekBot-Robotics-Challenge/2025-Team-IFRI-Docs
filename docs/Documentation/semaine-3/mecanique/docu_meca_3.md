# 🛠️ Documentation – Test 3 : Niveau Avancé

## 📋 Table des Matières

1. [Contexte et Objectif du Test](#contexte)  
2. [Spécifications et Livrables](#specifications)  
3. [Processus et Méthodologie](#processus)  
4. [Tâches à Réaliser](#taches)  
5. [Critères de Réussite](#criteres)  
6. [Pièce à Modéliser](#piece)  
7. [Présentation des Résultats](#resultats)  
8. [Ressources et Références](#ressources)  
9. [Annexes](#annexes)

---

<a name="contexte"></a>
## 1. 🎯 Contexte et Objectif du Test

**Test 3 – Niveau Avancé**  
Évaluer la capacité à concevoir, modéliser et valider une pièce mécanique complexe en respectant :
- la géométrie donnée (plans + rendus 3D)  
- la masse cible (calcul à la décimale près)  
- la gestion des erreurs d’unités et d’arrondis  

---

<a name="specifications"></a>
## 2. 📐 Spécifications et Livrables

- **Unité** : MMGS (millimètre, gramme, seconde)  
- **Décimales** : 2  
- **Matériau** : Aluminium 1060 (ρ = 2700 kg/m³)  
- **Congés filetés** : 12 × R10  
- **Trous** : tous débouchants sauf indication contraire  

### Livrables

1. **Fichier CAO** de la pièce modélisée (.SLDPRT ou équivalent)  
2. **Tableau de calcul** des masses pour les trois jeux de dimensions  
3. **Rapport détaillé** décrivant la démarche et les arrondis appliqués  

---

<a name="processus"></a>
## 3. 🔄 Processus et Méthodologie

1. Importer les plans 2D et vues 3D dans votre logiciel CAO.  
2. Reproduire fidèlement la géométrie (dimensions A, B, W, X, Y, Z).  
3. Appliquer les congés R10 et perçages.  
4. Vérifier la volumétrie et calculer la masse théorique.  
5. Comparer aux valeurs cibles, ajuster les tolérances si nécessaire.  

---

<a name="taches"></a>
## 4. 🛠️ Tâches à Réaliser

Pour chaque jeu de dimensions, calculer la masse de la pièce (en grammes) :

- **Q3a.** A = 193 mm ; B = 88 mm ; W = B/2 ; X = A/4 ; Y = B + 5,5 mm ; Z = B + 15 mm  
- **Q3b.** A = 205 mm ; B = 100 mm ; W = B/2 ; X = A/4 ; Y = B + 5,5 mm ; Z = B + 15 mm  
- **Q3c.** A = 210 mm ; B = 105 mm ; W = B/2 ; X = A/4 ; Y = B + 5,5 mm ; Z = B + 15 mm  

> **À fournir** :  
> - Les valeurs numériques (masse en g, arrondie à 2 décimales)  
> - Capture d’écran du calcul de volume/masse dans le logiciel CAO  
> - Brève note sur le traitement des arrondis  

---

<a name="criteres"></a>
## 5. ✅ Critères de réussite

- **Exactitude** des masses (< ± 1 % d’écart)  
- **Conformité géométrique** (tolérances dimensionnelles respectées)  
- **Clarté** du rapport 
- **Qualité** du fichier CAO (nommage, structure, mise en plan propre)

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

| Cas   | A (mm) | B (mm) | Masse calculée (g) |
|-------|--------|--------|--------------------|
| Q3a   | 193    | 88     | **1393,82**            |
| Q3b   | 205    | 100    | **1492,49**          |
| Q3c   | 210    | 105    | **1531,19**            |

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

- 🔗 [Pièce finale - Q3a](Documentation/semaine-3/mecanique/pieces-realises/third_test_final_piece-a.SLDPRT)  
- 🔗 [Pièce finale - Q3b](Documentation/semaine-3/mecanique/pieces-realises/third_test_final_piece-b.SLDPRT)   
- 🔗 [Pièce finale - Q3c](Documentation/semaine-3/mecanique/pieces-realises/third_test_final_piece-c.SLDPRT)   




---

<a name="ressources"></a>
## 8. 📚 Ressources et Références

### 📘 Documentation Technique

- *SolidWorks: Le guide du débutant* – [PDF]  

### 🛠️ Outils et Logiciels

| Outil          | Version | Usage                                  |
|----------------|---------|----------------------------------------|
| SolidWorks     | 2025    | Modélisation et calcul de volume       |
| MS Excel       | –       | Tableau de calcul et arrondis          |

### ⚙️ Composants et Matériaux / Fonctions

- **Aluminium 1060** (ρ = 2700 kg/m³)  
- **Filet R10** pour les congés  
- **Perçages** : diamètre selon plan  

---

<a name="annexes"></a>
## 9. 📎 Annexes

Aucune annexe pour l’instant. Cette section pourra accueillir :  
- plans détaillés  
- calculs avancés  
- échanges techniques  

---

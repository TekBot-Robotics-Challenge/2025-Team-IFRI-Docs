# 🛠️ Documentation – Test 3 : Niveau avancé

## 📋 Table des matières

1. [Introduction](#introduction)  
2. [Analyse préliminaire](#analyse-preliminaire)  
3. [Spécifications et objectifs](#specifications)  
4. [Choix des matériaux et récapitulatif des composants](#materiaux)  
5. [Justification des choix techniques](#justifications)  
6. [Processus de modélisation et méthode de travail](#processus)  
7. [Composants modélisés – Détail par pièce](#composants)  
8. [Assemblage final et fonctionnement](#assemblage)  
9. [Galerie d’illustrations](#galerie)  
10. [Limites actuelles et pistes d’amélioration](#limites)  
11. [Ressources et références](#ressources)  

---

## 1. 🎯 Introduction <a name="introduction"></a>

Le **Test Final** du **Tekbot Robotics Challenge 2025** consiste à concevoir un **système de convoyeur intelligent** pour le tri de déchets représentés par des cubes de couleur. 

Cette documentation regroupe l'ensemble des **décisions, conceptions, modélisations et résultats** réalisés par l’équipe mécanique. Le système mécanique constitue une **base fonctionnelle** pour les autres équipes (IT & Électronique) et doit permettre :
- Une détection fiable des déchets,
- Une intégration stable des capteurs et actionneurs,
- Une robustesse structurelle adaptée aux tests,
- Une évolutivité pour le challenge final.

Le projet s’inscrit dans une logique de **conception collaborative et modulaire**, avec pour ambition de fournir une base fiable, documentée, et optimisable.

---

## 2. 🧠 Analyse préliminaire <a name="analyse-preliminaire"></a>

### 2.1 Réunion d’équipe
Une séance stratégique a été organisée entre les équipes IT, Électronique et Mécanique afin de :
- Comprendre les exigences de chaque sous-système ;
- Déterminer les contraintes mécaniques et d'intégration ;
- Convenir d’une démarche **modulaire, évolutive et réaliste** ;
- Coordonner les interfaces physiques entre les sous-ensembles.

### 2.2 Enjeux identifiés
- Garantir un **alignement précis** de la bande transporteuse ;
- Prévoir l’**espace de montage** des capteurs (laser, couleur) ;
- Fournir un support fiable au moteur et au système de tension ;
- Rester compatible avec les **contraintes d’usinage et de matériaux disponibles**.

### 2.3 Contexte global du système
Le système mécanique doit accueillir et intégrer les sous-ensembles électroniques et informatiques tout en assurant une fluidité de mouvement. Il devra notamment :
- Intégrer un tambour mobile réglable pour la tension de bande,
- Offrir un accès rapide à l’électronique embarquée,
- Être démontable pour maintenance ou mise à jour.

---

## 3. 📐 Spécifications et objectifs <a name="specifications"></a>

- **Longueur utile du convoyeur** : 650 mm  
- **Hauteur bande-sol** : 100 mm  
- **Déchets simulés** : cubes 30×30 mm  
- **Tambours** : 2 tambours (entraîneur et retour)  
- **Matériaux dominants** : bois MDF, PLA, acier  
- **Fixations** : vis M4/M5, inserts ou équerres  
- **Zone de détection intégrée** : oui  
- **Zone de collecte manuelle** : 4 bacs (rouge, bleu, jaune, vert)  

### Objectifs mécaniques à atteindre
- Conception fiable et modulaire,
- Intégration aisée des capteurs (laser, couleur),
- Capacité de tension de bande ajustable,
- Documentation complète avec vue d’assemblage, masse, plans.

---

## 4. 🧱 Choix des matériaux et récapitulatif des composants <a name="materiaux"></a>

La sélection des matériaux a été faite selon les critères de **légèreté, disponibilité, facilité d’usinage**, et coût réduit.

<table>
  <thead>
    <tr>
      <th>Composant</th>
      <th>Fichier associé</th>
      <th>Matériau</th>
      <th>Procédé</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Châssis principal</td>
      <td>chassis_v1</td>
      <td>MDF 10 mm</td>
      <td>Découpe manuelle / CNC</td>
    </tr>
    <tr>
      <td>Tambour moteur</td>
      <td>rouleau_v01</td>
      <td>PLA</td>
      <td>Impression 3D</td>
    </tr>
    <tr>
      <td>Tambour retour</td>
      <td>rouleau_v02</td>
      <td>PLA</td>
      <td>Impression 3D</td>
    </tr>
    <tr>
      <td>Roulements</td>
      <td>roulement1 à 4</td>
      <td>Acier (608Z)</td>
      <td>Standard</td>
    </tr>
    <tr>
      <td>Axe tambour</td>
      <td>axe_v1</td>
      <td>Tige filetée / PLA</td>
      <td>Coupe ou impression</td>
    </tr>
    <tr>
      <td>Support moteur</td>
      <td>for_motor_v2</td>
      <td>PLA</td>
      <td>Impression 3D</td>
    </tr>
    <tr>
      <td>Bande transporteuse</td>
      <td>Courroie1</td>
      <td>Chambre à air / tissu élastique</td>
      <td>Découpe / couture</td>
    </tr>
    <tr>
      <td>Capteur couleur</td>
      <td>color_sensor</td>
      <td>N/A</td>
      <td>Intégré via support imprimé</td>
    </tr>
    <tr>
      <td>Capteur laser</td>
      <td>ky008_sensor</td>
      <td>N/A</td>
      <td>Fixation bois / PLA</td>
    </tr>
    <tr>
      <td>Cube test</td>
      <td>cube_blanc</td>
      <td>PLA</td>
      <td>Impression 3D</td>
    </tr>
  </tbody>
</table>

---

## 5. ⚙️ Justification des choix techniques <a name="justifications"></a>

Les composants sélectionnés ont été choisis pour optimiser la compatibilité mécanique, la simplicité d’intégration, la robustesse et le coût.

- **MDF 10 mm** : léger, rigide, facilement découpable à la main ou en CNC.
- **PLA pour tambours et supports** : idéal pour l’impression rapide de pièces personnalisées et précises.
- **608Z roulements** : couramment utilisés, disponibles, faible friction, compatibles avec axes métalliques ou imprimés.
- **Tige filetée** : permet d’ajuster facilement la tension et d’adapter l’assemblage.
- **Chambre à air** : bonne adhérence, coût faible, facile à monter sur les tambours.

---

## 6. 🛠️ Processus de modélisation et méthode de travail <a name="processus"></a>

1. **Modélisation pièce par pièce sur SolidWorks** : chaque composant a été d’abord créé séparément.
2. **Nomination claire des fichiers** : ex. `roulement1.SLDPRT`, `chassis_v1.SLDPRT`.
3. **Assemblage progressif** : chaque sous-système (tambour, support capteur, zone de tri) a été validé seul avant d’être assemblé dans `Convoyeur_Assemblage.SLDASM`.
4. **Tests de contraintes de montage** : vérification du passage de la bande, du positionnement des vis, de la tolérance des pièces mobiles.

---

## 7. 🧩 Composants modélisés – Détail par pièce <a name="composants"></a>

### 7.1 Châssis principal
- Forme : cadre rectangulaire avec pieds et ouvertures pour bennes
- Matériau : MDF 10 mm
- Fonctions : support global, intégration bande + moteurs + capteurs

### 7.2 Tambours
- Deux tambours modélisés (avant moteur et arrière libre)
- Forme cylindrique, avec logement d’axe
- Imprimés en PLA – adaptés aux roulements

### 7.3 Roulements
- Type 608Z
- Insérés dans logements imprimés ou percés dans bois
- Assurent la rotation fluide des tambours

### 7.4 Support moteur
- Fixation ajustée pour moteur DC
- Inclut trou pour poulie ou accouplement
- Conçu pour être vissé au cadre

### 7.5 Zone capteurs
- Tunnel avec fenêtre pour capteur couleur
- Positionné au centre longitudinal
- Intègre aussi le capteur de présence laser (opposé à LDR)

---

## 8. 🧱 Assemblage final et fonctionnement <a name="assemblage"></a>

- Bande installée sur les deux tambours
- Tambour arrière monté sur glissière pour ajuster la tension
- Capteurs placés avant la sortie
- Moteur actionne la bande uniquement si présence détectée
- À la sortie, bacs colorés manuels pour chaque déchet

---

## 9. 🖼️ Galerie d’illustrations <a name="galerie"></a>

<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/1.png" alt="Vue 1"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/2.png" alt="Vue 2"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/3.png" alt="Vue 3"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/4.png" alt="Vue 4"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/5.png" alt="Vue 5"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/6.png" alt="Vue 6"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/7.png" alt="Vue 7"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/8.png" alt="Vue 8"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/9.png" alt="Vue 9"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/10.png" alt="Vue 10"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/11.png" alt="Vue 11"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/12.png" alt="Vue 12"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/13.png" alt="Vue 13"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/14.png" alt="Vue 14"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/15.png" alt="Vue 15"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/16.png" alt="Vue 16"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/17.png" alt="Vue 17"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/18.png" alt="Vue 18"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/19.png" alt="Vue 19"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/20.png" alt="Vue 20"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/21.png" alt="Vue 21"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/22.png" alt="Vue 22"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/23.png" alt="Vue 23"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/24.png" alt="Vue 24"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/25.png" alt="Vue 25"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/26.png" alt="Vue 26"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/27.png" alt="Vue 27"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/28.png" alt="Vue 28"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/29.png" alt="Vue 29"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/30.png" alt="Vue 30"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/31.png" alt="Vue 31"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/32.png" alt="Vue 32"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/33.png" alt="Vue 33"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/34.png" alt="Vue 34"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/35.png" alt="Vue 35"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/36.png" alt="Vue 36"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/37.png" alt="Vue 37"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/38.png" alt="Vue 38"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/39.png" alt="Vue 39"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/40.png" alt="Vue 40"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/41.png" alt="Vue 41"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/42.png" alt="Vue 42"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/43.png" alt="Vue 43"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/44.png" alt="Vue 44"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/45.png" alt="Vue 45"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/46.png" alt="Vue 46"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/47.png" alt="Vue 47"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/48.png" alt="Vue 48"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/49.png" alt="Vue 49"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/50.png" alt="Vue 50"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/51.png" alt="Vue 51"></div>
<div class="image-container"><img src="Documentation/test-final/docu_meca_final_test/assets/imgs/52.png" alt="Vue 52"></div>


### Pièces réalisées

- 🔗 [Assemblage du convoyeur](Documentation/test-final/docu_meca_final_test/assets/convoyeur/convoyeur_IFRI.SLDASM)  
- 🔗 [ZIP - IFRI CONVOYEUR](Documentation/test-final/docu_meca_final_test/assets/IFRI_Convoyeur.zip)


### Vidéos Illustratives

 <div style="padding:56.1% 0 0 0;position:relative;">
      <iframe src="https://vimeo.com/1100862208?share=copy" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Conveyor Demo"></iframe>
    </div>
    <script src="https://player.vimeo.com/api/player.js"></script>



---

## 10. 🚧 Limites actuelles et pistes d’amélioration <a name="limites"></a>

- Le système de tension pourrait être amélioré avec des ressorts ou vis de pression.
- Le châssis est rigide mais non démontable facilement (remplacer bois par profilé aluminium ?).
- Les capteurs sont fonctionnels mais sensibles à l’éclairage : tunnel à renforcer.

---

## 11. 📚 Ressources et références <a name="ressources"></a>

- Complilations des tests – PDF
- [GrabCAD](https://grabcad.com/)
- SolidWorks 2021

---



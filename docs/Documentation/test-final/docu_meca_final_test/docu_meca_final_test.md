<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation – Test 3: Advanced Level</title>
  <style>
    body { font-family: Arial, sans-serif; line-height:1.6; margin: 20px; }
    header, nav, section, footer { margin-bottom: 30px; }
    header h1 { font-size: 2em; margin-bottom: 0.2em; }
    nav ul { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap:10px; }
    nav a { text-decoration: none; color: #007acc; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    table th, table td { border: 1px solid #ddd; padding: 8px; }
    table th { background-color: #f4f4f4; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr)); gap:10px; }
    .gallery img { width: 100%; height: auto; display: block; border: 1px solid #ddd; border-radius:4px; }
    .links-list { margin: 15px 0; }
    .links-list li { margin-bottom: 5px; }
    h2 { border-bottom: 2px solid #eee; padding-bottom: 5px; }
  </style>
</head>
<body>
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
      <th>Procédé</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Châssis principal</td>
      <td>MDF 10 mm</td>
      <td>Découpe manuelle / CNC</td>
    </tr>
    <tr>
      <td>Tambour moteur</td>
      <td>PLA</td>
      <td>Impression 3D</td>
    </tr>
    <tr>
      <td>Tambour retour</td>
      <td>PLA</td>
      <td>Impression 3D</td>
    </tr>
    <tr>
      <td>Roulements</td>
      <td>Acier (608Z)</td>
      <td>Standard</td>
    </tr>
    <tr>
      <td>Axe tambour</td>
      <td>Tige filetée / PLA</td>
      <td>Coupe ou impression</td>
    </tr>
    <tr>
      <td>Support moteur</td>
      <td>PLA</td>
      <td>Impression 3D</td>
    </tr>
    <tr>
      <td>Bande transporteuse</td>
      <td>Chambre à air / tissu élastique</td>
      <td>Découpe / couture</td>
    </tr>
    <tr>
      <td>Capteur couleur</td>
      <td>N/A</td>
      <td>Intégré via support imprimé</td>
    </tr>
    <tr>
      <td>Capteur laser</td>
      <td>N/A</td>
      <td>Fixation bois / PLA</td>
    </tr>
    <tr>
      <td>Cube test</td>
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

<section id="gallery">
    <div class="gallery">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/1.png" alt="View 1">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/2.png" alt="View 2">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/3.png" alt="View 3">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/4.png" alt="View 4">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/5.png" alt="View 5">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/6.png" alt="View 6">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/7.png" alt="View 7">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/8.png" alt="View 8">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/9.png" alt="View 9">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/10.png" alt="View 10">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/11.png" alt="View 11">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/12.png" alt="View 12">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/13.png" alt="View 13">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/14.png" alt="View 14">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/15.png" alt="View 15">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/16.png" alt="View 16">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/17.png" alt="View 17">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/18.png" alt="View 18">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/19.png" alt="View 19">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/20.png" alt="View 20">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/21.png" alt="View 21">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/22.png" alt="View 22">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/23.png" alt="View 23">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/24.png" alt="View 24">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/25.png" alt="View 25">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/26.png" alt="View 26">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/27.png" alt="View 27">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/28.png" alt="View 28">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/29.png" alt="View 29">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/30.png" alt="View 30">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/31.png" alt="View 31">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/32.png" alt="View 32">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/33.png" alt="View 33">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/34.png" alt="View 34">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/35.png" alt="View 35">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/36.png" alt="View 36">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/37.png" alt="View 37">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/38.png" alt="View 38">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/39.png" alt="View 39">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/40.png" alt="View 40">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/41.png" alt="View 41">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/42.png" alt="View 42">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/43.png" alt="View 43">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/44.png" alt="View 44">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/45.png" alt="View 45">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/46.png" alt="View 46">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/47.png" alt="View 47">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/48.png" alt="View 48">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/49.png" alt="View 49">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/50.png" alt="View 50">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/51.png" alt="View 51">
      <img src="Documentation/test-final/docu_meca_final_test/assets/imgs/52.png" alt="View 52">
    </div>
  </section>




### Pièces réalisées

<<<<<<< HEAD
<ul>
  <li>🔗 <a href="Documentation/test-final/docu_meca_final_test/assets/convoyeur/convoyeur_IFRI.SLDASM" download>Assemblage du convoyeur</a></li>
  <li>🔗 <a href="Documentation/test-final/docu_meca_final_test/assets/IFRI_Convoyeur.zip" download>ZIP - IFRI CONVOYEUR</a></li>
</ul>
=======
- 🔗 [Assemblage du convoyeur](Documentation/test-final/docu_meca_final_test/assets/convoyeur/convoyeur_IFRI.SLDASM)  
- 🔗 [ZIP - IFRI CONVOYEUR](Documentation/test-final/docu_meca_final_test/assets/CONV-20mm-6204.zip)
>>>>>>> e688ba059081f748a548c5d2d04c15f37cf81854




### Vidéos Illustratives


<iframe width="560" height="315" src="https://www.youtube.com/embed/vj6xNaSZe-0?si=icsYnZ1H8NwGMah7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


Si la vidéo ne marche pas, [cliquez ici](https://youtu.be/vj6xNaSZe-0?feature=shared).



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
</body>
</html>



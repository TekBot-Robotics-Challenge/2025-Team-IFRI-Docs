# Documentation : Détection Intelligente des Couleurs pour le Système de Convoyeur

## Table des Matières
1. [Introduction](#introduction)
2. [Composants Utilisés](#composants-utilisés)
   - [Capteur de Couleur GY-33 TCS34725](#capteur-de-couleur-gy-33-tcs34725)
3. [Approches de Détection des Couleurs](#approches-de-détection-des-couleurs)
   - [Approche 1 : Classification Basique](#approche-1--classification-basique)
   - [Approche 2 : Amélioration avec Correction Gamma](#approche-2--amélioration-avec-correction-gamma)
   - [Approche 3 : Détection de Couleur Améliorée pour 10-12 cm](#approche-3--détection-de-couleur-améliorée-pour-10-12-cm)
   - [Approche 4 : Calibration du Convoyeur](#approche-4--calibration-du-convoyeur)
   - [Approche 5 : Perspectives avec Machine Learning](#approche-5--perspectives-avec-machine-learning)
4. [Défis Rencontrés](#défis-rencontrés)
5. [Algorithme de Gestion du Tri](#algorithme-de-gestion-du-tri)
6. [Conclusion](#conclusion)
7. [Références](#références)

---

## Introduction

Notre équipe IT a développé un système de détection intelligente des couleurs pour un convoyeur destiné au tri de déchets. L'objectif principal est d'identifier quatre types de déchets en fonction de leur couleur : rouge, bleu, vert et jaune. Ce système utilise le capteur de couleur GY-33 TCS34725, intégré au convoyeur, pour capturer les valeurs RVB (Rouge, Vert, Bleu) des objets qui passent devant lui.

Cette documentation présente notre processus de développement, les composants employés, les différentes approches explorées pour optimiser la détection, ainsi que les défis rencontrés. Nous expliquerons également des concepts techniques clés, comme la correction gamma, et fournirons des extraits de code pour illustrer nos solutions.

---

## Composants Utilisés

### Capteur de Couleur GY-33 TCS34725

Le **GY-33 TCS34725** est un capteur de couleur numérique basé sur le composant TCS34725 d'Adafruit. Il utilise une interface I2C pour communiquer avec un microcontrôleur, ce qui le rend facile à intégrer dans des systèmes embarqués comme notre convoyeur.

#### Caractéristiques Principales :
- **Interface I2C** : Communication simple avec des microcontrôleurs comme Arduino.
- **Temps d'intégration ajustable** : De 2,4 ms à 700 ms, permettant de s'adapter aux conditions d'éclairage.
- **Gain ajustable** : Options de 1x, 4x, 16x ou 60x pour amplifier le signal dans des environnements peu lumineux.
- **Sorties** : Fournit des valeurs brutes pour les canaux rouge (R), vert (G), bleu (B) et clair (C).

#### Fonctionnement :
Le capteur est équipé de quatre photodiodes sensibles à la lumière réfléchie par les objets. Chaque photodiode est associée à un canal :
- **R (Rouge)** : Mesure l'intensité de la lumière rouge.
- **G (Vert)** : Mesure l'intensité de la lumière verte.
- **B (Bleu)** : Mesure l'intensité de la lumière bleue.
- **C (Clair)** : Mesure la luminosité globale sans filtrage, utile pour normaliser les valeurs RVB et compenser les variations d'éclairage.

Les données brutes fournies par le capteur sont des entiers non signés sur 16 bits (uint16_t), représentant l'intensité lumineuse captée par chaque canal.

#### Référence :
- [Documentation officielle du GY-33 TCS34725](https://youpilab.com/components/product/capteur-de-couleur-gy-33-tcs34725)

---

## Approches de Détection des Couleurs

Nous avons exploré plusieurs approches pour optimiser la détection des couleurs, en tenant compte des contraintes de distance entre le capteur et les objets sur le convoyeur.

La première étape de notre pipeline consiste à lire les valeurs brutes R, G, B et C fournies par le capteur, puis à les normaliser en fonction de la valeur de clarté (Clear).

```cpp
uint16_t clear, red, green, blue;
// Lecture des données brutes
tcs.getRawData(&red, &green, &blue, &clear);

float r = (float)red / clear * 255.0;
float g = (float)green / clear * 255.0;
float b = (float)blue / clear * 255.0;
```
Cette normalisation permet de compenser les variations d'éclairage ambiant, en exprimant les valeurs RGB relatives à l'intensité lumineuse totale.

### Approche 1 : Classification Basique

#### Description :
Cette première approche repose sur une classification simple des couleurs en utilisant les valeurs RVB normalisées. Nous avons défini des seuils pour identifier les couleurs cible (rouge, bleu, vert, jaune) en comparant les intensités des canaux R, G et B.

#### Extrait de Code :
```cpp
// Classification des couleurs
String color;
if (r > g && r > b && r > 50) {
    color = "Red";
} else if (b > r && b > g && b > 50) {
    color = "Blue";
} else if (g > r && g > b && g > 50 && r > 50) {
    color = "Yellow"; // Jaune = vert + rouge
} else if (g > r && g > b && g > 50) {
    color = "Green";
} else {
    color = "Unknown";
}
```

#### Résultats :
- **Succès** : La détection est précise lorsque l'objet est très proche du capteur (distance quasi nulle, < 5 cm).
- **Limites** : À des distances supérieures à 5 cm, la précision diminue car l'intensité lumineuse captée diminue, rendant les valeurs RVB moins distinctes.

#### Défis :
- Sensibilité aux variations de distance.
- Influence de la luminosité ambiante sur les lectures.

---

### Approche 2 : Amélioration avec Correction Gamma

#### Description :
Pour pallier les limites de l'approche 1, nous avons introduit une **correction gamma** afin de compenser les variations de luminosité et d'améliorer la précision à des distances plus grandes (10-12 cm).

#### Qu'est-ce que la Correction Gamma ?
La correction gamma est une transformation non linéaire appliquée aux valeurs RVB pour ajuster leur intensité en fonction de la perception humaine des couleurs et des caractéristiques des capteurs. Elle compense la non-linéarité de la réponse du capteur à la lumière, rendant les lectures plus stables face aux variations de distance et d'éclairage.

La formule typique est :
```plaintext
Intensité corrigée = Intensité d'origine ^ gamma
```
où gamma est un exposant qui ajuste la courbe de réponse. Dans notre cas, nous avons utilisé gamma = 2.5.

#### Extrait de Code :
```cpp
// Création de la table gamma
for (int i = 0; i < 256; i++) {
    float x = i;
    x /= 255;
    x = pow(x, 2.5);
    x *= 255;
    gammatable[i] = (byte)x;
}

// Application de la correction gamma
r = gammatable[(int)r];
g = gammatable[(int)g];
b = gammatable[(int)b];
```

#### Résultats :
- La correction gamma stabilise les lectures. 
- Réduction de l'impact des variations de luminosité ambiante.

#### Défis :
- Nécessité d'ajuster le temps d'intégration et le gain (par exemple, 2,4 ms et gain 60x) pour des lectures rapides sur un convoyeur en mouvement.
- La calibration des seuils de couleur doit être effectuée pour chaque distance et condition d'éclairage.
---

### Approche 3 : Détection de Couleur Améliorée pour 10-12 cm

#### Description :
Pour surmonter les limitations de la première approche, nous avons optimisé les paramètres du capteur et mis en place une technique de réduction du bruit par moyennage des lectures.

#### Extrait de Code :
```cpp
// Prendre plusieurs lectures pour réduire le bruit
uint16_t r_sum = 0, g_sum = 0, b_sum = 0, c_sum = 0;
int num_reads = 5;
for (int i = 0; i < num_reads; i++) {
tcs.getRawData(&red, &green, &blue, &clear);
r_sum += red; g_sum += green; b_sum += blue; c_sum += clear;
delay(5);
}
red = r_sum / num_reads; green = g_sum / num_reads;
blue = b_sum / num_reads; clear = c_sum / num_reads;
```

#### Avantages :
Cette approche a significativement amélioré la précision à 10-12 cm, rendant le système adapté aux conditions du convoyeur. Le gain élevé et le temps d'intégration court ont permis des lectures rapides et fiables, tandis que le moyennage a réduit le bruit.

#### Limitations :
- Sensibilité aux variations extrêmes d'éclairage : Nécessite une calibration pour les conditions d'éclairage spécifiques du convoyeur.
---

### Approche 4 : Calibration du Convoyeur

#### Description :
Pour améliorer la robustesse, nous avons intégré une procédure de calibration interactive. Elle ajuste la balance du blanc et apprend les teintes de référence pour chaque couleur (rouge, vert, bleu, jaune) en utilisant l'espace colorimétrique HSV (Teinte, Saturation, Valeur).

#### Extrait de Code :
```cpp
void runCalibration() {
    // ÉTAPE 1: BALANCE DES Tous les blancs
    Serial.println("\n[ÉTAPE 1/5] Balance des Blancs");
      uint16_t r_white, g_white, b_white, c_white;
    tcs.getRawData(&r_white, &g_white, &b_white, &c_white);
    
    // Calcule les facteurs de correction
    float max_val = max(r_white, max(g_white, b_white));
    cal_R_factor = (r_white > 0) ? max_val / r_white : 1.0f;
    cal_G_factor = (g_white > 0) ? max_val / g_white : 1.0f;
    cal_B_factor = (b_white > 0) ? max_val / b_white : 1.0f;

    // ÉTAPES 2-5: APPRENTISSAGE DES COULEURS DE RÉFÉRENCE
    ref_hue_red = learnColorHue("ROUGE");
    ref_hue_green = learnColorHue("VERT");
    ref_hue_blue = learnColorHue("BLEU");
    ref_hue_yellow = learnColorHue("JAUNE");
}

float learnColorHue(String colorName) {
  Serial.println("\n[Apprentissage] Calibrage pour " + colorName);
  Serial.println("Placez un objet " + colorName + " devant le capteur et envoyez 'ok'.");
  waitForSerialInput();

  uint16_t r_raw, g_raw, b_raw, c_raw;
  tcs.getRawData(&r_raw, &g_raw, &b_raw, &c_raw);
  
  float r_cal = r_raw * cal_R_factor;
  float g_cal = g_raw * cal_G_factor;
  float b_cal = b_raw * cal_B_factor;
  
  float r_norm = (c_raw > 0) ? (float)r_cal / c_raw : 0;
  float g_norm = (c_raw > 0) ? (float)g_cal / c_raw : 0;
  float b_norm = (c_raw > 0) ? (float)b_cal / c_raw : 0;

  float hue, sat, val;
  RgbToHsv(r_norm, g_norm, b_norm, hue, sat, val);
  
  Serial.println(colorName + " appris avec une Teinte (Hue) de: " + String(hue));
  delay(500);
  return hue;
}
```

#### Résultats :
- Précision accrue, même à des distances variables, grâce à l'adaptation aux conditions d'éclairage et de distance.
- Permet une identification plus fiable des couleurs en tenant compte des variations de l'environnement.
---

### Approche 5 : Perspectives avec Machine Learning

#### Description :
Nous envisageons de collecter un jeu de données (valeurs RVB, canal clair, distances) pour entraîner un modèle de machine learning, comme un classificateur KNN, afin de prédire les couleurs avec une précision accrue.

#### Avantages :
- Gestion des variations complexes de distance et d'éclairage.
- Amélioration continue avec de nouvelles données.

#### État :
- Non implémenté par manque de temps, mais constitue une perspective future.

---

## Défis Rencontrés

1. **Distance Capteur-Objet** :
   - Problème : La précision diminue avec l'augmentation de la distance (> 5 cm).
   - Solution : Correction gamma et calibration.

2. **Conditions d'Éclairage** :
   - Problème : Variations de luminosité ambiante.
   - Solution : Normalisation par le canal clair et balance des blancs.

3. **Classification des Couleurs** :
   - Problème : Définir des seuils fiables.
   - Solution : Itérations et ajustements via calibration.

---

## Algorithme de Gestion du Tri

L'algorithme de gestion du tri combine détection, identification et consigne de tri :
1. **Détection** : Le capteur GY-33 TCS34725 capture les valeurs RVB et C.
2. **Identification** : Les valeurs sont normalisées, corrigées (gamma ou calibration), puis classifiées en rouge, bleu, vert ou jaune.
3. **Consigne de Tri** : Selon la couleur identifiée, une consigne est envoyée au système mécanique du convoyeur (non implémenté ici, mais prévu pour diriger les déchets vers des bacs spécifiques).

#### Exemple Simplifié :
```cpp
 // Classification des couleurs
String color;
if (r > g && r > b && r > 50) {
color = "Red";
} else if (b > r && b > g && b > 50) {
color = "Blue";
} else if (g > r && g > b && g > 50 && r > 50) {
color = "Yellow"; // Jaune = vert + rouge
} else if (g > r && g > b && g > 50) {
color = "Green";
} else {
color = "Unknown";
}
if (color == "Red") {
    // Envoyer consigne au moteur pour diriger vers le bac rouge
} else if (color == "Blue") {
    // Envoyer consigne pour le bac bleu
}
```

---

## Conclusion

Notre système de détection intelligente des couleurs, basé sur le capteur GY-33 TCS34725, permet d'identifier avec précision les couleurs rouge, bleu, vert et jaune à des distances de 10-12 cm. Grâce à des approches comme la correction gamma et la calibration, nous avons surmonté les défis liés à la distance et à l'éclairage. Des améliorations futures, telles qu'un capteur de présence ou un modèle de machine learning, pourraient encore optimiser le système.

---

## Références

- [Documentation du GY-33 TCS34725](https://youpilab.com/components/product/capteur-de-couleur-gy-33-tcs34725)
- [Correction Gamma - Wikipédia](https://fr.wikipedia.org/wiki/Correction_gamma)

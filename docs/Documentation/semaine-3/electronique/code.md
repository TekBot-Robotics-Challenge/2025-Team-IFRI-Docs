# Documentation - Code de l'Afficheur 7 Segments à Servomoteurs
# Documentation - Code de l'Afficheur 7 Segments à Servomoteurs

Cette documentation présente le code de notre afficheur 7 segments animé par servomoteurs. Ce projet innovant utilise des servomoteurs pour déplacer physiquement les segments, contrairement aux afficheurs LED traditionnels.

---

## Table des matières

1. [Aperçu du projet](#aperçu-du-projet)
2. [Matériel utilisé](#matériel-utilisé)
3. [Fonctionnement général](#fonctionnement-général)
4. [Processus de calibration](#processus-de-calibration)
5. [Code principal](#code-principal)
6. [Défis et solutions](#défis-et-solutions)
7. [Téléchargement](#téléchargement)

---

## Aperçu du projet

Notre afficheur 7 segments mécanique utilise un microcontrôleur ATmega328P (Arduino) et un contrôleur de servomoteurs PCA9685 pour piloter 7 servomoteurs. Chaque servomoteur déplace physiquement un segment, permettant d'afficher les chiffres de 0 à 9 de manière dynamique.

Le système est programmé pour effectuer un comptage alternativement croissant et décroissant de 0 à 9 puis de 9 à 0, avec un intervalle d'une seconde entre chaque changement.

## Matériel utilisé

- Microcontrôleur ATmega328P (Arduino)
- Contrôleur PCA9685 (16 canaux PWM, I²C)
- 7 micro-servomoteurs SG90
- Segments mécaniques fabriqués sur mesure
- Alimentation externe pour les servomoteurs

## Fonctionnement général

L'afficheur fonctionne selon le principe suivant :

1. Chaque segment (a-g) est contrôlé par un servomoteur dédié
2. Les servomoteurs ont deux positions :
   - **Position étendue** : le segment est visible (ON)
   - **Position rétractée** : le segment est caché (OFF)
3. Pour afficher un chiffre, le système positionne chaque segment selon un motif prédéfini
4. Le système change automatiquement de chiffre à intervalle régulier (1 seconde)
5. Une fois atteint 9, il compte à rebours jusqu'à 0, puis recommence

## Processus de calibration

Avant d'utiliser l'afficheur, une calibration précise des servomoteurs est nécessaire. Un programme dédié permet d'ajuster les positions étendues et rétractées pour chaque segment. Cette étape est cruciale car chaque servomoteur peut avoir des caractéristiques légèrement différentes, et les contraintes mécaniques de l'assemblage peuvent varier d'un segment à l'autre.

### Code de calibration

```cpp
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// Adresse I2C PCA9685
#define PCA9685_I2C_ADDR 0x40

// --- Broches Servo ---
#define SEG_A_PIN 0
#define SEG_B_PIN 1
#define SEG_C_PIN 2
#define SEG_D_PIN 3
#define SEG_E_PIN 4
#define SEG_F_PIN 5
#define SEG_G_PIN 6

// --- Valeurs de pulse (calibration) ---
// À ajuster manuellement par servo (ordre a-g)
int CAL_PULSE_EXTENDED[7] = {
  300, // Segment A
  300, // Segment B
  300, // Segment C
  300, // Segment D
  300, // Segment E
  300, // Segment F
  300  // Segment G
};

int CAL_PULSE_RETRACTED[7] = {
  150, // Segment A
  150, // Segment B
  150, // Segment C
  150, // Segment D
  150, // Segment E
  150, // Segment F
  150  // Segment G
};

// --- Cible de calibration ---
// Broche segment à calibrer (0-6)
const int TARGET_SEGMENT_PIN = SEG_A_PIN;

// Valeur de pulse à tester (0-4095)
int CURRENT_CALIBRATION_PULSE = 300;

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(PCA9685_I2C_ADDR);

// --- Fonctions ---

// Appliquer pulse au servo
void setSegmentPulse(int segmentPin, int pulseValue) {
  pwm.setPWM(segmentPin, 0, pulseValue);
}

// --- Setup Arduino ---
void setup() {
  Wire.begin();       // Init I2C
  pwm.begin();        // Init PCA9685
  pwm.setPWMFreq(50); // Fréquence PWM 50 Hz

  // Appliquer pulse cible au segment
  setSegmentPulse(TARGET_SEGMENT_PIN, CURRENT_CALIBRATION_PULSE);
}

// --- Loop Arduino ---
void loop() {
  // Boucle vide
}
```

### Instructions de calibration

Le processus de calibration se déroule comme suit:

1. **Sélection du segment**: Modifier la variable `TARGET_SEGMENT_PIN` pour cibler le segment à calibrer (0 à 6).
2. **Test initial**: Définir une valeur initiale pour `CURRENT_CALIBRATION_PULSE` (généralement 300).
3. **Téléversement**: Téléverser le code vers l'Arduino pour observer la position du segment.
4. **Ajustement progressif**: 
   - Augmenter la valeur pour étendre davantage le segment (généralement entre 300 et 500)
   - Diminuer la valeur pour rétracter le segment (généralement entre 100 et 300)
5. **Répétition**: Téléverser à nouveau après chaque ajustement jusqu'à obtenir la position parfaite.
6. **Documentation**: Noter les valeurs finales pour chaque segment:
   - Dans `CAL_PULSE_EXTENDED` pour la position où le segment est visible
   - Dans `CAL_PULSE_RETRACTED` pour la position où le segment est caché
7. **Transfert**: Une fois tous les segments calibrés, copier les valeurs finales dans le code principal.

Cette procédure doit être répétée pour chacun des 7 segments, ce qui nécessite patience et précision. Une bonne calibration assure un mouvement fluide et fiable des segments, sans tension excessive sur les composants mécaniques.

## Code principal

Une fois la calibration effectuée, le code principal permet l'affichage dynamique des chiffres. Examinons en détail chaque section du code pour comprendre son fonctionnement.

```cpp
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// Adresse I2C PCA9685
#define PCA9685_I2C_ADDR 0x40

// --- Broches Servo ---
// Broches PCA9685 (segments a-g)
#define SEG_A_PIN 0
#define SEG_B_PIN 1
#define SEG_C_PIN 2
#define SEG_D_PIN 3
#define SEG_E_PIN 4
#define SEG_F_PIN 5
#define SEG_G_PIN 6

// --- Valeurs de pulse servo (étendu/rétracté) ---
// Calibration nécessaire par servo (ordre a-g)
int servoPulseExtended[7] = {
  300, // Segment A
  300, // Segment B
  300, // Segment C
  300, // Segment D
  300, // Segment E
  300, // Segment F
  300  // Segment G
};

int servoPulseRetracted[7] = {
  150, // Segment A
  150, // Segment B
  150, // Segment C
  150, // Segment D
  150, // Segment E
  150, // Segment F
  150  // Segment G
};

// --- Motifs chiffres 0-9 (segments ON/OFF) ---
// Ordre: a, b, c, d, e, f, g
const byte digitPatterns[10][7] = {
  {1, 1, 1, 1, 1, 1, 0}, // Chiffre 0
  {0, 1, 1, 0, 0, 0, 0}, // Chiffre 1
  {1, 1, 0, 1, 1, 0, 1}, // Chiffre 2
  {1, 1, 1, 1, 0, 0, 1}, // Chiffre 3
  {0, 1, 1, 0, 0, 1, 1}, // Chiffre 4
  {1, 0, 1, 1, 0, 1, 1}, // Chiffre 5
  {1, 0, 1, 1, 1, 1, 1}, // Chiffre 6
  {1, 1, 1, 0, 0, 0, 0}, // Chiffre 7
  {1, 1, 1, 1, 1, 1, 1}, // Chiffre 8
  {1, 1, 1, 1, 0, 1, 1}  // Chiffre 9
};

// --- Variables de temps ---
unsigned long previousMillis = 0;
const long interval = 1000; // Intervalle changement chiffre (ms)

// --- Variables de comptage ---
int currentDigit = 0;
bool countingUp = true; // Sens comptage

// Objet PCA9685
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(PCA9685_I2C_ADDR);

// --- Fonctions ---

/**
 * @brief État segment (étendu/rétracté)
 * @param segmentPin Broche PCA9685 du segment
 * @param state 1: étendu (visible), 0: rétracté (masqué)
 */
void setSegmentState(int segmentPin, int state) {
  if (state == 1) { // Segment étendu
    pwm.setPWM(segmentPin, 0, servoPulseExtended[segmentPin]);
  } else { // Segment rétracté
    pwm.setPWM(segmentPin, 0, servoPulseRetracted[segmentPin]);
  }
}

/**
 * @brief Affichage chiffre 7-segments
 * @param digit Chiffre (0-9)
 */
void displayDigit(int digit) {
  if (digit >= 0 && digit <= 9) {
    for (int i = 0; i < 7; i++) { // Parcours segments (a-g)
      setSegmentState(i, digitPatterns[digit][i]);
    }
  }
}

// --- Setup Arduino ---
void setup() {
  Wire.begin();       // Init I2C
  pwm.begin();        // Init PCA9685
  pwm.setPWMFreq(50); // Fréquence PWM 50 Hz

  displayDigit(currentDigit); // Affichage initial chiffre 0
}

// --- Loop Arduino ---
void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis; // Sauvegarde temps dernière MAJ

    // MAJ chiffre / sens
    if (countingUp) {
      currentDigit++;
      if (currentDigit > 9) {
        currentDigit = 8; // Inverse direction (après 9)
        countingUp = false;
      }
    } else { // Comptage dégressif
      currentDigit--;
      if (currentDigit < 0) {
        currentDigit = 1; // Inverse direction (après 0)
        countingUp = true;
      }
    }

    displayDigit(currentDigit); // Affichage nouveau chiffre
  }

  // Autres tâches non bloquantes ici
}
```

### Points clés du code principal

1. **Configuration matérielle** :
   - Initialisation du contrôleur PCA9685 à l'adresse I2C 0x40
   - Configuration de la fréquence PWM à 50Hz (standard pour servomoteurs)

2. **Définition des motifs** :
   - Tableau `digitPatterns` contenant la configuration ON/OFF de chaque segment pour les chiffres 0-9
   - Ordre des segments : a, b, c, d, e, f, g (haut, haut-droite, bas-droite, bas, bas-gauche, haut-gauche, milieu)

3. **Gestion du temps** :
   - Utilisation de `millis()` pour un timing non bloquant
   - Changement de chiffre toutes les 1000 ms (1 seconde)

4. **Logique de comptage** :
   - Comptage ascendant de 0 à 9
   - Puis comptage descendant de 9 à 0
   - Variable `countingUp` pour suivre la direction

5. **Contrôle des servomoteurs** :
   - Fonction `setSegmentState()` pour positionner chaque segment
   - Fonction `displayDigit()` pour configurer tous les segments selon le chiffre à afficher

### Analyse détaillée des fonctions principales

#### `void setSegmentState(int segmentPin, int state)`

Cette fonction est le cœur du système de contrôle des segments individuels. Elle gère la position de chaque servomoteur:

- **Paramètres**:
  - `segmentPin`: Identifie le segment à contrôler (0-6 pour les segments a-g)
  - `state`: État désiré du segment (1 = visible/étendu, 0 = caché/rétracté)
  
- **Fonctionnement**:
  - Si `state` est 1, le servomoteur est positionné à la valeur "étendue" calibrée pour ce segment spécifique
  - Si `state` est 0, le servomoteur est positionné à la valeur "rétractée" calibrée pour ce segment spécifique
  - La fonction utilise `pwm.setPWM()` pour envoyer la commande au contrôleur PCA9685, qui génère le signal PWM approprié

- **Importance**:
  - Cette fonction abstraite la complexité de la commande des servomoteurs
  - Elle utilise les tableaux calibrés (`servoPulseExtended` et `servoPulseRetracted`) pour assurer un mouvement précis
  - Elle facilite la gestion de l'affichage en réduisant le contrôle à un simple état binaire (1/0)

#### `void displayDigit(int digit)`

Cette fonction transforme un chiffre (0-9) en configuration de segments correspondante:

- **Paramètres**:
  - `digit`: Le chiffre à afficher (0-9)
  
- **Fonctionnement**:
  - Vérifie que le chiffre est valide (entre 0 et 9)
  - Parcourt chaque segment (a-g) un par un
  - Pour chaque segment, consulte le tableau `digitPatterns` pour déterminer son état (allumé/éteint)
  - Appelle `setSegmentState()` pour positionner chaque segment en conséquence

- **Importance**:
  - Centralise la logique d'affichage des chiffres
  - Permet de changer facilement les motifs des chiffres en modifiant le tableau `digitPatterns`
  - Simplifie le code principal, qui n'a besoin que d'appeler `displayDigit(X)` pour afficher un chiffre

#### Boucle principale `loop()`

La fonction `loop()` implémente une logique non bloquante pour gérer le changement automatique des chiffres:

- **Principe de fonctionnement**:
  - Utilise `millis()` pour mesurer le temps écoulé depuis le dernier changement
  - Vérifie si l'intervalle spécifié (1000 ms) est dépassé
  - Si oui, incrémente ou décrémente le chiffre selon la direction actuelle
  - Inverse la direction lorsque les limites sont atteintes (0 et 9)

- **Avantages de cette approche**:
  - Le code reste réactif car il n'utilise pas de `delay()` bloquant
  - Permet d'ajouter d'autres fonctionnalités sans perturber le timing de l'affichage
  - Le comportement de "va-et-vient" (0→9→0) crée un effet visuel intéressant

## Défis et solutions

Le développement de cet afficheur a présenté plusieurs défis techniques que nous avons dû résoudre:

1. **Calibration précise des servomoteurs**
   - **Défi**: Chaque servomoteur présente des caractéristiques légèrement différentes, et les contraintes mécaniques varient selon l'emplacement du segment.
   - **Solution**: Nous avons développé un programme de calibration spécifique qui permet d'ajuster individuellement la position de chaque segment. La calibration est stockée dans des tableaux dédiés pour les positions étendues et rétractées.
   - **Résultat**: Chaque segment se positionne correctement, assurant une bonne visibilité des chiffres affichés.

2. **Synchronisation des mouvements**
   - **Défi**: Lors du changement de chiffre, l'activation séquentielle des servomoteurs pouvait créer un effet de "tremblement" ou d'affichage partiel temporaire.
   - **Solution**: La fonction `displayDigit()` active tous les segments nécessaires dans une séquence rapide. En outre, nous avons utilisé le contrôleur PCA9685 qui offre une précision temporelle supérieure à celle d'un Arduino seul.
   - **Résultat**: Les transitions entre chiffres sont désormais fluides et visuellement agréables.

3. **Programmation non bloquante**
   - **Défi**: L'utilisation de `delay()` pour temporiser le changement de chiffre aurait bloqué toute autre opération pendant ce temps.
   - **Solution**: Implémentation d'un système basé sur `millis()` qui vérifie périodiquement si l'intervalle de temps est écoulé sans bloquer l'exécution du programme.
   - **Résultat**: Le code reste réactif et pourrait facilement être étendu pour intégrer d'autres fonctionnalités (comme des boutons de contrôle ou une interface série).

4. **Contraintes mécaniques et fiabilité**
   - **Défi**: Les liens physiques entre servomoteurs et segments peuvent se détacher ou se déformer sous l'effet des forces répétées.
   - **Solution**: 
     - Calibration soigneuse pour limiter l'amplitude des mouvements au minimum nécessaire
     - Conception mécanique robuste avec points de fixation renforcés
     - Vérification périodique de l'alignement des segments
   - **Résultat**: Bien que nous ayons rencontré quelques problèmes avec la résistance des fils de fer utilisés comme liens mécaniques, le système est globalement fiable pour des démonstrations de courte à moyenne durée.

5. **Alimentation électrique**
   - **Défi**: Les servomoteurs peuvent consommer collectivement un courant important, surtout lors des changements d'état simultanés.
   - **Solution**: Utilisation d'une alimentation externe dédiée aux servomoteurs, séparée de celle du microcontrôleur, avec une capacité suffisante (>2A).
   - **Résultat**: Fonctionnement stable sans réinitialisation du système lors des pics de consommation.

## Téléchargement

- [⬇️ Télécharger le code de calibration](Documentation/semaine-3/electronique/images_vids/calibration_code.ino)
- [⬇️ Télécharger le code principal](Documentation/semaine-3/electronique/images_vids/main_code.ino)

## Conclusion

Le projet d'afficheur 7 segments à servomoteurs a été une réussite, même si certains obstacles techniques nous ont empêchés d'achever totalement le prototype. L'absence de résistance pour le reset sur le veroboard, ainsi que la faible résistance mécanique des fils de fer reliant les moteurs aux segments, ont constitué des freins majeurs à la finalisation complète du système. Malgré ces défis — utilisation d'un ATmega328P nu, contraintes de temps, et nécessité d'une calibration mécanique précise — nous avons su concevoir et réaliser un prototype fonctionnel et innovant. L'approche non bloquante du code et la rigueur apportée à la calibration ont été des facteurs clés de réussite. Ce projet illustre notre capacité à transformer une idée originale en réalisation concrète, en relevant des défis matériels et logiciels complexes.
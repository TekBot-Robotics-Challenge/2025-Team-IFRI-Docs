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
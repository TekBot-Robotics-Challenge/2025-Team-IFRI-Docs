// --- Bibliothèques ---
#include <Wire.h>             // Communication I2C
#include <Adafruit_TCS34725.h> // Capteur de couleur TCS34725



// --- Définitions des Broches ---
// Moteur DC (L298N)
const int PIN_MOTOR_ENA = 11;
const int PIN_MOTOR_IN1 = 9;
const int PIN_MOTOR_IN2 = 10;

// Capteurs Laser / Photorésistances
const int PIN_LASER_1_EMITTER = 6;
const int PIN_PHOTORES_1_RECEIVER = A0;

const int PIN_LASER_2_EMITTER = 3;
const int PIN_PHOTORES_2_RECEIVER = A1;

// --- Variables de Calibration et Paramètres ---
// Calibration Moteur
int motorSpeedPWM = 80; // Vitesse moteur (0-255)
long motorRunDuration_Start = 1500; // Durée rotation initiale (ms)
long motorRunDuration_Tri = 2000; // Durée rotation post-tri (ms)

// Calibration Lasers / Photorésistances
int laserThreshold_1 = 500; // Seuil détection laser 1
int laserThreshold_2 = 500; // Seuil détection laser 2

// Calibration Capteur de Couleur
struct ColorData {
  float r, g, b; // Valeurs moyennes RVB
};

ColorData calibWhite; // Données calibration blanc
ColorData calibGreen; // Données calibration vert
ColorData calibYellow; // Données calibration jaune
ColorData calibRed;   // Données calibration rouge
ColorData calibBlue;  // Données calibration bleu

// Instance du capteur de couleur
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_24MS, TCS34725_GAIN_1X);

// --- États du convoyeur (pour la logique de loop()) ---
enum ConveyorState {
  WAITING_FOR_CUBE,
  MOVING_TO_COLOR_SENSOR,
  MEASURING_COLOR,
  MOVING_TO_COLLECTION_POINT,
  AT_COLLECTION_POINT
};

ConveyorState currentState = WAITING_FOR_CUBE; // État initial

// --- Variables de comptage des couleurs (pour envoi I2C à l'ESP) ---
int greenCount = 0;
int yellowCount = 0;
int redCount = 0;
int blueCount = 0;

// --- Fonctions de Contrôle Moteur ---
void controlMotor(int speed, bool direction) {
  analogWrite(PIN_MOTOR_ENA, speed);
  digitalWrite(PIN_MOTOR_IN1, direction ? HIGH : LOW);
  digitalWrite(PIN_MOTOR_IN2, direction ? LOW : HIGH);
}

void stopMotor() {
  analogWrite(PIN_MOTOR_ENA, 0);
  digitalWrite(PIN_MOTOR_IN1, LOW);
  digitalWrite(PIN_MOTOR_IN2, LOW);
}

// --- Fonctions Capteurs Laser / Photorésistances ---
int readLaser1Receiver() {
  return analogRead(PIN_PHOTORES_1_RECEIVER);
}

int readLaser2Receiver() {
  return analogRead(PIN_PHOTORES_2_RECEIVER);
}

bool isLaser1Interrupted() {
  return readLaser1Receiver() < laserThreshold_1;
}

bool isLaser2Interrupted() {
  return readLaser2Receiver() < laserThreshold_2;
}

// --- Fonctions Capteur de Couleur ---
/**
 * @brief Lit les valeurs brutes RVB du capteur de couleur.
 * @param r Pointeur pour stocker la valeur Rouge.
 * @param g Pointeur pour stocker la valeur Verte.
 * @param b Pointeur pour stocker la valeur Bleue.
 */
void readColorRaw(float *r, float *g, float *b) {
  uint16_t clear, red, green, blue;
  tcs.getRawData(&red, &green, &blue, &clear); // Lecture données brutes

  // Normalisation ou ajustement (peut être affiné après tests)
  *r = (float)red;
  *g = (float)green;
  *b = (float)blue;
}

void calibrateColorSensor() {
  Serial.println("\n--- Calibration Capteur Couleur ---");
  Serial.println("Pret pour calibration. Placez objet devant capteur.");
  delay(1000);

  // Calibration Blanc
  Serial.println("\n--- CALIBRATION BLANC ---");
  Serial.println("Placez un objet BLANC sous le capteur.");
  Serial.println("Appuyez sur 'c' et ENTREE quand pret...");
  while (Serial.read() != 'c') {} // Attente 'c'

  Serial.println("Calibration Blanc en cours...");
  float r_sum = 0, g_sum = 0, b_sum = 0;
  for (int i = 0; i < 50; i++) { // Moyenne sur 50 lectures
    float r, g, b;
    readColorRaw(&r, &g, &b);
    r_sum += r; g_sum += g; b_sum += b;
    delay(20);
  }
  calibWhite = {r_sum / 50.0, g_sum / 50.0, b_sum / 50.0};
  Serial.print("Blanc calibre: R="); Serial.print(calibWhite.r);
  Serial.print(", G="); Serial.print(calibWhite.g);
  Serial.print(", B="); Serial.println(calibWhite.b);

  // Calibrations des couleurs spécifiques

  // Calibration VERT
  Serial.println("\n--- CALIBRATION VERT ---");
  Serial.println("Placez un cube VERT sous le capteur.");
  Serial.println("Appuyez sur 'c' et ENTREE quand pret...");
  while (Serial.read() != 'c') {}
  Serial.println("Calibration Vert en cours...");
  r_sum = 0; g_sum = 0; b_sum = 0;
  for (int i = 0; i < 50; i++) {
    float r, g, b;
    readColorRaw(&r, &g, &b);
    r_sum += r; g_sum += g; b_sum += b;
    delay(20);
  }
  calibGreen = {r_sum / 50.0, g_sum / 50.0, b_sum / 50.0};
  Serial.print("Vert calibre: R="); Serial.print(calibGreen.r);
  Serial.print(", G="); Serial.print(calibGreen.g);
  Serial.print(", B="); Serial.println(calibGreen.b);

  // Calibration JAUNE
  Serial.println("\n--- CALIBRATION JAUNE ---");
  Serial.println("Placez un cube JAUNE sous le capteur.");
  Serial.println("Appuyez sur 'c' et ENTREE quand pret...");
  while (Serial.read() != 'c') {}
  Serial.println("Calibration Jaune en cours...");
  r_sum = 0; g_sum = 0; b_sum = 0;
  for (int i = 0; i < 50; i++) {
    float r, g, b;
    readColorRaw(&r, &g, &b);
    r_sum += r; g_sum += g; b_sum += b;
    delay(20);
  }
  calibYellow = {r_sum / 50.0, g_sum / 50.0, b_sum / 50.0};
  Serial.print("Jaune calibre: R="); Serial.print(calibYellow.r);
  Serial.print(", G="); Serial.print(calibYellow.g);
  Serial.print(", B="); Serial.println(calibYellow.b);
  
  // Calibration ROUGE
  Serial.println("\n--- CALIBRATION ROUGE ---");
  Serial.println("Placez un cube ROUGE sous le capteur.");
  Serial.println("Appuyez sur 'c' et ENTREE quand pret...");
  while (Serial.read() != 'c') {}
  Serial.println("Calibration Rouge en cours...");
  r_sum = 0; g_sum = 0; b_sum = 0;
  for (int i = 0; i < 50; i++) {
    float r, g, b;
    readColorRaw(&r, &g, &b);
    r_sum += r; g_sum += g; b_sum += b;
    delay(20);
  }
  calibRed = {r_sum / 50.0, g_sum / 50.0, b_sum / 50.0};
  Serial.print("Rouge calibre: R="); Serial.print(calibRed.r);
  Serial.print(", G="); Serial.print(calibRed.g);
  Serial.print(", B="); Serial.println(calibRed.b);

  // Calibration BLEU
  Serial.println("\n--- CALIBRATION BLEU ---");
  Serial.println("Placez un cube BLEU sous le capteur.");
  Serial.println("Appuyez sur 'c' et ENTREE quand pret...");
  while (Serial.read() != 'c') {}
  Serial.println("Calibration Bleu en cours...");
  r_sum = 0; g_sum = 0; b_sum = 0;
  for (int i = 0; i < 50; i++) {
    float r, g, b;
    readColorRaw(&r, &g, &b);
    r_sum += r; g_sum += g; b_sum += b;
    delay(20);
  }
  calibBlue = {r_sum / 50.0, g_sum / 50.0, b_sum / 50.0};
  Serial.print("Bleu calibre: R="); Serial.print(calibBlue.r);
  Serial.print(", G="); Serial.print(calibBlue.g);
  Serial.print(", B="); Serial.println(calibBlue.b);

  Serial.println("\n--- Calibration terminee ---");
}

/**
 * @brief Calcule la distance euclidienne entre deux points RVB.
 */
float colorDistance(ColorData c1, ColorData c2) {
  return sqrt(pow(c1.r - c2.r, 2) + pow(c1.g - c2.g, 2) + pow(c1.b - c2.b, 2));
}

// Fonction pour déterminer la couleur du cube
/**
 * @brief Détermine la couleur d'un objet en le comparant aux données calibrées.
 * @return Chaîne de caractères représentant la couleur ("VERT", "JAUNE", "ROUGE", "BLEU", "INCONNU").
 */
String identifyColor() {
  float r_current, g_current, b_current;
  readColorRaw(&r_current, &g_current, &b_current);
  ColorData current = {r_current, g_current, b_current};

  // Seuil de proximité pour la reconnaissance de couleur
  // Ajuster cette valeur après la calibration pour affiner la reconnaissance
  const float COLOR_MATCH_THRESHOLD = 150.0; // Augmenter pour être plus tolérant, diminuer pour être plus strict

  // Calcul des distances par rapport aux couleurs calibrées
  float distGreen = colorDistance(current, calibGreen);
  float distYellow = colorDistance(current, calibYellow);
  float distRed = colorDistance(current, calibRed);
  float distBlue = colorDistance(current, calibBlue);

  // Déterminer la couleur la plus proche et si elle est dans le seuil
  float minDist = 1000000.0; // Grande valeur initiale
  String detectedColor = "INCONNU";

  if (distGreen < minDist) { minDist = distGreen; detectedColor = "VERT"; }
  if (distYellow < minDist) { minDist = distYellow; detectedColor = "JAUNE"; }
  if (distRed < minDist) { minDist = distRed; detectedColor = "ROUGE"; }
  if (distBlue < minDist) { minDist = distBlue; detectedColor = "BLEU"; }
  
  // Vérifier si la meilleure correspondance est dans le seuil
  if (minDist > COLOR_MATCH_THRESHOLD) {
    detectedColor = "INCONNU"; // Aucune couleur n'est suffisamment proche
  }

  return detectedColor;
}

// --- Fonctions de Communication I2C (Arduino Nano Maître) ---
// Adresse I2C de l'ESP32 (arbitraire, doit correspondre à l'ESP32)
const int ESP32_I2C_ADDRESS = 8; 

/**
 * @brief Envoie les données de couleur et les compteurs à l'ESP32 via I2C.
 * @param color Code de la couleur (ex: 'V' pour VERT, 'J' pour JAUNE, etc.).
 * @param gCount Compteur vert.
 * @param yCount Compteur jaune.
 * @param rCount Compteur rouge.
 * @param bCount Compteur bleu.
 */
void sendDataToESP32(char colorCode, int gCount, int yCount, int rCount, int bCount) {
  Wire.beginTransmission(ESP32_I2C_ADDRESS); // Début transmission vers l'ESP32

  // Format d'envoi : [CODE_COULEUR][COMPTEUR_VERT][COMPTEUR_JAUNE][COMPTEUR_ROUGE][COMPTEUR_BLEU]
  // Envoyer des octets individuels. Pour des int, il faut les diviser si > 255.
  // Pour l'instant, on envoie le code couleur et on s'assure qu'ils sont < 255
  Wire.write(colorCode);
  Wire.write((byte)gCount); 
  Wire.write((byte)yCount);
  Wire.write((byte)rCount);
  Wire.write((byte)bCount);
  
  Wire.endTransmission(); // Fin transmission
  Serial.print("I2C: Donnees envoyees: "); Serial.print(colorCode);
  Serial.print(", V:"); Serial.print(gCount); Serial.print(", J:"); Serial.print(yCount);
  Serial.print(", R:"); Serial.print(rCount); Serial.print(", B:"); Serial.println(bCount);
}


// --- Fonction setup() ---
void setup() {
  Serial.begin(9600); // Debug série
  Serial.println("Systeme tri: Demarrage.");

  // Initialisation I2C
  Wire.begin();

  // Initialisation capteur de couleur
  if (!tcs.begin()) {
    Serial.println("Capteur couleur non trouve! Verifier cablage.");
    while (1); // Blocage si capteur non trouve
  }

  // Configuration broches moteur
  pinMode(PIN_MOTOR_ENA, OUTPUT);
  pinMode(PIN_MOTOR_IN1, OUTPUT);
  pinMode(PIN_MOTOR_IN2, OUTPUT);

  // Configuration broches émetteurs laser
  pinMode(PIN_LASER_1_EMITTER, OUTPUT);
  pinMode(PIN_LASER_2_EMITTER, OUTPUT);

  // Activation émetteurs laser
  digitalWrite(PIN_LASER_1_EMITTER, HIGH);
  digitalWrite(PIN_LASER_2_EMITTER, HIGH);

  stopMotor(); // Arrêt moteur initial
  
  calibrateColorSensor(); // Appel calibration couleur
}


// --- Fonction loop() ---
void loop() {
  static unsigned long lastMotorStopMillis = 0; // Temps dernier arret moteur
  static unsigned long colorMeasureStartTime = 0; // Temps debut mesure couleur
  static String lastDetectedColor = ""; // Dernière couleur détectée validée
  static int colorValidationCount = 0; // Compteur de validation couleur

  switch (currentState) {
    case WAITING_FOR_CUBE:
      Serial.println("Etat: Attente cube (Laser 1)");
      if (isLaser1Interrupted()) {
        Serial.println("Cube detecte par Laser 1.");
        controlMotor(motorSpeedPWM, true); // Moteur ON (sens avant)
        lastMotorStopMillis = millis(); // Enregistre l'heure de démarrage pour le délai
        currentState = MOVING_TO_COLOR_SENSOR;
      }
      break;

    case MOVING_TO_COLOR_SENSOR:
      Serial.println("Etat: Mouvement vers capteur couleur.");
      if (millis() - lastMotorStopMillis >= motorRunDuration_Start) {
        stopMotor(); // Arrêt moteur
        Serial.println("Cube positionne sous capteur couleur.");
        colorMeasureStartTime = millis(); // Début attente/mesure
        colorValidationCount = 0; // Réinitialisation compteur validation
        lastDetectedColor = ""; // Réinitialisation couleur detectee
        currentState = MEASURING_COLOR;
      }
      break;

    case MEASURING_COLOR:
      Serial.println("Etat: Mesure couleur.");
      // Attendre 5s avant de commencer la détection
      if (millis() - colorMeasureStartTime < 5000) {
        Serial.println("Attente stabilite capteur couleur...");
        delay(100); // Petite pause pour ne pas surcharger la série
        break; // Continue d'attendre
      }

      String currentColor = identifyColor(); // Lecture couleur
      Serial.print("Couleur lue: "); Serial.println(currentColor);

      if (currentColor != "INCONNU" && currentColor == lastDetectedColor) {
        colorValidationCount++; // Incrémente si même couleur
      } else {
        colorValidationCount = 0; // Réinitialise si couleur différente ou inconnue
        lastDetectedColor = currentColor;
      }

      if (colorValidationCount >= 10) { // 10 validations consécutives
        Serial.print("Couleur Validee: "); Serial.println(lastDetectedColor);
        char colorCodeToSend = 'I'; // Code pour INCONNU par défaut

        if (lastDetectedColor == "VERT") {
          greenCount++;
          colorCodeToSend = 'V';
        } else if (lastDetectedColor == "JAUNE") {
          yellowCount++;
          colorCodeToSend = 'J';
        } else if (lastDetectedColor == "ROUGE") {
          redCount++;
          colorCodeToSend = 'R';
        } else if (lastDetectedColor == "BLEU") {
          blueCount++;
          colorCodeToSend = 'B';
        }
        
        // Envoi des données via I2C à l'ESP32
        sendDataToESP32(colorCodeToSend, greenCount, yellowCount, redCount, blueCount);

        controlMotor(motorSpeedPWM, true); // Moteur ON
        lastMotorStopMillis = millis(); // Enregistre heure démarrage
        currentState = MOVING_TO_COLLECTION_POINT;
      }
      delay(100); // Intervalle entre lectures de couleur (pour la validation 10x)
      break;

    case MOVING_TO_COLLECTION_POINT:
      Serial.println("Etat: Mouvement vers point de collecte.");
      if (isLaser2Interrupted()) { // Détection par le deuxième laser
        stopMotor(); // Arrêt moteur
        Serial.println("Cube atteint point de collecte (Laser 2).");
        Serial.println("Pret pour nouveau cycle.");
        currentState = AT_COLLECTION_POINT;
      }
      break;

    case AT_COLLECTION_POINT:
      Serial.println("Etat: Attente extraction cube.");
      // L'utilisateur retire le cube manuellement.
      // Le système attend une nouvelle détection au Laser 1 pour relancer un cycle.
      if (!isLaser1Interrupted() && !isLaser2Interrupted()) { // S'assurer que les deux lasers sont clairs
        // Une fois le cube retiré, revenir à l'état d'attente
        Serial.println("Cube retire. Redemarrage cycle.");
        currentState = WAITING_FOR_CUBE;
      }
      break;
  }
}

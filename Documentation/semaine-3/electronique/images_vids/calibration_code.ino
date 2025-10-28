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
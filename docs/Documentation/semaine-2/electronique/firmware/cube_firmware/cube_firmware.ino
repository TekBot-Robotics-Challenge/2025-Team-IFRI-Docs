// --- 1. Inclusions des Bibliothèques ---
#include <Wire.h>           // I2C communication
#include <Adafruit_MPU6050.h> // MPU-6050 sensor
#include <Adafruit_Sensor.h>  // Adafruit Sensor dependency
#include <EEPROM.h>         // Non-volatile memory
#include <avr/wdt.h>        // Watchdog Timer (for robust resets)

// --- 2. Définitions Globales et Constantes ---
const int STATION_ADDRESS = 8; // I2C address for Ground Station
Adafruit_MPU6050 mpu;          // MPU-6050 object

// Flight data structure
struct FlightData {
  int16_t roll;                // Roll angle (degrees * 100)
  int16_t pitch;               // Pitch angle (degrees * 100)
  int16_t accel_z;             // Z acceleration (m/s^2 * 100)
  byte status;                 // System status: 0=normal, 1=crash detected
};

// --- EEPROM Parameters ---
const int EEPROM_SIZE = 1024; // ATmega328P EEPROM size
const int EEPROM_BUFFER_START = 0; // Circular buffer start

// EEPROM addresses for crash flag and start address for recovery
const int EEPROM_CRASH_FLAG_ADDR = EEPROM_SIZE - sizeof(bool);
const int EEPROM_CRASH_ADDR_ADDR = EEPROM_SIZE - sizeof(bool) - sizeof(int);

const int EEPROM_BUFFER_EFFECTIVE_SIZE = EEPROM_SIZE - sizeof(bool) - sizeof(int); // Usable EEPROM for buffer
const int MAX_SAMPLES = EEPROM_BUFFER_EFFECTIVE_SIZE / sizeof(FlightData); // Max samples in buffer

int current_eeprom_address = EEPROM_BUFFER_START; // Current write pointer

// --- Crash Detection Parameters ---
volatile bool crash_detected = false; // Flag set on crash
const float CRASH_THRESHOLD_G = 8.0; // Acceleration threshold for crash (in G)

const int MPU_INT_PIN = 2; // ATmega D2 (INT0) connected to MPU-6050 INT pin

// --- MPU-6050 Direct Register Configuration ---
#define MPU6050_ADDRESS           0x68 // MPU-6050 I2C address (AD0 low)
#define MPU6050_RA_INT_PIN_CFG    0x37 // Interrupt Pin Configuration Register
#define MPU6050_RA_INT_ENABLE     0x38 // Interrupt Enable Register

// --- 3. Function Declarations ---
void handleMPUInterrupt();
void handleSerialRecovery();

// --- 4. setup() : Initialization at Startup ---
void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Boite Noire - Demarrage...");

  // --- Post-Crash Reset (Autonomous on Power-Up) ---
  bool crashOccurredPreviously;
  EEPROM.get(EEPROM_CRASH_FLAG_ADDR, crashOccurredPreviously);

  if (crashOccurredPreviously) {
    Serial.println("Crash precedent detecte. Reinitialisation...");
    EEPROM.put(EEPROM_CRASH_FLAG_ADDR, false); // Clear crash flag
    EEPROM.put(EEPROM_CRASH_ADDR_ADDR, EEPROM_BUFFER_START); // Reset EEPROM start address
    Serial.println("Systeme pret pour un nouveau vol.");
  } else {
    Serial.println("Aucun crash precedent. Demarrage normal.");
  }

  // --- I2C Master Initialization ---
  Wire.begin();
  Serial.println("I2C Maître initialise.");

  // --- MPU-6050 Initialization ---
  if (!mpu.begin()) {
    Serial.println("Erreur: Echec d'initialisation du MPU-6050.");
    while (1) delay(10);
  }
  Serial.println("MPU-6050 initialise avec succes.");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);

  // --- MPU-6050 Interrupt Configuration (Direct Registers) ---
  // INT_PIN_CFG (0x37): non-latching, active LOW, push-pull, clear by reading INT_STATUS
  Wire.beginTransmission(MPU6050_ADDRESS);
  Wire.write(MPU6050_RA_INT_PIN_CFG);
  Wire.write(0b00000000);
  Wire.endTransmission(true);

  // INT_ENABLE (0x38): Enable Data Ready Interrupt
  Wire.beginTransmission(MPU6050_ADDRESS);
  Wire.write(MPU6050_RA_INT_ENABLE);
  Wire.write(0b00000001);
  Wire.endTransmission(true);

  attachInterrupt(digitalPinToInterrupt(MPU_INT_PIN), handleMPUInterrupt, FALLING);
  Serial.println("Interruption MPU-6050 configuree.");
}

// --- 5. loop() : Main Program Loop ---
void loop() {
  if (crash_detected) {
    Serial.println("Crash detecte. Enregistrement suspendu.");
    handleSerialRecovery(); // Handle data recovery via serial
    delay(100);
    return;
  }

  // Read MPU data
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Calculate total acceleration magnitude (for crash detection)
  float total_g = sqrt(pow(a.acceleration.x, 2) + pow(a.acceleration.y, 2) + pow(a.acceleration.z, 2)) / SENSORS_GRAVITY_STANDARD;

  // Prepare current flight data
  FlightData current_data;
  current_data.roll = (int16_t)(g.gyro.x * 100);
  current_data.pitch = (int16_t)(g.gyro.y * 100);
  current_data.accel_z = (int16_t)(a.acceleration.z * 100);
  current_data.status = 0; // Normal status

  // --- Crash Detection ---
  if (total_g > CRASH_THRESHOLD_G) {
    crash_detected = true;
    current_data.status = 1; // Set status for ground station
    Serial.print("--- CRASH DETECTE ! Accel totale: ");
    Serial.print(total_g);
    Serial.println(" G ---");

    EEPROM.put(EEPROM_CRASH_FLAG_ADDR, true);          // Store crash flag
    EEPROM.put(EEPROM_CRASH_ADDR_ADDR, current_eeprom_address); // Store crash address
  }

  // --- EEPROM Logging (Circular Buffer) ---
  if (!crash_detected) {
    EEPROM.put(current_eeprom_address, current_data);
    current_eeprom_address += sizeof(FlightData);
    if (current_eeprom_address >= EEPROM_BUFFER_EFFECTIVE_SIZE) {
      current_eeprom_address = EEPROM_BUFFER_START; // Wrap around
    }
  }

  // --- Send Data to Ground Station via I2C ---
  Wire.beginTransmission(STATION_ADDRESS);
  Wire.write((byte*)&current_data, sizeof(FlightData));
  Wire.endTransmission();

  // Debug output
  Serial.print("Roll: "); Serial.print(current_data.roll / 100.0);
  Serial.print(" Pitch: "); Serial.print(current_data.pitch / 100.0);
  Serial.print(" AccelZ: "); Serial.print(current_data.accel_z / 100.0);
  Serial.print(" Status: "); Serial.println(current_data.status);

  delay(50); // ~20 Hz sampling rate
}

// --- 6. MPU Interrupt Handler ---
void handleMPUInterrupt() {
  // Flag handling for data ready is done in loop() for simplicity
  // This function is mainly for triggering the interrupt on MPU's side.
}

// --- 7. Serial Recovery Function ---
void handleSerialRecovery() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command.equals("LIRE_DONNEES_CRASH")) {
      Serial.println("\n--- Debut Recuperation Données Crash ---");
      int stored_crash_address;
      EEPROM.get(EEPROM_CRASH_ADDR_ADDR, stored_crash_address);

      Serial.println("Roll,Pitch,AccelZ"); // CSV header

      int read_address = stored_crash_address;
      for (int i = 0; i < MAX_SAMPLES; ++i) {
        FlightData recovered_data;
        EEPROM.get(read_address, recovered_data);

        Serial.print(recovered_data.roll / 100.0); Serial.print(",");
        Serial.print(recovered_data.pitch / 100.0); Serial.print(",");
        Serial.println(recovered_data.accel_z / 100.0);

        read_address += sizeof(FlightData);
        if (read_address >= EEPROM_BUFFER_EFFECTIVE_SIZE) {
          read_address = EEPROM_BUFFER_START; // Wrap around
        }
        
        if (read_address == stored_crash_address && i > 0) { // Stop if full cycle
            break;
        }
      }
      Serial.println("--- Fin Recuperation Données Crash ---");
    } else {
      Serial.println("Commande inconnue. Envoyez 'LIRE_DONNEES_CRASH'");
    }
  }
}

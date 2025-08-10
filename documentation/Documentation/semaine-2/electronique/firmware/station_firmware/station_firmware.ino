// --- 1. Inclusions ---
#include <Wire.h>           // I2C communication (slave mode)
#include <LiquidCrystal_I2C.h> // LCD via I2C

// --- 2. Constantes Globales ---
const int STATION_ADDRESS = 8; // I2C address for this station (must match Black Box)
const int LCD_I2C_ADDRESS = 0x27; // LCD I2C address (common: 0x27 or 0x3F)
const int LCD_COLUMNS = 16;
const int LCD_ROWS = 2;

LiquidCrystal_I2C lcd(LCD_I2C_ADDRESS, LCD_COLUMNS, LCD_ROWS); // LCD object

// Flight data structure (MUST BE IDENTICAL to Black Box)
struct FlightData {
  int16_t roll;
  int16_t pitch;
  int16_t accel_z;
  byte status; // 0=normal, 1=crash
};

FlightData received_data;          // Store last received data
volatile bool new_data_available = false; // Flag for new I2C data

// --- 3. Déclarations de Fonctions ---
void receiveEvent(int numBytes); // I2C receive callback

// --- 4. Fonction setup() : Initialisation ---
void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Station de Controle - Demarrage...");

  Wire.begin(STATION_ADDRESS);    // Initialize I2C as slave
  Wire.onReceive(receiveEvent);   // Attach receive callback
  Serial.print("I2C Esclave initialise sur l'adresse: ");
  Serial.println(STATION_ADDRESS);

  // --- Initialisation de l'écran LCD ---
  // Remplacement du bloc 'if (lcd.isInitialized())'
  lcd.init(); // Init LCD
  lcd.backlight(); // Turn on backlight
  lcd.clear();     // Clear display
  lcd.print("Station OK"); // Print message
  Serial.println("LCD initialise."); // Confirm via serial
  delay(2000); // Display for 2 seconds
  // Si le LCD ne s'initialise pas (mauvaise adresse, mauvais câblage),
  // il n'affichera rien, mais le programme continuera.
}

// --- 5. loop() : Boucle Principale ---
void loop() {
  if (new_data_available) {
    new_data_available = false; // Reset flag

    lcd.clear();

    if (received_data.status == 1) { // Crash detected
      lcd.setCursor(0, 0);
      lcd.print("!!! CRASH !!!");
      lcd.setCursor(0, 1);
      lcd.print("DONNEES GELEES");
    } else { // Normal flight
      lcd.setCursor(0, 0);
      lcd.print("R:"); lcd.print(received_data.roll / 100.0, 1);
      lcd.print(" P:"); lcd.print(received_data.pitch / 100.0, 1);

      lcd.setCursor(0, 1);
      lcd.print("AccelZ:"); lcd.print(received_data.accel_z / 100.0, 1);
    }
  }
}

// --- 6. receiveEvent() : Gestionnaire de Réception I2C ---
void receiveEvent(int numBytes) {
  if (numBytes == sizeof(FlightData)) {
    Wire.readBytes((byte*)&received_data, sizeof(FlightData)); // Read directly into struct
    new_data_available = true; // Signal new data
  } else {
    Serial.print("Erreur I2C: Taille inattendue. Recu: ");
    Serial.print(numBytes);
    Serial.print(" Attendu: ");
    Serial.println(sizeof(FlightData));
    while(Wire.available()) Wire.read(); // Clear buffer on error
  }
}

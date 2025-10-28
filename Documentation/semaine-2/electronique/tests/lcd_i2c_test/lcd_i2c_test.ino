// Test LCD I2C
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const int LCD_I2C_ADDRESS = 0x27;
const int LCD_COLUMNS = 16;
const int LCD_ROWS = 2;

LiquidCrystal_I2C lcd(LCD_I2C_ADDRESS, LCD_COLUMNS, LCD_ROWS);

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Test LCD I2C");

  lcd.init();      // Initialise l'écran
  lcd.backlight(); // Allume le retroeclairage

  // Affichez un message de test
  lcd.setCursor(0, 0); // Colonne 0, Ligne 0
  lcd.print("LCD Test OK!");
  lcd.setCursor(0, 1); // Colonne 0, Ligne 1
  lcd.print("Bonjour Monde!");

  Serial.println("Message affiche sur LCD.");
}

void loop() {
  // Rien a faire dans la boucle, le message est statique
}

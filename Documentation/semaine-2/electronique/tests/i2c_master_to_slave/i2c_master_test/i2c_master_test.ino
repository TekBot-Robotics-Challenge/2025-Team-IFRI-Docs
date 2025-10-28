// Test I2C - MAITRE
#include <Wire.h>

const int SLAVE_ADDRESS = 8; // Adresse de l'esclave (doit correspondre)

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("I2C Maitre - Demarrage");
  Wire.begin(); // Initialise I2C en mode Maitre
}

void loop() {
  Serial.println("Envoi du message a l'esclave...");
  Wire.beginTransmission(SLAVE_ADDRESS); // Demarre transmission a l'esclave
  Wire.write("Hello Esclave!");         // Envoie la chaine de caracteres
  Wire.endTransmission();               // Termine transmission

  delay(1000); // Envoie toutes les secondes
}

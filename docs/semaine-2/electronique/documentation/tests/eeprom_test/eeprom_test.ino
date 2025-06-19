// Test EEPROM
#include <EEPROM.h>

const int EEPROM_ADDRESS = 0; // Adresse a laquelle ecrire/lire dans l'EEPROM

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Test EEPROM");

  int testValue = 123;
  int readValue;

  Serial.print("Ecriture de la valeur ");
  Serial.print(testValue);
  Serial.print(" a l'adresse ");
  Serial.print(EEPROM_ADDRESS);
  Serial.println("...");
  EEPROM.put(EEPROM_ADDRESS, testValue); // Ecrit la valeur

  // Petit delai pour s'assurer que l'ecriture est finie (non toujours necessaire)
  delay(100);

  Serial.print("Lecture de la valeur a l'adresse ");
  Serial.print(EEPROM_ADDRESS);
  Serial.println("...");
  EEPROM.get(EEPROM_ADDRESS, readValue); // Lit la valeur

  Serial.print("Valeur lue: ");
  Serial.println(readValue);

  if (readValue == testValue) {
    Serial.println("Test EEPROM REUSSI!");
  } else {
    Serial.println("Test EEPROM ECHOUÉ!");
  }
}

void loop() {
  // Rien a faire dans la boucle
}

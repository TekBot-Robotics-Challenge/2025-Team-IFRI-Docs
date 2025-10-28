// Test I2C - ESCLAVE
#include <Wire.h>

const int MY_ADDRESS = 8; // Adresse de cet esclave (doit correspondre au Maitre)

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("I2C Esclave - Demarrage");
  Wire.begin(MY_ADDRESS);      // Initialise I2C en mode Esclave avec son adresse
  Wire.onReceive(receiveEvent); // Attache la fonction de rappel a la reception
}

void loop() {
  // La boucle est vide car la reception est gerée par receiveEvent()
}

// Fonction de rappel appelée lors de la reception de données I2C
void receiveEvent(int numBytes) {
  String receivedMessage = "";
  while (Wire.available()) { // Lit tous les octets disponibles
    char c = Wire.read();    // Recupere un octet
    receivedMessage += c;    // Ajoute a la chaine
  }
  Serial.print("Message recu du Maitre: ");
  Serial.println(receivedMessage);
}

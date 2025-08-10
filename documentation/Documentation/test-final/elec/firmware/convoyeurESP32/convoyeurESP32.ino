// --- Bibliothèques ---
#include <Wire.h>     // I2C communication
#include <WiFi.h>     // Wi-Fi connectivity
#include <WebServer.h> // Web Server

// --- Paramètres Wi-Fi ---
const char* ssid = "VOTRE_NOM_WIFI";       // Wi-Fi network name
const char* password = "VOTRE_MOT_DE_PASSE"; //  Wi-Fi password

// --- Paramètres I2C ---
const int ESP32_I2C_ADDRESS = 8; // I2C slave address

// --- Variables de Comptage (Volatile pour accès inter-interruptions) ---
volatile int greenCount = 0;
volatile int yellowCount = 0;
volatile int redCount = 0;
volatile int blueCount = 0;
volatile char lastDetectedColorCode = 'I'; // 'V', 'J', 'R', 'B', 'I'

// --- Instance du Serveur Web ---
WebServer server(80); // Server listens on port 80

// --- Fonctions de Traitement I2C ---
void receiveEvent(int byteCount) {
  if (byteCount >= 5) { // Ensure full packet received
    lastDetectedColorCode = (char)Wire.read();
    greenCount = Wire.read();
    yellowCount = Wire.read();
    redCount = Wire.read();
    blueCount = Wire.read();
  }
  while(Wire.available()) { Wire.read(); } // Clear buffer
}

// --- Fonctions de Gestion du Serveur Web ---
void handleData() {
  String json = "{";
  json += "\"green\":" + String(greenCount);
  json += ",\"yellow\":" + String(yellowCount);
  json += ",\"red\":" + String(redCount);
  json += ",\"blue\":" + String(blueCount);
  
  String lastColorName;
  switch(lastDetectedColorCode) {
    case 'V': lastColorName = "VERT"; break;
    case 'J': lastColorName = "JAUNE"; break;
    case 'R': lastColorName = "ROUGE"; break;
    case 'B': lastColorName = "BLEU"; break;
    default: lastColorName = "INCONNU"; break;
  }
  json += ",\"lastColor\":\"" + lastColorName + "\"";
  json += "}";

  server.send(200, "application/json", json);
}

// --- Fonction setup() ---
void setup() {
  Serial.begin(115200); // Serial debug
  Serial.println("\nESP32 starting...");

  // I2C slave init
  Wire.begin(ESP32_I2C_ADDRESS);
  Wire.onReceive(receiveEvent); // I2C receive callback

  // Wi-Fi connection
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  int maxAttempts = 20; // 10 seconds timeout
  while (WiFi.status() != WL_CONNECTED && maxAttempts > 0) {
    delay(500);
    Serial.print(".");
    maxAttempts--;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    // Web server API endpoint
    server.on("/data", handleData); 

    server.begin(); // Start web server
    Serial.println("HTTP Server started.");
  } else {
    Serial.println("\nWiFi connection failed. Check SSID/Password.");
    Serial.println("Restarting in 5s...");
    delay(5000);
    ESP.restart(); // Restart on failure
  }
}

// --- Fonction loop() ---
void loop() {
  server.handleClient(); // Handle web client requests
  delay(2); // Stability pause
}

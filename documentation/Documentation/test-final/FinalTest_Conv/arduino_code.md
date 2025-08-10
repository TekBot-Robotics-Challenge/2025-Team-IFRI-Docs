# Documentation du Projet Convoyeur Intelligent

## 1. Vue d'ensemble

Ce projet contrôle un système de convoyeur capable de détecter la couleur d'un objet et de communiquer cette information à un backend distant. Le code a été scindé en deux applications distinctes pour répartir les tâches entre un Arduino Nano et un ESP32, communiquant via le protocole I2C.

Ce document décrit les trois principaux fichiers de code du projet :
- `src/main.cpp` : Le code original pour les testes rapoides (sans I2C car mon ordinateur n'aq que un port usb)
- `src/arduino_nano_master.cpp` : Le nouveau code pour l'Arduino Nano (Maître I2C).
- `src/esp32_slave.cpp` : Le nouveau code pour l'ESP32 (Esclave I2C).

---

## 2. Description des Fichiers de Code

### a. `src/main.cpp` (Code Original)

- **Rôle** : Ce fichier contient la logique complète et originale du projet. Il gère à la fois la détection de couleur avec le capteur TCS34725, la gestion des capteurs LDR, le contrôle du moteur, la connexion WiFi et l'envoi des données au serveur web.
- **Microcontrôleur Cible** : ESP32 Dev Kit V1.
- **Principe** : Bien que fonctionnel, ce code centralise toutes les tâches sur un seul microcontrôleur. Il sert maintenant de référence ou de version de base pour un fonctionnement sur un unique ESP32.
- **Dépendances** : `Adafruit_TCS34725`, `WiFi`, `HTTPClient`.

### b. `src/arduino_nano_master.cpp` (Nouveau - Maître I2C)

- **Rôle** : Ce code est dédié à la détection de couleur. Il est responsable de l'initialisation du capteur TCS34725, de la calibration des couleurs, de l'identification (Rouge, Vert, Bleu, Jaune) et de la transmission d'un identifiant simple (un seul caractère) à l'ESP32 via le bus I2C.
- **Microcontrôleur Cible** : Arduino Nano.
- **Logique de fonctionnement** :
  1.  Au démarrage, il initialise le capteur de couleur et le bus I2C en mode "Maître".
  2.  Il propose une phase de calibration des couleurs via le moniteur série.
  3.  En boucle, il lit les données du capteur.
  4.  Il identifie si la couleur correspond à l'une des références (Rouge, Vert, Bleu, Jaune).
  5.  Si une couleur pertinente est détectée, il envoie un caractère correspondant à l'ESP32 (`'R'`, `'V'`, `'B'`, `'J'`).
- **Dépendances** : `Adafruit_TCS34725`, `Wire`.

### c. `src/esp32_slave.cpp` (Nouveau - Esclave I2C)

- **Rôle** : Ce code gère la communication. Il reçoit les données de l'Arduino Nano, se connecte au réseau WiFi et envoie les informations de couleur au backend.
- **Microcontrôleur Cible** : ESP32 Dev Kit V1.
- **Logique de fonctionnement** :
  1.  Au démarrage, il initialise la connexion WiFi et le bus I2C en mode "Esclave" avec une adresse fixe.
  2.  Il attend passivement les données envoyées par l'Arduino Nano.
  3.  Lorsqu'un caractère est reçu via I2C, une fonction d'interruption le stocke dans une variable.
  4.  La boucle principale vérifie si une nouvelle donnée a été reçue.
  5.  Si oui, elle traduit le caractère en nom de couleur complet (ex: 'R' -> "Rouge").
  6.  Elle envoie ensuite ce nom au serveur distant via une requête HTTP POST au format JSON.
- **Dépendances** : `WiFi`, `HTTPClient`, `Wire`.

---

## 3. Guide d'Utilisation du Système Séparé

### a. Connexions Matérielles (I2C)

Pour que les deux cartes communiquent, vous devez les relier via le bus I2C :

- **SDA (Serial Data)** : Reliez la broche `A4` de l'Arduino Nano à la broche `GPIO 21` (SDA) de l'ESP32.
- **SCL (Serial Clock)** : Reliez la broche `A5` de l'Arduino Nano à la broche `GPIO 22` (SCL) de l'ESP32.
- **GND (Masse)** : Reliez une broche `GND` de l'Arduino Nano à une broche `GND` de l'ESP32 pour assurer une référence de tension commune.

*N'oubliez pas de brancher le capteur de couleur TCS34725 à l'Arduino Nano.* 

### b. Configuration du Projet (platformio.ini)

Le fichier `platformio.ini` est maintenant configuré avec deux environnements distincts :

- `[env:esp32_slave]` : Pour l'ESP32.
- `[env:arduino_nano_master]` : Pour l'Arduino Nano.

**Actions requises :**
1.  **WiFi** : Dans `src/esp32_slave.cpp`, remplacez `"VOTRE_SSID_WIFI"` et `"VOTRE_MOT_DE_PASSE_WIFI"` par vos identifiants de connexion.
2.  **Ports Série** : Dans `platformio.ini`, vérifiez que les `upload_port` et `monitor_port` correspondent aux ports série de vos cartes. J'ai mis `/dev/ttyUSB0` pour l'ESP32 et `/dev/ttyUSB1` pour le Nano, mais cela peut varier sur votre système.

### c. Compilation et Téléversement

Vous pouvez utiliser l'interface de PlatformIO dans VSCode pour choisir l'environnement à compiler et à téléverser, ou utiliser le terminal :

- **Pour l'ESP32** :
  ```bash
  pio run -e esp32_slave --target upload
  ```

- **Pour l'Arduino Nano** :
  ```bash
  pio run -e arduino_nano_master --target upload
  ```

Une fois les deux codes téléversés, vous pouvez ouvrir deux moniteurs série (un pour chaque port) pour observer les logs de chaque carte et vérifier leur bon fonctionnement.


<iframe width="560" height="315" src="https://www.youtube.com/embed/nkq-DGI4sTo?si=BcFLYtN7oNogi4go" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>




<iframe width="560" height="315" src="https://www.youtube.com/embed/zXMRKMIum10?si=mJmQTG8b7E_M-XHL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



https://github.com/hantanHugues/esp_convoyeur_platrformIO
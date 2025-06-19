# BlackBox & Control Station - IFRI
## Data Reliability, Flight Resilience.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Arduino IDE](https://img.shields.io/badge/Arduino_IDE-1.8.19-blue.svg)](https://www.arduino.cc/en/software)
[![Platform](https://img.shields.io/badge/Platform-ATmega328P-green.svg)](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf)
[![Challenge](https://img.shields.io/badge/Tekbot_Challenge-2K25_Resilience-orange.svg)](documentation/trc2k25_infos/8bce113404fdd225ce17eafe8fa12a15.pdf)

---

### 1. Project Introduction

This project, developed as part of the **Electronic Test 2** for the **Tekbot Robotics Challenge 2K25 - RESILIENCE**, presents an innovative embedded system comprised of a **BlackBox** and a **Control Station**. The primary objective is to demonstrate expertise in embedded electronics, inter-system communication via I2C, and critical data management. The system is designed to record essential flight parameters of a "vehicle" (here simulated by an MPU-6050) and detect crash situations, while offering a ground-based monitoring and data retrieval interface. This project underscores our commitment to **data reliability** and **flight system resilience**.

---

### 2. Repository Structure

```
Test2_BlackBox
├── documentation/
│   ├── hardware.md
│   ├── software_firmware.md
│   ├── assembly_configuration.md
│   ├── results_demonstration.md
│   ├── possible_improvements.md
│   └── troubleshooting.md
├── doc/
│   ├── images/
│   │   └── ... (image files)
│   └── trc2k25_infos/
│       └── 8bce113404fdd225ce17eafe8fa12a15.pdf
├── docs/ (for GitHub Pages, if enabled)
│   ├── images/
│   │   └── ... (image files)
│   ├── index.html
│   ├── script.js
│   └── style.css
├── firmware/
│   ├── cube_firmware/
│   │   └── cube_firmware.ino
│   ├── downloaded_libraries/
│   │   └── ... (libraries)
│   └── station_firmware/
│       └── station_firmware.ino
├── hardware/
│   ├── alim/
│   │   └── ... (KiCad files)
│   ├── cube_pcb/
│   │   └── ... (PCB files)
│   ├── IFRI_Test2_PCBs/
│   │   └── ... (PCB files)
│   └── station_pcb/
│       └── ... (PCB files)
├── LICENSE
├── README.md
├── tests/
│   ├── eeprom_test/
│   │   └── eeprom_test.ino
│   ├── i2c_master_to_slave/
│   │   └── ... (I2C tests)
│   ├── lcd_i2c_test/
│   │   └── lcd_i2c_test.ino
│   ├── mpu6050_test/
│   │   └── mpu6050_test.ino
│   └── results/
│       └── ... (test results)
└── tools/
├── hardwares.txt
└── softwares.txt
```

---

### 3. Key Features

This modular system offers the following capabilities:

* **Flight Data Recording**: Real-time acquisition of acceleration (Z-axis) and orientation (Roll, Pitch) data via the MPU-6050 sensor on the BlackBox.
* **Intelligent Crash Detection**: Onboard algorithm on the BlackBox to detect a significant impact and freeze the last essential data.
* **Non-Volatile Storage**: Saving critical data (crash status, last flight values) in the BlackBox's EEPROM memory, ensuring persistence even after power loss.
* **Bidirectional I2C Communication**: Real-time transmission of flight data from the BlackBox (Master) to the Control Station (Slave).
* **Real-time Display**: Clear presentation of flight data on a dedicated LCD screen on the Control Station.
* **Visual Crash Indication**: Display of a distinct alert message on the Control Station's screen upon impact detection.
* **Data Recovery Interface**: Ability to read recorded post-crash data from the BlackBox via a serial interface.

---

### 4. System Architecture

The system is designed around two main modules, actively communicating to ensure monitoring and data retrieval:

#### The BlackBox (Flight Recorder Unit)

* **Role**: Autonomous unit responsible for flight data collection, crash detection, and storage.
* **Key Components**:
    * ATmega328P Microcontroller.
    * MPU-6050 sensor (accelerometer and gyroscope).
    * EEPROM memory integrated into the microcontroller for non-volatile storage.
* **Operation**: Continuously reads data from the MPU-6050, calculates angles and vertical acceleration. An algorithm checks for crash conditions. In case of a crash, the last significant data is frozen and saved. It acts as an I2C master to send data to the Control Station.

#### The Control Station (Ground Monitoring Station)

* **Role**: Ground interface for real-time visualization and monitoring of system status.
* **Key Components**:
    * ATmega328P Microcontroller.
    * I2C LCD screen (16x2).
* **Operation**: Receives flight data from the BlackBox via I2C (as a slave). Dynamically displays flight parameters and switches to a "CRASH DETECTED" display in case of an incident reported by the BlackBox.

#### Inter-Module Communication (I2C)

Communication between the BlackBox and the Control Station is established via the I2C (Inter-Integrated Circuit) protocol.
* **BlackBox (Master)**: Initiates data transfers and periodically sends the `FlightData` structure.
* **Control Station (Slave)**: Passively listens on the I2C bus and receives data packets, updating its display accordingly.
This architecture ensures efficient communication with a minimum of wires, ideal for embedded systems.

---

### 5. Operation and Usage

Once assembled and the firmwares uploaded to each module, your "BlackBox & Control Station" system is ready for operation.

#### 1. System Startup

1.  **Power both modules** (BlackBox and Control Station) simultaneously or sequentially. The grounds (GND) of both modules must be interconnected.
2.  The **Control Station** will briefly display "Station OK" on the LCD screen, then enter data waiting mode.
3.  The **BlackBox** will initialize the MPU-6050 and begin acquiring data. If a crash was previously detected and recorded, the BlackBox will automatically reset the crash status in the EEPROM, preparing the system for a new flight. Startup messages are visible on the serial monitor if connected.

#### 2. Normal Operation Mode

In normal operation mode, the BlackBox continuously acquires orientation and acceleration data from the MPU-6050 and sends it to the Control Station.

* **Control Station Display**: The LCD screen of the Control Station will display real-time Roll (R:), Pitch (P:), and Z-axis Acceleration (AccelZ:) angles measured by the BlackBox. These values should change according to the BlackBox's movements.

    ![Normal Operation](doc/images/normal_operation_gif_placeholder.gif)

#### 3. Crash Detection

The system is designed to detect a significant impact, simulating a crash, based on the MPU-6050's acceleration data.

* **Trigger**: When the total acceleration exceeds a predefined threshold (`CRASH_THRESHOLD_G` in the BlackBox firmware, currently 8G), the BlackBox detects a crash.
* **BlackBox Behavior**:
    * The crash flag is activated.
    * The last relevant flight data is frozen and permanently stored in the EEPROM memory.
    * The BlackBox stops recording new flight data and enters a recovery mode, awaiting potential commands via the serial port.
* **Control Station Behavior**:
    * As soon as it receives the crash status from the BlackBox, the LCD screen switches to display a clear alert message: "!!! CRASH !!!" on the first line and "DATA FROZEN" on the second.

    ![Crash Detection](doc/images/crash_detection_gif_placeholder.gif)

#### 4. Post-Crash Data Recovery

After a crash, crucial data is stored in the BlackBox's EEPROM. It can be recovered via a serial connection.

1.  **Connect the BlackBox** to your computer via the USB-to-Serial adapter (or Arduino Uno USB cable).
2.  **Open the Serial Monitor** in the Arduino IDE (or a serial terminal of your choice), ensuring the baud rate is set to `9600`.
3.  **Send the exact command**: `READ_CRASH_DATA` (followed by a carriage return; ensure "Newline" is selected in the serial monitor options).
4.  The BlackBox will respond by displaying the recorded data (Roll, Pitch, AccelZ) in CSV format, allowing for further analysis.

    ![Data Recovery](doc/images/data_recovery_screenshot_placeholder.png)

---

### 6. Detailed Documentation

For an in-depth exploration of the various aspects of this project, please consult the following documents:

* **Hardware Used**: [documentation/hardware.md](documentation/hardware.md)
* **Software (Firmware)**: [documentation/software_firmware.md](documentation/software_firmware.md)
* **Assembly and Configuration Guide**: [documentation/assembly_configuration.md](documentation/assembly_configuration.md)
* **Full Results and Demonstration**: [documentation/results_demonstration.md](documentation/results_demonstration.md)
* **Possible Improvements**: [documentation/possible_improvements.md](documentation/possible_improvements.md)
* **Troubleshooting (FAQ)**: [documentation/troubleshooting.md](documentation/troubleshooting.md)

---

### 7. Full System Demonstration

The most compelling elements are the visuals of the system in action. The images and videos below illustrate the behavior of the "BlackBox & Control Station" in its various states.

* **Normal Mode Demonstration**:
    * Visualize the dynamic display of roll, pitch, and Z-axis acceleration data on the Control Station screen based on the BlackBox's movements.
    ![Normal Operation](doc/images/normal_operation_gif_placeholder.gif)
* **Crash Detection Demonstration**:
    * Observe the Control Station display's transition to "!!! CRASH !!!" mode upon impact detection.
    ![Crash Detection](doc/images/crash_detection_gif_placeholder.gif)
* **Post-Crash Data Recovery Demonstration**:
    * Illustration of the connection procedure and command sending to retrieve essential data stored in the EEPROM via the serial monitor.
    ![Data Recovery](doc/images/data_recovery_screenshot_placeholder.png)

**Note**: For a complete and interactive demonstration, please refer to the project's presentation video (link below).

**[YouTube / Vimeo Demo Video Link]**

---

### 8. Difficultés Rencontrées

Ce projet, bien que mené à bien, n'a pas été sans embûches. Plusieurs défis ont dû être surmontés :

* **Contraintes de Temps :** La période de développement a été particulièrement intense, avec des compositions (examens) pour la plupart des membres de l'équipe. Les délais initiaux ont été difficiles à respecter.
* **Prise en Main du Logiciel :** L'apprentissage des outils de conception, notamment KiCad, a nécessité un temps considérable, impactant l'avancement global.
* **Incompatibilité des Caractéristiques PCB :** Les spécifications des PCBs conçus sur logiciel se sont révélées incompatibles avec les capacités de la machine d'impression disponible, nécessitant des ajustements et des compromis.
* **Insuffisance des Fonds :** Le budget alloué au projet s'est avéré insuffisant pour l'acquisition de tous les composants nécessaires, limitant certaines fonctionnalités ou nécessitant des solutions alternatives.
* **Disponibilité des Composants :** Certains composants essentiels n'étaient pas disponibles dans les points de vente locaux, entraînant des retards et des modifications dans la conception.

---

### 9. Conclusion

The "BlackBox & Control Station - IFRI" system represents a complete and robust solution for critical data acquisition, monitoring, and recovery in an embedded environment. Developed rigorously for the **Tekbot Robotics Challenge 2K25 - RESILIENCE**, it demonstrates our expertise in electronics, embedded programming, and inter-system communication. We hope this project will serve as a solid foundation for future explorations and innovations in the field of robotics and embedded systems.

---

### 10. License

This project is distributed under the MIT License. The terms of this license permit the use, modification, and distribution of the code.

For more details, consult the [`LICENSE`](LICENSE) file at the root of this repository.
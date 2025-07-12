Of course. Here is the faithful English translation of the documentation you provided. All structure, file paths, and image links have been preserved exactly as in the original.

---
---

# 📝 Documentation - Final Test: Control System for a Sorting Conveyor

**Team: IFRI Electronics**
* Aretha FAGLA
* Hugues ANTAN
* Marielle AGBOSSOUNON
* Eunice ODJO
* Livingstone GBOZO

**Institution:** Institute of Training and Research in Computer Science (IFRI), University of Abomey-Calavi
**Date:** June 26, 2025

## 📋 Table of Contents

1. [Context & Objectives](#1-context--objectives)  
2. [Specifications & Deliverables](#2-specifications--deliverables)  
3. [Process & Workflow](#3-process--workflow)  
4. [Tasks & Milestones](#4-tasks--milestones)  
5. [Testing & Validation](#5-testing--validation)  
6. [Project Files](#6-project-files)  
7. [Results Showcase](#7-results-showcase)
8. [Resources & References](#8-resources--references)  
9. [Technical Appendix (In-Depth Details)](#9-technical-appendix-in-depth-details)
10. [Conclusion](#10-conclusion)

---

## 1. Context & Objectives
<a name="1-context--objectifs"></a>

**Final Test – Control System for a Sorting Conveyor**  
This final test of the **TEKBOT Robotics Challenge 2025** is a multidisciplinary synthesis event. Our role, as the electronics team, is to design and build the "brain" and "nervous system" of an automated sorting conveyor.

The project consists of developing a complete electronic system capable of driving a conveyor to sort objects (30mm cubes) based on their color (Green, Yellow, Red, Blue) and providing the sorting data in real-time to a web API.

**Specific Objectives of the Electronics Team:**
- **Develop a robust electronic architecture** on a PCB (KiCad) driving the sensors (presence, color) and an actuator (motor).
- **Implement inter-microcontroller communication** (I²C between an ATmega328P and an ESP32) to separate the real-time control logic from network connectivity.
- **Develop structured embedded firmwares** (state machine) to autonomously orchestrate the entire sorting process.
- **Provide a "turnkey" electronic solution**, tested and validated, ready to be interfaced with the conveyor's chassis and the web interface.

---

## 2. Specifications & Deliverables
<a name="2-specifications--deliverables"></a>

- **Microcontrollers**: Arduino Nano (ATmega328P) for control, ESP32 for connectivity.
- **Communication Protocol**: I²C (inter-MCU), Wi-Fi (to the network).
- **Technologies**: KiCad 7, Arduino IDE, I²C.

**Deliverables of the Electronics Team:**  
<table>
  <thead>
    <tr><th>Deliverable</th><th>Format</th><th>File Path</th></tr>
  </thead>
  <tbody>
    <tr><td>Final Electronic Schematic</td><td><code>.kicad_sch</code></td><td><code>/elec/schematics/FinalTest_NanoEsp.kicad_sch</code></td></tr>
    <tr><td>Final PCB Design</td><td><code>.kicad_pcb</code></td><td><code>/elec/pcb/FinalTest_NanoEsp.kicad_pcb</code></td></tr>
    <tr><td>Controller Firmware (Arduino Nano)</td><td><code>.ino</code></td><td><code>/firmware/convoyeurArduino/</code></td></tr>
    <tr><td>Web API Firmware (ESP32)</td><td><code>.ino</code></td><td><code>/firmware/convoyeurESP32/</code></td></tr>
  </tbody>
</table>

---

## 3. Process & Workflow
<a name="3-process--workflow"></a>

Our project followed a structured engineering approach:

1.  **Design Phase**: Iterative design of the circuit in KiCad (see Appendix B), moving from UART to I2C with an optimized logic level shifter solution to ensure reliability. Definition of the software architecture (state machine on Nano, REST API on ESP32) and the communication protocol.
2.  **Parallel and Modular Development**: Development of the Nano and ESP32 firmwares. Prototyping and unit testing of each subsystem (color detection, motor control, web API).
3.  **Assembly and Integration**: Assembly of electronic components on a prototype board, and wiring of peripherals (sensors, motor driver).
4.  **Calibration and Integration Testing**: Fine-tuning of sensors (color, presence) and adjustment of the state machine parameters for optimal performance.
5.  **End-to-End Validation**: Testing the complete electronic system to validate the chain, from the presence sensor signal to providing data on the web API.

---

## 4. Tasks & Milestones
<a name="4-tasks--milestones"></a>

<table>
  <thead>
    <tr><th>Milestone</th><th>Lead(s)</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Schematics & PCB Design (KiCad)</td><td>Livingstone GBOZO & Eunice ODJO</td><td>✅ Completed</td></tr>
    <tr><td>Firmware Development (Nano & ESP32)</td><td>Hugues HANTAN & Livingstone GBOZO</td><td>✅ Completed</td></tr>
    <tr><td>Physical Assembly & Wiring</td><td>Aretha FAGLA, Marielle AGBOSSOUNON & Hugues HANTAN</td><td>✅ Completed</td></tr>
    <tr><td>Testing & Calibration</td><td>Hugues HANTAN, Eunice ODJO & Livingstone GBOZO</td><td>✅ Completed</td></tr>
  </tbody>
</table>

---

## 5. Testing & Validation
<a name="5-testing--validation"></a>

The system was validated through a series of functional tests.

<table>
  <thead>
    <tr><th>Test</th><th>Objective</th><th>Validation Criterion</th><th>Result</th></tr>
  </thead>
  <tbody>
    <tr><td>Presence Detection</td><td>Process sensor signals to command the motor.</td><td>The motor is commanded to start when laser 1 is interrupted and to stop when laser 2 is interrupted.</td><td>✅ Pass</td></tr>
    <tr><td>Color Identification</td><td>Correctly identify the 4 colors.</td><td>The system identifies the cube's color with >95% accuracy after calibration.</td><td>✅ Pass</td></tr>
    <tr><td>I²C Communication</td><td>Transmit data from the Nano to the ESP32 without errors.</td><td>The ESP32 correctly receives and interprets the color and counter data.</td><td>✅ Pass</td></tr>
    <tr><td>Web API Validation</td><td>Provide sorting data via an HTTP API.</td><td>The <code>/data</code> API endpoint on the ESP32 returns a valid JSON object with the correct information.</td><td>✅ Pass</td></tr>
    <tr><td>Complete Sorting Cycle</td><td>Execute a logical sorting cycle from end to end autonomously.</td><td>A simulated cube at the entrance triggers the detection, transport, and identification cycle, and the data is made available on the API.</td><td>✅ Pass</td></tr>
  </tbody>
</table>

---

## 6. Project Files
<a name="6-project-files"></a>

All source files for our project (Electronics, Firmware) are organized and available in the corresponding folders of the repository.

---

## 7. Results Showcase
<a name="7-results-showcase"></a>

### 7.1 Electronic Design (KiCad)

The circuit was designed in KiCad and integrates all components on a single PCB for optimal robustness and organization. The design evolution is detailed in Appendix B.

| Final Electronic Schematic (V3) | Final PCB (V3) |
| :---: | :---: |
| ![Final KiCad Schematic](elec/media/Schema-V3-I2C-BSS.png) | ![Final KiCad PCB](elec/media/PCB-V3-I2C-BSS.png) |
| *Figure 1: Final electrical schematic with I2C and a logic level shifter.* | *Figure 2: Final PCB layout.* |

 ![Final 3D PCB View](elec/media/3D-V3-I2C-BSS.png)
 *Figure 3: Final PCB with I2C and a logic level shifter. 3D view.*

### 7.2 Prototype and Functional Demonstration

The electronic system was assembled for validation. The video and images below present a complete sorting cycle and tests of key functionalities.

`[Placeholder for the final demonstration video]`

| Electronic Prototype | Test 1: Presence Detection | Test 2: Color Identification |
| :---: | :---: | :---: |
| ![Photo of the assembled prototype](elec/media/prototype_convoyeur_photo.png) | `[Placeholder image/gif of the cube interrupting the beam]` | `[Placeholder image/gif of the cube under the color sensor]` |
| *Figure 4: The assembled and wired control system.* | *Figure 5: Laser 1 detects a cube, and the firmware commands the motor.* | *Figure 6: The system identifies a Red cube.* |

---

## 8. Resources & References
<a name="8-resources--references"></a>
*   **Datasheets**: ATmega328P, ESP32, TCS34725 (GY-33), L298N, BSS138.
*   **Software**: KiCad 7, Arduino IDE.
*   **Platforms**: GitHub.

---

## 9. Technical Appendix (In-Depth Details)
<a name="9-annexes-techniques-détails"></a>

<details>
<summary><strong>Click to expand: Appendix A - Hardware and Schematics - The Evolution of our Electronic Design</strong></summary>

#### 1.1. General Architecture of the Electronic System
The electronic architecture of the conveyor system is designed to ensure the complete automation of the waste sorting process. It integrates presence detection, color identification, motor control, and wireless communication capabilities for real-time monitoring via a web interface.

The main functional blocks of our electronic system are:
- Power Supply: Converts the battery's energy into the stable voltages required by the various components.
- Microcontrollers: An Arduino Nano (ATmega328P) and ESP32 duo for logic processing, peripheral control, and network connectivity.
- Sensors: Laser modules for presence detection and a color sensor for identifying waste.
- Actuator: A motor driver controlling the conveyor's DC motor.
- Inter-Microcontroller Communication: A secure I2C link between the Arduino Nano and the ESP32.

#### 1.2. Components and Detailed Operation

##### 1.2.1. Main Processing Unit (Arduino Nano - ATmega328P)
The Arduino Nano, based on the ATmega328P microcontroller, is the logical core of the sorting system. It is responsible for acquiring data from the presence sensors (lasers/photoresistors) and the color sensor. It implements the control algorithm for the conveyor motor, triggering its movement based on waste detection and stopping it for identification. Furthermore, the Arduino Nano acts as the master on the I2C bus, initiating communication and transmitting sorting data (color, counters) to the ESP32.

The choice of the Arduino Nano is perfectly aligned with the project requirements, which specify the use of an ATmega328P microcontroller or an Arduino Nano board, thus avoiding any scoring penalties. Its compactness, ease of programming via the Arduino IDE, and the vast support from its community make it a robust and efficient platform for rapid embedded project development.

Key pins used on the Arduino Nano include digital pins for interfacing with the laser modules and the L298N motor driver, analog pins for photoresistor readings, and pins A4 (SDA) and A5 (SCL) dedicated to I2C communication.

![Arduino Nano Component Image](elec/media/ArduinoNano.jpeg)

##### 1.2.2. Communication Module and Web Interface (ESP32 Dev Kit v1)
The ESP32 Dev Kit v1 module is specifically integrated to meet the requirement of a real-time web monitoring interface. Its main function is to handle wireless connectivity (Wi-Fi) and to host the web server that displays the quantities of sorted waste. The ESP32 communicates with the Arduino Nano as a slave on the I2C bus, receiving counting and color identification data to update them on the web interface.

The decision to use the ESP32 is driven by its integrated Wi-Fi module, which is essential for the system's network connectivity. Its processing power is more than sufficient to simultaneously handle the I2C protocol, the Wi-Fi network stack, and HTTP requests from the web server.

The main connections for the ESP32 include its power supply via VIN (5V), the use of its 3V3 pin to power the low-voltage side of the logic level shifter, and GPIO pins 21 (SDA) and 22 (SCL) for I2C communication.
![ESP32 Component Image](elec/media/ESP32.jpeg)

##### 1.2.3. Bidirectional Logic Level Shifter (BSS138 Module)
The logic level shifter module, based on the BSS138 MOSFET, is an essential component to ensure reliable and secure I2C communication between the Arduino Nano (5V) and the ESP32 (3.3V). Its function is to translate logic signals bidirectionally between these two distinct voltage domains.

On our PCB, this module is integrated using two 1x06 female header connectors, identified as J2 and J9. These footprints were specifically sized to accommodate a commercial BSS138 breakout module, providing a compact solution and simplifying physical integration on our custom board.
![BSS138 Module Image](elec/media/BSS138.jpeg)

**Operation and Justification for the Optimal Choice:**
The operating principle of this shifter is based on using MOSFETs to allow for transparent and bidirectional voltage conversion. It is powered by two separate voltage sources: 5V (from the Buck DC-DC converter) on the High Voltage (HV) side, and 3.3V (provided directly by the ESP32) on the Low Voltage (LV) side.

When a 3.3V signal is sent by the ESP32, the shifter raises it to 5V for the Arduino Nano. This ensures that the Nano perceives a clear high logic level (5V), providing a comfortable 2V safety margin above its detection threshold (approx. 3V). Conversely, when the Arduino Nano sends a 5V signal, the shifter lowers it to 3.3V for the ESP32, thereby protecting its native 3.3V GPIO pins. The module also includes its own pull-up resistors for the SDA and SCL lines, eliminating the need for external components. This solution is recognized as the most robust and reliable for I2C communication between systems with different logic voltages.

Key connections include powering the High Voltage (HV) side with 5V and the Low Voltage (LV) side with 3.3V from the ESP32. The HV1/HV2 data pins are connected to the Arduino Nano's SDA/SCL pins, and the LV1/LV2 pins are connected to the ESP32's SDA/SCL pins.

##### 1.2.4. Color Sensor (GY-33 Module)
The GY-33 color sensor module (TCS34725) identifies the color of the waste. It measures the light intensity for Red, Green, and Blue (RGB) components and transmits them to the Arduino Nano via I2C. A prior calibration is necessary to ensure accuracy. The module is connected to the I2C pins (SDA/SCL) of the Arduino Nano and is powered by 5V.
![GY-33 Sensor Image](elec/media/GY33.jpeg)

##### 1.2.5. Presence Sensors (KY-008 Laser Modules and Photoresistors)
Two KY-008 Laser modules and photoresistors detect the waste. When an object breaks the beam, the photoresistor's resistance increases, creating a voltage change read by the Arduino Nano.
- **Start Laser (J4)**: Triggers the motor to start.
- **Detection Zone Laser (J3)**: Triggers the motor to stop for color analysis.
![KY-008 Laser Module Image](elec/media/KY008.jpeg)

##### 1.2.6. Conveyor Motor Control (L298N Driver)
The L298N module (H-bridge) drives the DC motor. It receives low-current logic signals from the Nano (ENA, IN1, IN2) and supplies the necessary power to the motor from an external power source, controlling its speed and direction.![L298N Driver Image](elec/media/L298N.jpeg)

##### 1.2.7. Power Supply Module (Buck DC-DC - U3)
The Buck DC-DC converter regulates the variable input voltage from the Lithium battery to a stable 5V, which is essential for the Arduino Nano, sensors, and the driver's logic side.

##### 1.2.8. Decoupling Capacitors (C1, C2, C3, C4)
Placed near key components, they filter noise and stabilize the power supply lines, ensuring system reliability.

</details>

<details>
<summary><strong>Click to expand: Appendix B - PCB and Schematics Design Evolution</strong></summary>

The development of our electronic system followed an iterative process.

##### 1.3.1. Version 1: Schematic with UART Link
- **Description**: The first iteration favored a serial UART communication between the Arduino Nano and the ESP32.
- **Schematic**: ![V1 UART Schematic](elec/media/Schema-V1-UART.png)
- **Associated PCB**: ![V1 UART PCB](elec/media/PCB-V1-UART.png)
- **Reason for Abandonment**: Software complexity on the Arduino Nano became too high, and it did not fully leverage the ESP32's capabilities.

##### 1.3.2. Version 2: Schematic with I2C and Simple Pull-up Resistors
- **Description**: Migrated to the I2C protocol. Attempted to manage the voltage difference (5V/3.3V) with simple 4.7kΩ pull-up resistors connected to 3.3V.
- **Schematic**: ![V2 I2C Pull-up Schematic](elec/media/Schema-V2-I2C-Pullup.png)
- **Reason for Abandonment**: A technical analysis revealed a very low safety margin for the Arduino Nano (0.3V), making the system potentially vulnerable to electrical noise and compromising long-term reliability.

##### 1.3.3. Version 3 (Final): Schematic with I2C and a Dedicated Level Shifter
- **Description**: The final and most robust solution, using a dedicated logic level shifter (BSS138) for reliable inter-voltage I2C communication.
- **Schematic**: ![V3 I2C BSS Schematic](elec/media/Schema-V3-I2C-BSS.png)
- **Final PCB**: ![V3 I2C BSS PCB](elec/media/PCB-V3-I2C-BSS.png)
- **PCB Optimization**: The design was optimized with wide power traces, short and direct signal routing, and logical component placement. A Design Rule Check (DRC) was performed to ensure no errors.

</details>

<details>
<summary><strong>Click to expand: Appendix C - Power and Cable Management</strong></summary>

#### 1.4. Power Management and Safety
- **Source**: Lithium battery pack via a DC Jack (J5).
- **Regulation**: Buck DC-DC module (U3) for a stable and precise 5V.
- **Stability**: Decoupling capacitors to filter noise.
- **Protection**: Logic level shifter to protect microcontroller pins.

#### 1.5. Cable Management
The PCB design facilitates clean cable management. Connectors are positioned to minimize external cable lengths. Integration onto a single PCB reduces clutter and the risk of connection errors compared to a breadboard solution.

</details>

<details>
<summary><strong>Click to expand: Appendix D - Firmware (Code) - The Software Core</strong></summary>

#### 2.1. Arduino Nano Firmware (Master)
The code is structured around a **finite-state machine** for clear process management.
- **Architecture**: Pin definitions, motor control functions, sensor reading functions, color calibration and identification functions, and I2C communication function.
- **State Machine (`ConveyorState`)**: Manages the process flow through the states: `WAITING_FOR_CUBE`, `MOVING_TO_COLOR_SENSOR`, `MEASURING_COLOR`, `MOVING_TO_COLLECTION_POINT`, and `AT_COLLECTION_POINT`.
- **Calibration**: A `calibrateColorSensor()` function guides the user to calibrate the sensor with each color, ensuring accuracy under real-world conditions.

#### 2.2. ESP32 Firmware (Slave and Web API)
The ESP32 acts as an I2C slave and a web server that exposes a REST API.
- **Architecture**: Wi-Fi settings, I2C address, and `volatile` variables for the counters, which are updated by the I2C interrupt.
- **I2C Communication**: The `receiveEvent()` function is a callback that triggers upon receiving data from the Nano and updates the counters.
- **Web Server and API**: The ESP32 initializes an HTTP server and exposes a `/data` API endpoint. When queried, it returns a JSON object with the latest counters, allowing the frontend to update itself.

</details>

<details>
<summary><strong>Click to expand: Appendix E - User and Calibration Guide</strong></summary>

#### 3.1. Startup and Initial Calibration
1.  **Wiring**: Check all wiring according to the final schematic.
2.  **Uploading**: Flash the code to the Nano, then to the ESP32 (after configuring Wi-Fi).
3.  **IP Check**: Note the ESP32's IP address from the Serial Monitor.
4.  **Color Calibration**: Follow the instructions in the Nano's Serial Monitor to calibrate the color sensor with a white object and then each color cube.

#### 3.2. Operating Parameter Calibration (Variables to Adjust)
The following variables in the Nano's code allow for fine-tuning:
- `motorSpeedPWM`: Motor speed (0-255).
- `motorRunDuration_Start`: Initial movement duration (in ms).
- `laserThreshold_1`, `laserThreshold_2`: Laser detection thresholds (0-1023).
- `COLOR_MATCH_THRESHOLD`: Tolerance for color recognition.

#### 3.3. Monitoring Statistics (Vercel Frontend)
1.  **Access**: Open the frontend URL: `https://convoyeur-front-r5y5.vercel.app/`
2.  **Configuration**: Update the API URL in the frontend's code with your ESP32's IP address.
3.  **Observation**: The counters will update in real-time.

</details>

---

## 10. Conclusion
<a name="10-conclusion"></a>

This final project has highlighted our ability to carry out a complex electronics project from start to finish. From the iterative design of a robust PCB to the programming of communicating embedded firmwares, we have transformed the requirements into an integrated hardware and software solution. This control system demonstrates our mastery of sensors, actuators, and communication protocols, which are fundamental pillars of any modern and resilient robotic system.
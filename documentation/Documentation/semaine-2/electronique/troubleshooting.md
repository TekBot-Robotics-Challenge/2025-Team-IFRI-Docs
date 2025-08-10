# Troubleshooting (FAQ) - BlackBox & Control Station

This section addresses common issues that might be encountered during assembly, uploading, or use of the system, along with their solutions.

---

### 1. Firmware Upload Issues

* **Q: Error "avrdude: ser_open(): can't open device" or "Port not found."**
    * **A:** Verify that the correct COM/USB port is selected in the Arduino IDE (`Tools > Port`). Ensure the USB-to-Serial adapter (or Arduino Uno used as a programmer) is correctly connected and that the drivers (e.g., FTDI, CH340) are installed on the computer.
* **Q: Error "stk500_getsync(): not in sync: resp=0x00".**
    * **A:** This often indicates a communication problem between the IDE and the microcontroller.
        * Verify that the correct board is selected (`Tools > Board`).
        * Ensure the ATmega328P is correctly wired for uploading (including TX/RX, Reset connections).
        * Try holding down the "Reset" button on the Arduino (or unplugging/replugging GND on the standalone ATmega) just before the upload begins (right after compilation).
* **Q: Code compiles but nothing happens on the board.**
    * **A:** Check the board's power supply and `GND` connections. If a standalone ATmega328P is used, ensure the 16 MHz crystal and its 22 pF capacitors are correctly connected and that the bootloader is properly burned.

---

### 2. I2C Communication Issues

* **Q: The Control Station's LCD screen remains blank or displays squares.**
    * **A:**
        * Check the LCD wiring, especially SDA, SCL, VCC, and GND.
        * Ensure the contrast potentiometer on the back of the LCD's I2C module is correctly adjusted (turn with a small screwdriver).
        * Verify the I2C address of the LCD module. The default address in the code (`0x27`) is the most common, but some modules use `0x3F`. An "I2C scanner" sketch (search for "Arduino I2C scanner" online) can be used to find the actual LCD address.
* **Q: The Control Station does not display data or shows erroneous values.**
    * **A:**
        * Ensure that the SDA and SCL pins of the BlackBox and Control Station are correctly connected (SDA to SDA, SCL to SCL).
        * **The grounds (GND) of both modules must be interconnected!** This is a very common I2C error.
        * Verify that the firmwares for both modules are properly uploaded and match the expected versions.
        * Confirm that `STATION_ADDRESS` is identical in both codes.
        * Are the pull-up resistors (4.7kΩ) on SDA and SCL present? They are often integrated into modules or Arduino boards but may be needed if the ATmega is used standalone.

---

### 3. MPU-6050 Sensor Issues

* **Q: The MPU-6050 does not return data or shows fixed/erroneous values.**
    * **A:**
        * Check the MPU-6050 wiring (VCC, GND, SDA, SCL, INT).
        * Confirm the MPU-6050's power supply (VCC). Some modules are 3.3V, others have an integrated 5V regulator.
        * Ensure the MPU-6050's I2C address is correct (`0x68` or `0x69` if the AD0 pin is pulled HIGH). The code uses 0x68.

---

### 4. Crash Detection and EEPROM Issues

* **Q: The system does not detect crashes or detects "false positives."**
    * **A:** The `CRASH_THRESHOLD_G` detection threshold may need adjustment. This value depends on the desired sensitivity and the type of impact to simulate. Start with lower values and gradually increase.
    * Check the sensor's stability. Excessive vibrations during normal flight can be interpreted as false positives.
* **Q: Data is not saved to EEPROM or recovered data is corrupted.**
    * **A:**
        * Ensure that the standard Arduino EEPROM library is being used.
        * Verify the size of your `FlightData` struct and the management of EEPROM addresses in the code. `EEPROM.put()` and `EEPROM.get()` functions automatically handle the struct size, but addresses (`EEPROM_CRASH_FLAG_ADDR`, `EEPROM_CRASH_ADDR_ADDR`) must be correctly defined to avoid overlaps.
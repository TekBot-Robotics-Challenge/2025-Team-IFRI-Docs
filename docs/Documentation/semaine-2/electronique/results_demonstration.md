# Results and Demonstration - BlackBox & Control Station

This project has been rigorously tested to validate its key functionalities, from data acquisition to crash detection and recovery.

---

### 1. Functional Tests

Unit and integration tests have been performed for each component and module. Detailed results of these tests are available in the [`tests/results/`](tests/results/) folder.

* **EEPROM Test (`eeprom_test`)**: Validation of non-volatile data reading and writing.
    * [EEPROM Test Results](../tests/results/eeprom_test/results.txt)
* **I2C Communication Test (`i2c_master_to_slave`)**: Verification of bidirectional transmission between the BlackBox (Master) and the Control Station (Slave).
    * [I2C Test Results](../tests/results/i2c_master_to_slave/results.txt)
* **I2C LCD Screen Test (`lcd_i2c_test`)**: Confirmation of correct information display.
    * [LCD I2C Test Results](../tests/results/lcd_i2c_test/results.txt)
* **MPU-6050 Sensor Test (`mpu6050_test`)**: Verification of accurate acceleration and gyroscope data acquisition.
    * [MPU-6050 Test Results](../tests/results/mpu6050_test/results.txt)
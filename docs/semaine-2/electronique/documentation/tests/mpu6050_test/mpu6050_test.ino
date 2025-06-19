// Test MPU-6050
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Test MPU-6050");

  Wire.begin(); // Initialise I2C

  if (!mpu.begin()) {
    Serial.println("MPU-6050 non trouve! Verifiez connexions.");
    while (1) delay(10); // Bloque ici si non trouve
  }
  Serial.println("MPU-6050 detecte.");

  // Options du capteur (non vital pour le test de base)
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  Serial.print("AccelX: "); Serial.print(a.acceleration.x);
  Serial.print(" Y: "); Serial.print(a.acceleration.y);
  Serial.print(" Z: "); Serial.print(a.acceleration.z);
  Serial.print(" m/s^2 | GyroX: "); Serial.print(g.gyro.x);
  Serial.print(" Y: "); Serial.print(g.gyro.y);
  Serial.print(" Z: "); Serial.print(g.gyro.z);
  Serial.println(" rad/s");

  delay(100); // Mise a jour toutes les 100ms
}

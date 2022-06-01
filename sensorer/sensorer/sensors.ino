#if useSensors

unsigned long previousSensorsMillis = 0;
const long sensorsInterval = 10000;

Command sensorGetCommand;

#include <SoftwareSerial.h>
const byte rxSensorPin = 51; // to tx
const byte txSensorPin = 50; // to rx
SoftwareSerial sensorSerial (rxSensorPin, txSensorPin);
int sensorArduinoTemperature;

static void sensorsLoop() {
  // Send Sensor data
  unsigned long currentMillis = millis();
  if (currentMillis - previousSensorsMillis >= sensorsInterval) {
    previousSensorsMillis = currentMillis;
    Serial.println("getSensorData auto-requested");
    sensorSerial.println("getSensorData");
  }

  if (sensorSerial.available()) {
    String input = sensorSerial.readStringUntil('\n');
    Serial.print("sensors:::temperature2=");
    Serial.print(sensorArduinoTemperature);
    if (input) {
      Serial.print(";");
      Serial.print(input);
    }
    Serial.println("");
  }

} 

static void sensorsSetup() {
  sensorSerial.begin(9600);
  sensorGetCommand = cli.addCommand("getSensorData", sensorGetCallback);

  // Define pin modes for TX and RX
  pinMode(rxSensorPin, INPUT);
  pinMode(txSensorPin, OUTPUT);

  #if debug
    Serial.println("Sensors enabled");
  #endif
}

void sensorGetCallback(cmd* c) {
  sensorSerial.println("getSensorData");
  Serial.println("getSensorData requested");
}

#endif
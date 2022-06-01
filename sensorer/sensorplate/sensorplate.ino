#include <DHT.h>
#include <SimpleCLI.h>
#define debug false
#define DHTPIN 2 // Pin of the sensor output 
#define MOTIONPIN 3
#define DHTTYPE DHT22    // Sensor type

DHT dht(DHTPIN, DHTTYPE);
SimpleCLI cli;
String readString;
Command sensorGetCommand;

int motionDetect = LOW;
float humidity, temperature;  

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);    // Serieller Monitor

  dht.begin();
  pinMode(MOTIONPIN, INPUT);
  // Define pin modes for TX and RX

  sensorGetCommand = cli.addCommand("getSensorData", sensorGetCallback);

  #if debug
    Serial.println("Did boot");
   #endif
}

void loop() {
  if (Serial.available()) {
    // Read out string from the serial monitor
    String input = Serial.readStringUntil('\n');

    #if debug
        // Echo the user input
        Serial.print("# ");
        Serial.println(input);
    #endif;


    // Parse the user input into the CLI
    cli.parse(input);
  }

  humidity = dht.readHumidity();                           
  temperature = dht.readTemperature();  

  motionDetect = digitalRead(MOTIONPIN);    
}

void sensorGetCallback(cmd* c) {
  Serial.print("temperature1=");
  Serial.print(temperature);
  Serial.print(";humidity1=");
  Serial.print(humidity);
  Serial.print(";motionDetect=");
  if (motionDetect == HIGH) {
    Serial.print("true");
  } else {
    Serial.print("false");
  }
  Serial.println("");
}

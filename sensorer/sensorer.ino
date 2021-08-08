
#include <SimpleCLI.h>
#define debug false

// Defining simple CLI Instance
SimpleCLI cli;



String readString;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(500000);    // Serieller Monitor
  Serial.setTimeout(10);

  Serial2.begin(9600); // heater
  Serial3.begin(9600);

  lightsSetup();
  GPSsetup();
  heaterSetup();
  switchesSetup();
  fanSetup();

  #if debug
    Serial.println("Did boot");
   #endif
}

void loop() {
      // Check if user typed something into the serial monitor
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

    heater();

    GPSloop();
    FanLoop();
}

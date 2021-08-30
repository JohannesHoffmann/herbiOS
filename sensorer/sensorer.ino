
#include <SimpleCLI.h>
#define debug false

// Enable or disable different Components of this module
#define useFans true
#define useHeater true
#define useGps true
#define useLights true
#define useSwitches true

// Defining simple CLI Instance
SimpleCLI cli;
String readString;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);    // Serieller Monitor
  Serial.setTimeout(10);

  #if useLights
    lightsSetup();
  #endif

  #if useGps
    GPSsetup();
  #endif

  #if useHeater
    heaterSetup();
  #endif
  
  #if useSwitches
    switchesSetup();
  #endif
  
  #if useFans
    fanSetup();
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

    #if useHeater
      heaterLoop();
    #endif

    #if useGps
      GPSloop(); 
    #endif

    #if useFans
      FanLoop();
    #endif
}

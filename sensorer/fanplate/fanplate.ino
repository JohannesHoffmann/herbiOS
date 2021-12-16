
#include <SimpleCLI.h>
#define debug false

// Defining simple CLI Instance
SimpleCLI cli;

String readString;

Command fanSetCommand;
Command fanGetCommand;

const int FAN_OUT = 10;
const int FAN_IN = 11;

String FAN_DIRECTION = "blow";
int FAN_LEVEL = 0;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);    // Serieller Monitor

  pinMode(FAN_OUT, OUTPUT);
  pinMode(FAN_IN, OUTPUT);
  
  fanSetCommand = cli.addCommand("setFan", fanSetCallback);
  fanSetCommand.addArgument("direction");
  fanSetCommand.addArgument("level");
  
  fanSetCommand = cli.addCommand("getFan", fanGetCallback);

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
}


void fanGetCallback(cmd* c) {
  Serial.print("fanOverhead:");
  Serial.print("level=");
  Serial.print(FAN_LEVEL);
  Serial.print(";direction=");
  Serial.print(FAN_DIRECTION);
}

void fanSetCallback(cmd* c) {
    Command cmd(c); // Create wrapper object
    Argument directionArg = cmd.getArgument("direction");
    Argument levelArg = cmd.getArgument("level");

    String directionn = directionArg.getValue();
    int level = levelArg.getValue().toInt();

    if (level > 255) {
      level = 255;
    } else if (level < 80 && level > 0) {
      // Do not allow level under 80 (30%) because the fans don't like speed under 30%
      level = 80;
    } else if (level <= 0) {
      level = 0;
    }
    
    if (directionn == "out") {
      analogWrite(FAN_OUT, level);
      analogWrite(FAN_IN, 0);
    } else if (directionn == "in") {
      analogWrite(FAN_OUT, 0);
      analogWrite(FAN_IN, level);
    } else {
      analogWrite(FAN_OUT, 0);
      analogWrite(FAN_IN, 0);
    }


    
    Serial.print("Direction: ");
    Serial.print(directionn);
    Serial.print(" with strength of: ");
    Serial.println(level);

}

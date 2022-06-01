
#if useFans

Command fanSetCommand;
Command fanGetCommand;

// The overhead Fan is a fan in the van ceiling that can change direction. 
#include <SoftwareSerial.h>
const byte rxPin = 52;
const byte txPin = 53;
SoftwareSerial overheadFanSerial (rxPin, txPin);

// This two fans are used to circulate the air in the electric box
const int FAN_1 = 8;
const int FAN_2 = 7;
int FAN_1_LEVEL = false;
int FAN_2_LEVEL = false;

  
void fanSetup() {
  pinMode(FAN_1, OUTPUT);
  pinMode(FAN_2, OUTPUT);
  
  fanSetCommand = cli.addCommand("setFan", fanSetCallback);
  fanSetCommand.addArgument("fan");
  fanSetCommand.addArgument("direction", "blow");
  fanSetCommand.addArgument("level");

  fanGetCommand = cli.addCommand("getFans", fanGetCallback);

  overheadFanSerial.begin(9600);

  #if debug
    Serial.println("Fans enabled");
  #endif
}



void FanLoop() {
  if (overheadFanSerial.available()) {
    String input = overheadFanSerial.readStringUntil('\n');
    Serial.println(input);
  }
}



void fanSetCallback(cmd* c) {
    Command cmd(c); // Create wrapper object
    Argument fanArg = cmd.getArgument("fan");
    Argument levelArg = cmd.getArgument("level");
    Argument directionArg = cmd.getArgument("direction");

    int level = levelArg.getValue().toInt();
    String fan = fanArg.getValue();
    String directionn = directionArg.getValue();

    if (level > 255) {
      level = 255;
    } else if (level < 0) {
      level = 0;
    }

    if (fan == "fan1") {
      analogWrite(FAN_1, level);
      FAN_1_LEVEL = level;
    } else if (fan == "fan2") {
      analogWrite(FAN_2, level);
      FAN_2_LEVEL = level;
    } else if (fan == "overhead") {
      // The overhad fans are on a seperate board.
      // the command will be proxied via software serial
      overheadFanSerial.print("setFan -direction ");
      overheadFanSerial.print(directionn);
      overheadFanSerial.print(" -level ");
      overheadFanSerial.println(level);
    }


    #if debug
      Serial.print("Fan: ");
      Serial.print(fan);
      Serial.print(" is set to: ");
      Serial.print(level);
      Serial.print(" in direction: ");
      Serial.println(directionn);
    #endif
}


void fanGetCallback(cmd* c) {
  Serial.print("fans");
  Serial.print(",fan1:");
  Serial.print(FAN_1_LEVEL);
  Serial.print(",fan2:");
  Serial.print(FAN_2_LEVEL);

  Serial.print(",overheadFan:");
  if(overheadFanSerial.available() > 0) {
    String input = overheadFanSerial.readStringUntil('\n');
    overheadFanSerial.println("getFan");
    if (input) {
      Serial.print(input);
    } else {
      Serial.print("n/a");
    }
  } else {
    Serial.print("n/a");
  }

  Serial.println("");
}

#endif

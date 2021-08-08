Command fanCommand;
#include <SoftwareSerial.h>

int FAN_CABIN = 8;
int FAN_ELECTRIC = 7;
const byte rxPin = 52;
const byte txPin = 53;
SoftwareSerial overheadFanSerial (rxPin, txPin);
  
void fanSetup() {

  
  pinMode(FAN_CABIN, OUTPUT);
  pinMode(FAN_ELECTRIC, OUTPUT);
  
  fanCommand = cli.addCommand("setFan", fanCallback);
  fanCommand.addArgument("fan");
  fanCommand.addArgument("direction");
  fanCommand.addArgument("level");

  overheadFanSerial.begin(9600);
}

void FanLoop() {
  if (overheadFanSerial.available()) {
    String input = overheadFanSerial.readStringUntil('\n');
    Serial.println(input);
  }
}

void fanCallback(cmd* c) {
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

    if (fan == "cabin") {
      analogWrite(FAN_CABIN, level);
    } else if (fan == "electric") {
      analogWrite(FAN_ELECTRIC, level);
    } else if (fan == "overhead") {
      // The overhad fans are on a seperate board.
      // the command will be proxied via software serial
      overheadFanSerial.print("setFan -direction ");
      overheadFanSerial.print(directionn);
      overheadFanSerial.print(" -level ");
      overheadFanSerial.println(level);
      Serial.print("setFan -direction ");
      Serial.print(directionn);
      Serial.print(" -level ");
      Serial.println(level);
    }


    
    Serial.print("Fan: ");
    Serial.print(fan);
    Serial.print(" is set to: ");
    Serial.print(level);
    Serial.print(" in direction: ");
    Serial.println(directionn);
}

Command switchesCommand;

int SWITCH_PV2 = 6;
int SWITCH_PV1 = 5;
int SWITCH_230V = 4;
int SWITCH_WATER = 3;


void switchesSetup() {
  pinMode(SWITCH_PV1, OUTPUT);
  pinMode(SWITCH_PV2, OUTPUT);
  pinMode(SWITCH_230V, OUTPUT);
  pinMode(SWITCH_WATER, OUTPUT);

  digitalWrite(SWITCH_PV1, HIGH);
  digitalWrite(SWITCH_PV2, HIGH);
  digitalWrite(SWITCH_230V, HIGH);
  digitalWrite(SWITCH_WATER , LOW);

  lightsCommand = cli.addCommand("setSwitch", switchCallback);
  lightsCommand.addArgument("name");
  lightsCommand.addArgument("mode");
}

void switchCallback(cmd* c) {
    Command cmd(c); // Create wrapper object
    Argument nameArg = cmd.getArgument("name");
    Argument modeArg = cmd.getArgument("mode");

    String switchName = nameArg.getValue();
    String switchMode = modeArg.getValue();
    
    if (switchName == "pv") {
      if (switchMode == "off") {
        digitalWrite(SWITCH_PV2, LOW);
        delay(500);
        digitalWrite(SWITCH_PV1, HIGH);
      } else if (switchMode == "parallel") {
        digitalWrite(SWITCH_PV2, HIGH);
        delay(500);
        digitalWrite(SWITCH_PV1, HIGH);
      } else if (switchMode == "serial") {
        digitalWrite(SWITCH_PV2, LOW);
        delay(500);
        digitalWrite(SWITCH_PV1, LOW);
      }
    } else if (switchName == "230V") {
      if (switchMode == "on") {
        digitalWrite(SWITCH_230V, LOW);
      } else {
        digitalWrite(SWITCH_230V, HIGH);
      }
    } else if (switchName == "water") {
      if (switchMode == "on") {
        digitalWrite(SWITCH_WATER, LOW);
      } else {
        digitalWrite(SWITCH_WATER, HIGH);
      }
    }

    Serial.print("Switch: ");
    Serial.print(switchName);
    Serial.print("set to: ");
    Serial.println(switchMode);
}

#if useSwitches
Command switchesSetCommand;

int NUMBER_SWITCHES = 6;
int SWITCHES_PIN[6] = {1,2,3,4,5,6};
boolean SWITCHES_ON[6] = {false, false, false, true, false, false}; // Default state

void switchesSetup() {
  for (int i = 0; i < NUMBER_SWITCHES; i++) {
    pinMode(SWITCHES_PIN[i], OUTPUT);
    if (SWITCHES_ON[i]) {
      digitalWrite(SWITCHES_PIN[i], HIGH);
      continue;
    }

    digitalWrite(SWITCHES_PIN[i], LOW);
  }

  switchesSetCommand = cli.addCommand("setSwitch", switchSetCallback);
  switchesSetCommand.addArgument("switch");
  switchesSetCommand.addArgument("state");
  
  switchesSetCommand = cli.addCommand("getSwitches", switchGetCallback);

  #if debug
    Serial.println("Switches enabled");
  #endif
}

void switchGetCallback(cmd* c) {
  Serial.print("switches");
  for (int i = 0; i < NUMBER_SWITCHES; i++) {
    Serial.print(",switch");
    Serial.print(i);
    Serial.print(":");
    Serial.print(SWITCHES_ON[i]);
  }  
  Serial.println("");
}

  
void switchSetCallback(cmd* c) {
    Command cmd(c); // Create wrapper object
    Argument switchArg = cmd.getArgument("switch");
    Argument stateArg = cmd.getArgument("state");

    int switchNumber = switchArg.getValue().toInt();
    String switchState = stateArg.getValue();
    
    if (switchNumber >= NUMBER_SWITCHES) {
      return;      
    }

    if (switchState == "on") {
      digitalWrite(SWITCHES_PIN[switchNumber], HIGH);
      SWITCHES_ON[switchNumber] = true;
      
    } else {
      digitalWrite(SWITCHES_PIN[switchNumber], LOW);
      SWITCHES_ON[switchNumber] = false;
    }

    #if debug
      Serial.print("Switch: ");
      Serial.print(switchNumber);
      Serial.print(" set to: ");
      Serial.println(switchState);
    #endif
}
#endif
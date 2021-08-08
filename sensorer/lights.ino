Command lightsCommand;

int LIGHT_1 = 13;
int LIGHT_2 = 12;
int LIGHT_3 = 11;
int LIGHT_4 = 10;
// int LIGHT_5 = 9;

void lightsSetup() {
  pinMode(LIGHT_1, OUTPUT);
  pinMode(LIGHT_2, OUTPUT);
  pinMode(LIGHT_3, OUTPUT);
  pinMode(LIGHT_4, OUTPUT);
  // pinMode(LIGHT_5, OUTPUT);
  
  lightsCommand = cli.addCommand("setLight", lightsCallback);
  lightsCommand.addArgument("light");
  lightsCommand.addArgument("level");
}

void lightsCallback(cmd* c) {
    Command cmd(c); // Create wrapper object
    Argument lightArg = cmd.getArgument("light");
    Argument levelArg = cmd.getArgument("level");

    int level = levelArg.getValue().toInt();
    String light = lightArg.getValue();

    if (level > 255) {
      level = 255;
    } else if (level < 0) {
      level = 0;
    }
    
    if (light == "1") {
      analogWrite(LIGHT_1, level);
    } else if (light == "2") {
      analogWrite(LIGHT_2, level);
    } else if (light == "3") {
      analogWrite(LIGHT_3, level);
    } else if (light == "4") {
      analogWrite(LIGHT_4, level);
    }
    // else if (light == "5") {
    //  analogWrite(LIGHT_5, level);
    // }


    
    Serial.print("Light: ");
    Serial.print(light);
    Serial.print(" is set to: ");
    Serial.println(level);

}

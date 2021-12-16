#if useLights
Command lightsSetCommand;
Command lightsGetCommand;

int NUMBER_LIGHTS = 4; // 4 lights as default. Increase or decrease to your needs. Do not forget to change the two arrays below as well.
int LIGHTS_PIN[4] = {13,12,11,10}; // Pins of all 4 lights
int LIGHTS_LEVEL[4] = {0, 0, 0, 0}; // Default state of the lights


void lightsSetup() {
  for (int i = 0; i < NUMBER_LIGHTS; i++) {
    pinMode(LIGHTS_PIN[i], OUTPUT);
    digitalWrite(LIGHTS_PIN[i], LIGHTS_LEVEL[i]);    
  }
  
  lightsSetCommand = cli.addCommand("setLight", lightsSetCallback);
  lightsSetCommand.addArgument("light");
  lightsSetCommand.addArgument("level");

  lightsGetCommand = cli.addCommand("getLights", lightsGetCallback);

  #if debug
    Serial.println("Lights enabled");
  #endif
}

void lightsSetCallback(cmd* c) {
    Command cmd(c); // Create wrapper object
    Argument lightArg = cmd.getArgument("light");
    Argument levelArg = cmd.getArgument("level");

    int level = levelArg.getValue().toInt();
    int light = lightArg.getValue().toInt();

    if (light >= NUMBER_LIGHTS) {
      return;      
    }

    if (level > 255) {
      level = 255;
    } else if (level < 0) {
      level = 0;
    }

    analogWrite(LIGHTS_PIN[light], level);
    LIGHTS_LEVEL[light] = level;

    #if debug
      Serial.print("Light: ");
      Serial.print(light);
      Serial.print(" is set to: ");
      Serial.println(level);
    #endif
}

void lightsGetCallback(cmd* c) {
  Serial.print("lights");
  for (int i = 0; i < NUMBER_LIGHTS; i++) {
    Serial.print(",light");
    Serial.print(i);
    Serial.print(":");
    Serial.print(LIGHTS_LEVEL[i]);
  }  
  Serial.println("");
}
#endif
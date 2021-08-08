#include <Crc16.h> // https://github.com/vinmenn/Crc16
Crc16 crc; 
Command heaterCommand;

unsigned long previousMillis = 0;
const long requestInterval = 1000;

String command = "";
byte commandHeaterStart [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x08, 0xFF };

void heaterSetup() {
  heaterCommand = cli.addCommand("heater", heaterStartCallback);
  heaterCommand.addArgument("do");
}


void heater() {
  unsigned long currentMillis = millis();
  char sendCommand;

  // Send Messages
  if (currentMillis - previousMillis >= requestInterval) {
    previousMillis = currentMillis;
   
    if (command == "heaterStart") {
      heaterOn();
    } else if (command == "fanStart") {
      heaterFanOn();
    } else if (command == "stop") {
      heaterFanOff();
    }else if (command == "status") {
      heaterStatus();
    } 
    
    else if (command == "fan0") {
      heaterFanStep(0);
    } else if (command == "fan1") {
      heaterFanStep(1);
    } else if (command == "fan2") {
      heaterFanStep(2);
    } else if (command == "fan3") {
      heaterFanStep(3);
    } else if (command == "fan4") {
      heaterFanStep(4);
    } else if (command == "fan5") {
      heaterFanStep(5);
    } else if (command == "fan6") {
      heaterFanStep(6);
    } else if (command == "fan7") {
      heaterFanStep(7);
    } else if (command == "fan8") {
      heaterFanStep(8);
    } else if (command == "fan9") {
      heaterFanStep(9);
    }


    else if (command == "heat0") {
      heaterStep(0);
    } else if (command == "heat1") {
      heaterStep(1);
    } else if (command == "heat2") {
      heaterStep(2);
    } else if (command == "heat3") {
      heaterStep(3);
    } else if (command == "heat4") {
      heaterStep(4);
    } else if (command == "heat5") {
      heaterStep(5);
    } else if (command == "heat6") {
      heaterStep(6);
    } else if (command == "heat7") {
      heaterStep(7);
    } else if (command == "heat8") {
      heaterStep(8);
    } else if (command == "heat9") {
      heaterStep(9);
    }
    
    
    else {
      heaterStatus();
    }
    command = "";
  }
  
  #if debug
  while (Serial2.available())
    {
      int c = Serial2.read();
      Serial.print(" ");
      Serial.print(c, HEX);
    }
    #endif
}

void heaterPing() {
      Serial.println("Heater Ping");
      byte command [] = { 0xAA, 0x03, 0x00, 0x00, 0x0F, 0x58, 0x7C };
      Serial2.write (command, sizeof command);
}

void heaterStatus() {
   #if debug
      Serial.println("Heater Status");
   #endif
      byte command [] = { 0xAA, 0x03, 0x00, 0x00, 0x0F, 0x58, 0x7c };
      Serial2.write (command, sizeof command);

      // DEBUGGING MESSAGE SIGNING
 //     byte sc [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x01, 0x02, 0x00, 0x00, 0x00 };
 //     message(sc, sizeof sc);
  //    Serial.print("MEssage: ");
 //     for (int i = 0; i<sizeof(sc); i++) {
 //       Serial.print(" 0x");
 //       Serial.print(sc[i], HEX);
  //    }
  //    Serial.println("");
      
}

void heaterOn() {
      Serial.println("Heater on");
      byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x01, 0x02, 0x00, 0xDA, 0xBF };
      //                                                                                  ^._ Heater step 0
      //byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x01, 0x02, 0x09, 0xDA, 0xEF };
      //                                                                                   ^._ Heater step 0
      Serial2.write (command, sizeof command);
}

void heaterFanOn() {
      Serial.println("Heater fan on");
      byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x09, 0xFF, 0x71, 0x0A };
      //                                                               ^._ Heater step
      Serial2.write (command, sizeof command);
}


void heaterFanOff() {
      Serial.println("Heater fan off");
      byte command [] = { 0xAA, 0x03, 0x00, 0x00, 0x03, 0x5D, 0x7C };
      Serial2.write (command, sizeof command);
}

void heaterFanStep(int s) {
      Serial.print("Heater fan step ");
      Serial.println(s);
      if (s == 9) {
        // step 9
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x09, 0xFF, 0x71, 0x0A };
        Serial2.write (command, sizeof command);
      } else if (s == 8) {
        // step 8
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x08, 0xFF, 0xE1, 0x0B };
        Serial2.write (command, sizeof command);
      } else if (s == 7) {
        // step 7
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x07, 0xFF, 0x11, 0x0E };
        Serial2.write (command, sizeof command);
      } else if (s == 6) {
        // step 6
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x06, 0xFF, 0x81, 0x0F };
        Serial2.write (command, sizeof command);
      } else if (s == 5) {
        // step 5
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x05, 0xFF, 0x71, 0x0F };
        Serial2.write (command, sizeof command);
      } else if (s == 4) {
        // step 4
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x04, 0xFF, 0xE1, 0x0E };
        Serial2.write (command, sizeof command);
      } else if (s == 3) {
        // step 3
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x03, 0xFF, 0xD1, 0x0C };
        Serial2.write (command, sizeof command);
      } else if (s == 2) {
        // step 2
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x02, 0xFF, 0x41, 0x0D };
        Serial2.write (command, sizeof command);
      } else if (s == 1) {
        // step 1
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x01, 0xFF, 0xB1, 0x0D };
        Serial2.write (command, sizeof command);
      } else {
        // step 0
        byte command [] = { 0xAA, 0x03, 0x04, 0x00, 0x23, 0xFF, 0xFF, 0x00, 0xFF, 0x21, 0x0C };
        Serial2.write (command, sizeof command);
      }  
}


void heaterStep(int s) {
      Serial.print("Heater step ");
      Serial.println(s);
      if (s == 9) {
        // step 9
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x1C, 0x02, 0x09, 0xDA, 0xEF };
        Serial2.write (command, sizeof command);
      } else if (s == 8) {
        // step 8
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x19, 0x02, 0x08, 0x1B, 0x3E };
        Serial2.write (command, sizeof command);
      } else if (s == 7) {
        // step 7
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x16, 0x02, 0x07, 0x1C, 0x4E };
        Serial2.write (command, sizeof command);
      } else if (s == 6) {
        // step 6
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x14, 0x02, 0x06, 0x1C, 0x2E };
        Serial2.write (command, sizeof command);
      } else if (s == 5) {
        // step 5
        Serial.println("STEP5");
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x11, 0x02, 0x05, 0x1C, 0x7F };
        Serial2.write (command, sizeof command);
      } else if (s == 4) {
        // step 4
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x0E, 0x02, 0x04, 0x1A, 0x8E };
        Serial2.write (command, sizeof command);
      } else if (s == 3) {
        // step 3
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x0B, 0x02, 0x03, 0xD9, 0xDF };
        Serial2.write (command, sizeof command);
      } else if (s == 2) {
        // step 2
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x07, 0x02, 0x02, 0x1A, 0xDE };
        Serial2.write (command, sizeof command);
      } else if (s == 1) {
        // step 1
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x05, 0x02, 0x01, 0xDB, 0x3F };
        Serial2.write (command, sizeof command);
      } else {
        // step 0
        byte command [] = { 0xAA, 0x03, 0x06, 0x00, 0x01, 0xFF, 0xFF, 0x04, 0x01, 0x02, 0x00, 0xDA, 0xBF };
        Serial2.write (command, sizeof command);
      }  
}


void heaterStartCallback(cmd* c) {
  Command cmd(c);
  Argument doArg = cmd.getArgument("do");
  Argument stepArg = cmd.getArgument("step");
  if (doArg.getValue() == "start") {
    command = "heaterStart";
  } else if (doArg.getValue() == "status") {
    command = "status";
  } else if (doArg.getValue() == "fanStart") {
    command = "fanStart";
  } else if (doArg.getValue() == "stop") {
    command = "stop";
  } 
  
  else if (doArg.getValue() == "fan1") {
    command = "fan1";
  } else if (doArg.getValue() == "fan2") {
    command = "fan2";
  } else if (doArg.getValue() == "fan3") {
    command = "fan3";
  } else if (doArg.getValue() == "fan4") {
    command = "fan4";
  } else if (doArg.getValue() == "fan5") {
    command = "fan5";
  } else if (doArg.getValue() == "fan6") {
    command = "fan6";
  } else if (doArg.getValue() == "fan7") {
    command = "fan7";
  } else if (doArg.getValue() == "fan8") {
    command = "fan8";
  } else if (doArg.getValue() == "fan9") {
    command = "fan9";
  } else if (doArg.getValue() == "fan0") {
    command = "fan0";
  }


  else if (doArg.getValue() == "heat1") {
    command = "heat1";
  } else if (doArg.getValue() == "heat2") {
    command = "heat2";
  } else if (doArg.getValue() == "heat3") {
    command = "heat3";
  } else if (doArg.getValue() == "heat4") {
    command = "heat4";
  } else if (doArg.getValue() == "heat5") {
    command = "heat5";
  } else if (doArg.getValue() == "heat6") {
    command = "heat6";
  } else if (doArg.getValue() == "heat7") {
    command = "heat7";
  } else if (doArg.getValue() == "heat8") {
    command = "heat8";
  } else if (doArg.getValue() == "heat9") {
    command = "heat9";
  } else if (doArg.getValue() == "heat0") {
    command = "heat0";
  }
}

void message(byte* data, int size) {
  unsigned short value = crc.Modbus(data, 0, size - 2);
  data[size - 1]=(byte)value;
  data[size - 2]=(byte)(value >> 8);
}

#include <Math.h>

int LIGHT = 2;
int BUTTON = 3;
int PUMP = 4;
int bstate=0; 
int on = 0;

unsigned long previousMillis = 0;
unsigned long previousBlinkMillis = 0;
const long powerInterval = 60000;

const int blinkTime = 500;
const int blinkSteps = 10;
const long blinkInterval = blinkTime;
boolean blinkOn = false;
boolean blinkTimeOn = false;

void setup() {
  // put your setup code here, to run once:
  pinMode(LIGHT, OUTPUT);
  pinMode(PUMP, OUTPUT);
  pinMode(BUTTON, INPUT);

  Serial.begin(500000);    // Serieller Monitor
}

void loop() {

  unsigned long currentMillis = millis();

  // POWER IS ON
  if (on == 1) {
    
    if (currentMillis - previousMillis >= powerInterval - blinkTime * blinkSteps) {
      blinkTimeOn = true;

      if (currentMillis - previousBlinkMillis >= blinkInterval) {
        previousBlinkMillis = currentMillis;
          
        Serial.println("Start Blinking");
        
        if (blinkOn) {
          digitalWrite(LIGHT, HIGH);
          blinkOn = false;
        } else {
          digitalWrite(LIGHT, LOW);
          blinkOn = true;
        }
      }
      
      
      if (currentMillis - previousMillis >= powerInterval) {
        on = 0;
        blinkTimeOn = false;
        blinkOn = false;
        digitalWrite(LIGHT, LOW);
        digitalWrite(PUMP, LOW);
      }
  
    }
  }



  
  // put your main code here, to run repeatedly:
  bstate=digitalRead(BUTTON);
  if (bstate == HIGH) {
    Serial.print(bstate);
    Serial.println("BUTTON PRESSED");
    if (on == 0 || blinkTimeOn) {
      Serial.println("Start");
      on = 1;
      previousMillis = currentMillis;
      digitalWrite(LIGHT, HIGH);
      digitalWrite(PUMP, HIGH);
      blinkOn = false;
      blinkTimeOn = false;
    } else {
      Serial.println("Stopp");
      on = 0;
      digitalWrite(LIGHT, LOW);
      digitalWrite(PUMP, LOW);
      blinkTimeOn = false;
      blinkOn = false;
    }
    
    delay (500);
  }
}

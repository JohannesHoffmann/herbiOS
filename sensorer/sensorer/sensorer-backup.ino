// String inputString = "";  
// int PUMP=2;
// int FLOW=A5;

// int flowVal = 0; // Variable, die den gelesenen Wert speichert
// int pumpTime = 0;
// boolean pumping = false;
// boolean readNumber = false;
// boolean readNumberDone = false;
// int mlLimit = 100;
// float mlFactor = 1.4;

// // Waterlevel
// int trigger=4; //Trigger-Pin des Ultraschallsensors an Pin7 des Arduino-Boards 
// int echo=5; // Echo-Pim des Ultraschallsensors an Pin6 des Arduino-Boards 
// long dauer=0; // Das Wort dauer ist jetzt eine Variable, unter der die Zeit gespeichert wird, die eine Schallwelle bis zur Reflektion und zurück benötigt. Startwert ist hier 0.
// long entfernung=0; // Das Wort „entfernung“ ist jetzt die variable, unter der die berechnete Entfernung gespeichert wird. Info: Anstelle von „int“ steht hier vor den beiden Variablen „long“. Das hat den Vorteil, dass eine größere Zahl gespeichert werden kann. Nachteil: Die Variable benötigt mehr Platz im Speicher.

// void setup() {
//   // put your setup code here, to run once:
//   Serial.begin(9600);    // Serieller Monitor
  
//   pinMode(PUMP, OUTPUT);
//   digitalWrite(PUMP, HIGH);

//   pinMode(trigger, OUTPUT); 
//   pinMode(echo, INPUT); 
// }

// void loop() {
//   char b;
  
  
    
//    // Control over usb
//   if (Serial.available()) {
//     b = Serial.read();

//     if (b == ';') {
//       if (readNumber) {
//         readNumberDone = true;
//       } else {
//         inputString = "";
//       }
//     } else {
//       inputString += b; //makes the string readString
//     }

//     if (inputString == "water") {
//       inputString = "";

//       digitalWrite(trigger, LOW); 
//       delay(5); 
//       digitalWrite(trigger, HIGH); 
//       delay(10);
//       digitalWrite(trigger, LOW);
//       dauer = pulseIn(echo, HIGH); 
//       entfernung = (dauer/2) * 0.3432; 
//       if (entfernung >= 500 || entfernung <= 0) {
//         Serial.println("Kein Messwert"); 
//       } else {
//         //Serial.print("Water level: ");
//         Serial.print(entfernung); 
//         //Serial.println(" cm"); 
//       }
//     }

    
//     if (inputString == "start") {
//       readNumber = true;
//       inputString = "";
//       Serial.println("start");
//     }

//     // Read the number after start
//     if (readNumber && readNumberDone) {
//       mlLimit = inputString.toInt();
//       // Serial.println("mlLimit" + String(mlLimit));
//       readNumber = false;
//       readNumberDone = false;
//       inputString = "";
//       pump();
//     }
//   }




//   // Read signals from sensor
//   if (pumping) {
//      int val = analogRead(FLOW);
//      if (val > 1000) {
//         flowVal++;
//      }
//   }

//   // Stop pumping after 3000 msec.
//   if (pumpTime > 20000 || flowVal * mlFactor >= mlLimit) {
    
//     digitalWrite(PUMP, HIGH);
//     pumping = false;
//     // Serial.println("Ticks: " + String(flowVal));
//     // Serial.println("ML: " + String(flowVal * mlFactor));          // debug value
//     Serial.println("done");
//     pumpTime = 0;
//     flowVal = 0;
//     mlLimit = 100;
//   }

//   // Add time to pumping time
//   if (pumping) {
//     pumpTime += 10;
//   }
  
  

//   delay(10);
// }

// void pump() {
//   flowVal = 0;
//   digitalWrite(PUMP, LOW);
//   pumpTime = 0;
//   pumping = true;
// }

// int Proximity_PIN = D3;

// void setup() {
//   pinMode(Proximity_PIN, INPUT);
//     Serial.begin(9600);
// }

// void loop() {
//   int IR_rec_state = digitalRead(Proximity_PIN); 
//   Serial.println(IR_rec_state);
//   delay(3000);                                          
// }

void setup() {
  // Initialize GPIO 2 as an output
  pinMode(2, OUTPUT);
}

void loop() {
  // Turn the LED on
  digitalWrite(2, LOW);   
  delay(1000);                      
  
  // Turn the LED off
  digitalWrite(2, HIGH);    
  delay(1000);                      
}

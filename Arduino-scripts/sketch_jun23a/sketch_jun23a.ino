int Vibrator_Pin = D7;

void setup() {
  pinMode(Vibrator_Pin, OUTPUT);
    Serial.begin(9600);
}

void loop() {
  digitalWrite(Vibrator_Pin, HIGH); 
  Serial.println("Vibrating");
  delay(3000);                     

  digitalWrite(Vibrator_Pin, LOW);  
  delay(3000);                     
}
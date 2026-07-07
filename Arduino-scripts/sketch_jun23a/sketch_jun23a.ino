const int TiltSwitch = D1;
const int Buzzer_Pin = D7;
const int buzzerDuration = 200; // ms, how long the buzzer sounds

void setup() {
  pinMode(TiltSwitch, INPUT);
  pinMode(Buzzer_Pin, OUTPUT);
  digitalWrite(Buzzer_Pin, LOW);
  Serial.begin(9600);
}

void loop() {
  int tilt_state = digitalRead(TiltSwitch);

  if (tilt_state == HIGH) {   // adjust HIGH/LOW depending on your wiring
    Serial.println("TiltSwitch triggered");
    tone(Buzzer_Pin, 500, buzzerDuration);
  }

  delay(1000); // wait 1 second between checks/buzzes
}
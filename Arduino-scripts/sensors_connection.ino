// const int waitingTime = 100;
// int button_pin=D0;
// // int IR_transmitor_Pin=D1;
// int TiltSwitch=D1;
// int IR_reciever_Pin = D2;
// int Humidity_Pin = D3;

// void setup() {
//   // put your setup code here, to run once:

//   pinMode(button_pin, INPUT);
//   // pinMode(IR_transmitor_Pin, OUTPUT);
//     pinMode(TiltSwitch, INPUT);
//     pinMode(Humidity_Pin, INPUT);
//   pinMode(IR_reciever_Pin, INPUT);
//   Serial.begin(9600);
// }

// void loop() {
//   // put your main code here, to run repeatedly:
//   int button_state = digitalRead(button_pin);
//   int IR_rec_state = digitalRead(IR_reciever_Pin);
//   // digitalWrite(IR_transmitor_Pin, HIGH);
//   int tilt_state = digitalRead(TiltSwitch);
//   int humidity_state = digitalRead(Humidity_Pin);
//   if (button_state == HIGH) {
//     Serial.println(" high");
//   }
//   // Serial.println(IR_rec_state);
//   // Serial.println(tilt_state);
//   Serial.println(humidity_state);
//   // if (IR_rec_state == 1) {
//   //   Serial.println("IR reciever is working");
//   // }
//   // else {
//   //   Serial.println("not working");
//   // }
//   delay(waitingTime);
// }

#include <DHT.h>

const int waitingTime = 2000; // DHT11 needs ~1-2s between reads
int button_pin = D0;
int TiltSwitch = D1;
int IR_reciever_Pin = D2;
int Humidity_Pin = D5;

DHT dht(Humidity_Pin, DHT11); // initialize with pin and sensor type

void setup()
{
    pinMode(button_pin, INPUT);
    pinMode(TiltSwitch, INPUT);
    pinMode(IR_reciever_Pin, INPUT);
    Serial.begin(9600);

    dht.begin(); // replaces pinMode for the DHT pin
}

void loop()
{
    int button_state = digitalRead(button_pin);
    int IR_rec_state = digitalRead(IR_reciever_Pin);
    int tilt_state = digitalRead(TiltSwitch);

    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature(); // Celsius by default

    if (button_state == HIGH)
    {
        Serial.println("Button: HIGH");
    }

    // Always check if the read failed
    // if (isnan(humidity) || isnan(temperature)) {
    //   Serial.println("Failed to read from DHT11!");
    // } else {
    //   Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.print("%  Temp: ");
    Serial.print(temperature);
    Serial.println("°C");
    // }

    delay(waitingTime);
}
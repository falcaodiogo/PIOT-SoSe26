#include <DHT.h>

const int waitingTime = 2000; // DHT11 needs ~1-2s between reads
int button_pin = D0;
int TiltSwitch = D1;
int IR_reciever_Pin_1 = D2;
int IR_reciever_Pin_2 = D3;
int IR_reciever_Pin_3 = D4;
int Humidity_Pin = D5;

DHT dht(Humidity_Pin, DHT11); // initialize with pin and sensor type

void setup()
{
    pinMode(button_pin, INPUT);
    pinMode(TiltSwitch, INPUT);
    pinMode(IR_reciever_Pin_1, INPUT);
    pinMode(IR_reciever_Pin_2, INPUT);
    pinMode(IR_reciever_Pin_3, INPUT);
    Serial.begin(9600);

    dht.begin(); // replaces pinMode for the DHT pin
}

void loop()
{
    int button_state = digitalRead(button_pin);
    int IR_rec_state_1 = digitalRead(IR_reciever_Pin_1);
    int tilt_state = digitalRead(TiltSwitch);
    int IR_rec_state_2 = digitalRead(IR_reciever_Pin_2); 
    int IR_rec_state_3 = digitalRead(IR_reciever_Pin_3); 

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
    if (button_state == HIGH) {
        Serial.println("Button is pressed");
    }
    Serial.print(humidity);
    Serial.print("%  Temp: ");
    Serial.print(temperature);
    Serial.print("°C; ");
    Serial.print("IR 1: ");
    Serial.print(IR_rec_state_1);
    Serial.print("; IR 2: ");
    Serial.print(IR_rec_state_2);
    Serial.print("; IR 3: ");
    Serial.print(IR_rec_state_3);
    Serial.print("; Tilt state: ");
    Serial.print(tilt_state);
    Serial.println();
    // }

    delay(waitingTime);
}
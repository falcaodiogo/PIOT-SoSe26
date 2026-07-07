#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// WiFi & MQTT Configuration
const char* ssid = "Diogo's Pixel 9 Pro XL";
const char* password = "pixelzone";
const char* mqtt_server = "10.244.248.126"; 
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// Sensor & Pin Configuration
const int TiltSwitch = D1;
const int IR_reciever_Pin_1 = D2; // front
const int IR_reciever_Pin_2 = D3; // left or right
const int IR_reciever_Pin_3 = D4; // left or right
const int Humidity_Pin = D5;
const int Buzzer_Pin = D7;

DHT dht(Humidity_Pin, DHT11);

// Timers & State Variables
const int waitingTime = 1000; // Publish sensors every 1 second
unsigned long lastMsg = 0;

// SOS Simulation Timer
const unsigned long sosInterval = 120000; // 2 minutes in milliseconds (set to 10000 for faster testing)
unsigned long lastSOS = 0;

bool buzzerActive = false;
unsigned long buzzerStartTime = 0;
const unsigned long buzzerDuration = 100; // 100ms

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP-SmartCane-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600); 
  // Initialize Pins
  pinMode(TiltSwitch, INPUT);
  pinMode(IR_reciever_Pin_1, INPUT);
  pinMode(IR_reciever_Pin_2, INPUT);
  pinMode(IR_reciever_Pin_3, INPUT);
  pinMode(Buzzer_Pin, OUTPUT);
  digitalWrite(Buzzer_Pin, LOW);
  
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);

  randomSeed(micros());

  lastSOS = millis();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int ir1 = digitalRead(IR_reciever_Pin_1);
  int ir2 = digitalRead(IR_reciever_Pin_2);
  int ir3 = digitalRead(IR_reciever_Pin_3);

  if (!buzzerActive) {
  int beepCount = 0;
  int frequency = 0; 

  if (ir1 == LOW) {
    beepCount = 1;
    frequency = 500;
  } else if (ir2 == LOW) {
    beepCount = 2;
    frequency = 800;
  } else if (ir3 == LOW) {
    beepCount = 3;
    frequency = 1000;
  }

  if (beepCount > 0) {
    for (int i = 0; i < beepCount; i++) {
      tone(Buzzer_Pin, frequency, buzzerDuration);
      delay(buzzerDuration + 100);
    }

    buzzerStartTime = millis();
    buzzerActive = true;

    Serial.print("-> Sensor ");
    Serial.print(beepCount);
    Serial.println(" detected!");
  }
}

  if (buzzerActive && (millis() - buzzerStartTime >= buzzerDuration)) {
    digitalWrite(Buzzer_Pin, LOW);
    buzzerActive = false;
    Serial.println("-> Buzzer turning off.");
  }

  unsigned long now = millis();

  // Sensor Reading & Publishing (every 1s)
  if (now - lastMsg > waitingTime) {
    lastMsg = now;

    int tilt_state = digitalRead(TiltSwitch);
    int IR_rec_state_1 = digitalRead(IR_reciever_Pin_1);
    int IR_rec_state_2 = digitalRead(IR_reciever_Pin_2); 
    int IR_rec_state_3 = digitalRead(IR_reciever_Pin_3); 
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT11!");
      humidity = 0.0;
      temperature = 0.0;
    }

    String payload = "{";
    payload += "\"status\":\"ACTIVE\",";
    payload += "\"temperature\":" + String(temperature) + ",";
    payload += "\"humidity\":" + String(humidity) + ",";
    payload += "\"tilt\":" + String(tilt_state) + ",";
    payload += "\"ir1\":" + String(IR_rec_state_1) + ",";
    payload += "\"ir2\":" + String(IR_rec_state_2) + ",";
    payload += "\"ir3\":" + String(IR_rec_state_3);
    payload += "}";

    Serial.print("Publishing: ");
    Serial.println(payload);

    client.publish("smartcane/sensors", payload.c_str());
  }

  // Simulated Fall / SOS Alert (every 2 minutes)
  if (now - lastSOS > sosInterval) {
    lastSOS = now;

    String sosPayload = "{\"event\":\"FALL_DETECTED\",\"timestamp\":" + String(now) + "}";

    Serial.print("Publishing SOS: ");
    Serial.println(sosPayload);

    client.publish("smartcane/sos", sosPayload.c_str());
  }
}
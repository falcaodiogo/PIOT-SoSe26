#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// --- WiFi & MQTT Configuration ---
const char* ssid = "Diogo's Pixel 9 Pro XL";
const char* password = "pixelzone";
const char* mqtt_server = "172.29.192.126"; 
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// --- Sensor & Pin Configuration ---
const int button_pin = D0;
const int TiltSwitch = D1;
const int IR_reciever_Pin_1 = D2;
const int IR_reciever_Pin_2 = D3;
const int IR_reciever_Pin_3 = D4;
const int Humidity_Pin = D5;

DHT dht(Humidity_Pin, DHT11);

// --- Timers & State Variables ---
const int waitingTime = 2000; // Publish sensors every 2 seconds
unsigned long lastMsg = 0;

// Button debounce variables
int lastButtonState = LOW;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50; // 50ms debounce to prevent flickering

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
  Serial.begin(115200); 
  
  // Initialize Pins
  pinMode(button_pin, INPUT);
  pinMode(TiltSwitch, INPUT);
  pinMode(IR_reciever_Pin_1, INPUT);
  pinMode(IR_reciever_Pin_2, INPUT);
  pinMode(IR_reciever_Pin_3, INPUT);
  
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // Keep MQTT connection alive

  // --- SOS Button Logic (Debounced & Instant) ---
  int reading = digitalRead(button_pin);
  
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // If the button is pressed (transitions from LOW to HIGH)
    if (reading == HIGH && lastButtonState == LOW) {
      
      Serial.println("*** SOS BUTTON PRESSED! ***");
      
      // Publish an immediate SOS alert to a dedicated topic
      String sosPayload = "{\"alert\": \"SOS_TRIGGERED\", \"message\": \"Immediate assistance needed!\"}";
      client.publish("smartcane/sos", sosPayload.c_str());
    }
  }
  lastButtonState = reading; // Save reading for next loop

  // --- Sensor Reading & Publishing ---
  unsigned long now = millis();
  
  // Sensors run continuously every 2 seconds
  if (now - lastMsg > waitingTime) {
    lastMsg = now;

    // Read Sensors
    int tilt_state = digitalRead(TiltSwitch);
    int IR_rec_state_1 = digitalRead(IR_reciever_Pin_1);
    int IR_rec_state_2 = digitalRead(IR_reciever_Pin_2); 
    int IR_rec_state_3 = digitalRead(IR_reciever_Pin_3); 
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    // Check if DHT readings are valid
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT11!");
      humidity = 0.0;
      temperature = 0.0;
    }

    // Format as JSON for the frontend
    String payload = "{";
    payload += "\"status\":\"ACTIVE\",";
    payload += "\"temperature\":" + String(temperature) + ",";
    payload += "\"humidity\":" + String(humidity) + ",";
    payload += "\"tilt\":" + String(tilt_state) + ",";
    payload += "\"ir1\":" + String(IR_rec_state_1) + ",";
    payload += "\"ir2\":" + String(IR_rec_state_2) + ",";
    payload += "\"ir3\":" + String(IR_rec_state_3);
    payload += "}";

    // Print to Serial for debugging
    Serial.print("Publishing: ");
    Serial.println(payload);

    // Publish to MQTT
    client.publish("smartcane/sensors", payload.c_str());
  }
}
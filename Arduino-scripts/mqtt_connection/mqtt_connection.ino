#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// --- Configuration ---
const char* ssid = "Diogo's Pixel 9 Pro XL";
const char* password = "pixelzone";

// The local IP address of your computer running Docker
const char* mqtt_server = "172.29.192.126"; 
const int mqtt_port = 1883; // Standard MQTT port

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;

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

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    // Attempt to connect (Anonymous connection)
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
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  // Publish a message every 5 seconds
  if (now - lastMsg > 5000) {
    lastMsg = now;
    
    String payload = "Hello from ESP32! Uptime: " + String(now / 1000) + "s";
    
    Serial.print("Publishing message: ");
    Serial.println(payload);
    
    // Publish to the topic we subscribed to in Next.js
    client.publish("smartcane/test", payload.c_str());
  }
}
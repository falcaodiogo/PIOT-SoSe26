# PIOT-SoSe26

Prototyping the Internet of Things - SoSe26

## Resources

* Figma Board: [https://www.figma.com/board/oWgqCrBbSijskJbNGyEHss/PIOT?node-id=0-1&t=6yEgtleKUg5kRUko-1](https://www.figma.com/board/oWgqCrBbSijskJbNGyEHss/PIOT?node-id=0-1&t=6yEgtleKUg5kRUko-1)

## Hardware & Sensors

* Passive buzzer module
* LEDs
* 4-5 vibration motors (requires transistor or motor driver)
* Obstacle detector / IR sensor receiver + IR sensor transmitter
* Water/humidity detector
* Tilt switch
* Vibration sensor (shock sensor)
* Push button

## Notes

Phase 1: The Software Infrastructure
Start with what you know. Building the backend first gives your hardware a place to send data as soon as you plug it in.
Set Up Docker & MQTT: Spin up an Eclipse Mosquitto image on Docker. It is lightweight, reliable, and the industry standard for IoT messaging. Configure it to accept anonymous connections locally to keep prototyping simple.
Bootstrap the Web App: Initialize your React TypeScript project. Use a library like mqtt.js to connect the web app to your broker. Set up a simple UI that subscribes to a test topic and prints any incoming messages to the screen.

Phase 2: ESP32 Cloud Connection
Before wiring any sensors, prove that your microcontroller can talk to your web app.
Connect to Wi-Fi: Write a script to connect the ESP32 to your local network.

Phase 3: Breadboard Prototyping

Digital Inputs: ilt switch

Analog Inputs (Water & Obstacles): water/humidity detector and obstacle detector

Basic Outputs (Buzzer): Wire up the passive buzzer. Write logic on the ESP32 to turn them on when the shock sensor is triggered

Phase 4: Integration and Fabrication
Once the individual components work on the breadboard, it is time to bring it all together

3D Printed Enclosures: To move from a messy breadboard to a sleek prototype, you can design custom housings. Leverage your experience in Fusion 360 to model compartments for the ESP32, battery, and sensors, and prep them in PrusaSlicer so they mount securely to the physical cane.

MISS: crimping, materials used (PETG instead of PLA)


Features: 
-> Smart cane with 6 sensors
-> Beggining at the bottom -> humidity and temperature sensor to sense wet and slippery floor -> 3 infrared sensors to mesure closeness to objects and warn the user trough the buzzer. Each direction has a different frequency and number of beeps -> tilti switch to sense falls with an alghoritm. LIMITATION (algorithm is sensing if there are movements every 30 seconds. If not, it will give an SOS signal to our webapp. -> webapp we can see every data of the sensors including the SOS signal with the 112 shourctut for like a caretacker of this person.

idea, techinique, presentation

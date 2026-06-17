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

## Project Phases

*Note: These phases serve as a general guideline and may be adapted as the project progresses.*

**Phase 1: Software Infrastructure**

* Set up an Eclipse Mosquitto MQTT broker via Docker.
* Initialize a React TypeScript web app and connect it to the broker using mqtt.js to read incoming data.

**Phase 2: ESP32 Cloud Connection**

* Flash the ESP32 using Arduino IDE or PlatformIO.
* Connect the microcontroller to the local Wi-Fi.
* Publish a test message loop to the MQTT broker to verify the backend and frontend connection.

**Phase 3: Breadboard Prototyping**

* Test all components individually on a breadboard.
* **Digital Inputs:** Read states from the button, tilt switch, and vibration sensor, publishing MQTT messages on trigger.
* **Analog Inputs:** Read and visualize value ranges from the water and obstacle detectors.
* **Outputs:** Code the ESP32 to trigger the LEDs and buzzer based on sensor states.
* **Safety Note:** Do not drive the vibration motors directly from the ESP32 pins. Use a transistor (like NPN 2N2222) or motor driver module to handle the power draw safely.

**Phase 4: Integration and Fabrication**

* **Logic Integration:** Combine component code into a unified "Smart Cane" system (e.g., mapping simultaneous tilt and shock triggers to an "EMERGENCY_FALL" MQTT payload, flashing LEDs, and sounding the buzzer).
* **Fabrication:** Design custom housings in Fusion 360 for the ESP32, battery, and sensors, and prepare them in PrusaSlicer for mounting to the physical cane.

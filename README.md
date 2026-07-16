# PIOT-SoSe26

Prototyping the Internet of Things - SoSe26

## Resources

- **Figma Board:** [Figma Link](https://www.figma.com/board/oWgqCrBbSijskJbNGyEHss/PIOT?node-id=0-1&t=6yEgtleKUg5kRUko-1)

## Hardware & Sensors

- **Microcontroller:** ESP32
- **Audio Feedback:** Passive buzzer module (KY-006)
- **Obstacle Detection:** IR sensor receiver + IR sensor transmitter (KY-032 obstacle avoidance sensors x3)
- **Wet Floor Detection:** Water/humidity detector (KY-015 temperature/humidity sensor)
- **Fall Detection:** Tilt switch (KY-017)

## Project Overview

The **Smart IoT Cane** is an assistive technology prototype designed to improve mobility safety for a wide target audience, including seniors, individuals with neurological conditions, and people recovering from surgery or trauma.

The system collects environmental telemetry from sensors integrated into a custom 3D-printed cane. This data is processed by an ESP32 microcontroller and published over Wi-Fi to a Docker-hosted Eclipse Mosquitto MQTT broker. A Next.js web application subscribes to the broker via WebSockets, giving caregivers a real-time monitoring dashboard and instant visual alerts in the event of an emergency.

### Features

- **Directional Obstacle Detection:** Three KY-032 IR sensors monitor the front, left, and right zones.
- **Acoustic Feedback:** The buzzer emits unique sound patterns (frequency and beep counts) depending on which side detects an obstacle.
- **Fall Detection & SOS System:** A horizontal orientation triggers a 30-second countdown. If the cane is not returned upright, an SOS state is sent to the web application, locking the UI with emergency controls.
- **Wet Surface Detection:** A low-mounted humidity sensor detects moisture levels to warn users of slippery surfaces.
- **Caregiver Dashboard:** A responsive web application utilizing WebSockets to push live data logs, telemetry cards, and immediate alarm states.

## System Architecture

```
                ┌─────────────────┐
                │   Smart Cane    │
                │  (ESP32 + Pins) │
                └────────┬────────┘
                         │ (Wi-Fi / MQTT Port 1883)
                         ▼
            ┌─────────────────────────┐
            │ Docker Container        │
            │ ┌─────────────────────┐ │
            │ │  Eclipse Mosquitto  │ │
            │ │     MQTT Broker     │ │
            │ └──────────┬──────────┘ │
            └────────────┼────────────┘
                         │ (WebSockets Port 9001)
                         ▼
            ┌─────────────────────────┐
            │ Next.js Web Dashboard   │
            │   (React / TypeScript)  │
            └─────────────────────────┘

```

The data flow operates across three primary tiers:

1. **Firmware (C/C++):** Built in the Arduino IDE to poll digital and analog sensors every second, format states into JSON, and publish to the broker.
2. **Message Broker:** Eclipse Mosquitto hosted inside Docker to route telemetry messages on the `smartcane/sensors` and `smartcane/sos` topics.
3. **Web Frontend:** A React web portal powered by the Bun runtime, displaying live-updating telemetry and emergency trigger actions.

## Hardware Design & Pinout

### Component Placement

- **KY-015 (Humidity):** Positioned near the bottom tip to stay closest to ground-level wetness.
- **KY-032 (IR Array):** Set right above the moisture sensor, angled Left, Front, and Right.
- **ESP32:** Secured in the central section of the cane body.
- **KY-006 (Buzzer) & KY-017 (Tilt Switch):** Positioned in the upper region near the handle.

### GPIO Pin Map (ESP8266/ESP32 equivalent)

| Sensor                 | Pin Assign | Description                       |
| :--------------------- | :--------- | :-------------------------------- |
| **KY-017 Tilt Switch** | `D1`       | Horizontal orientation monitoring |
| **KY-032 Front IR**    | `D2`       | Obstacle sensing (Front)          |
| **KY-032 Left IR**     | `D3`       | Obstacle sensing (Left)           |
| **KY-032 Right IR**    | `D4`       | Obstacle sensing (Right)          |
| **KY-015 Humidity**    | `D5`       | Ambient humidity levels           |
| **KY-006 Buzzer**      | `D7`       | Audio signal generator            |

### 3D Fabrications

The modular mechanical structure of the cane was drawn in **Autodesk Fusion 360** with a hollow center to route internal wiring. All parts were sliced in **PrusaSlicer** and fabricated out of **PETG** on a _Prusa Core One_ printer for superior impact resistance, thermal limits, and durability over standard PLA.

## Software Implementation Details

### Buzzer Frequency Maps

To ensure the user can intuitively navigate around obstacles, the active buzzer plays distinct tones:

- **Front Obstacle:** 1 Beep at `500 Hz`
- **Right Obstacle:** 2 Beeps at `800 Hz`
- **Left Obstacle:** 3 Beeps at `1000 Hz`

### Fall Detection Algorithm

```python
IF TiltSwitch == HIGH (Cane is horizontal)
    Start 30-second Timer
    WHILE Timer < 30 seconds
        IF TiltSwitch == LOW (Cane is upright again)
            Cancel Alarm
            EXIT

    # If timer expires without upright correction:
    Publish SOS Event to MQTT ("smartcane/sos")
    Trigger Emergency UI State on Web Dashboard
```

## Development Setup

### Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Bun](https://bun.sh/) runtime (for frontend development)
- [Arduino IDE](https://www.arduino.cc/en/software) (for ESP32 flashing)

### Running the Infrastructure Locally

1. Clone the repository:

```
git clone [https://github.com/falcaodiogo/PIOT-SoSe26.git](https://github.com/falcaodiogo/PIOT-SoSe26.git)
cd PIOT-SoSe26

```

2. Launch the Mosquitto broker and Next.js frontend containers:

```bash
docker-compose up --build
```

3. Open `http://localhost:3000` on your web browser to view the live dashboard.

## Authors

- **Diogo Falcão** (N°1926316)

- **Ammar Shahzad** (N°1808919)

Developed as part of the **Prototyping in the Internet of Things** course (SoSe 2026) at the **University of Siegen**.

// Analog Sensor (e.g., an ultrasonic distance sensor), send:

// JSON
// {
//   "id": "sensor-1", 
//   "type": "analog",
//   "value": "45 cm",
//   "badgeType": "warning"
// }
// Digital Input (e.g., a push button), send:

// JSON
// {
//   "id": "input-1", 
//   "type": "digital",
//   "value": "ON",
//   "status": "active"
// }

export const mockData = {
  connection: {
    device: "ESP32-S3 · MQTT",
    broker: "broker.local:1883",
  },
  digitalInputs: [
    {
      id: "power",
      label: "Power Button",
      state: "ON",
      active: true,
      icon: "Power",
    },
    {
      id: "sos",
      label: "SOS Button",
      state: "STANDBY",
      active: false,
      icon: "AlertTriangle",
    },
    {
      id: "tilt",
      label: "Tilt Switch",
      state: "UPRIGHT",
      active: false,
      icon: "RotateCcw",
    },
    {
      id: "shock",
      label: "Shock Sensor",
      state: "STABLE",
      active: false,
      icon: "Zap",
    },
  ],
  analogSensors: [
    {
      id: "water",
      label: "WATER",
      value: "8",
      unit: "%",
      badgeText: "CLEAR",
      badgeType: "success",
      icon: "Droplets",
    },
    {
      id: "humidity",
      label: "HUMIDITY",
      value: "37",
      unit: "%",
      badgeText: "NORMAL",
      badgeType: "success",
      icon: "Activity",
    },
    {
      id: "obstacle",
      label: "OBSTACLE",
      value: "119",
      unit: "cm",
      badgeText: "CLEAR",
      badgeType: "success",
      icon: "Target",
    },
    {
      id: "ice",
      label: "ICE RISK",
      value: "LOW",
      unit: "",
      badgeText: "SAFE",
      badgeType: "success",
      icon: "Shield",
    },
  ],
};

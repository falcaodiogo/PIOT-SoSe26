"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { Wifi, Database, Activity } from "lucide-react";
import DigitalInputCard from "./components/DigitalInputCard";
import AnalogSensorCard from "./components/AnalogSensorCard";

// Define the exact shape of your incoming MQTT payload
interface SensorPayload {
  status: string;
  temperature: number;
  humidity: number;
  tilt: number;
  ir1: number;
  ir2: number;
  ir3: number;
}

export default function Home() {
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [currentTime, setCurrentTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const [sensorData, setSensorData] = useState<SensorPayload | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Hardcoded to your specific MQTT broker IP
    const client = mqtt.connect("ws://172.29.192.126:9001");

    client.on("connect", () => {
      setConnectionStatus("Connected");
      client.subscribe("smartcane/sensors", (err) => {
        if (!err) console.log("Subscribed to smartcane/sensors");
      });
    });

    client.on("message", (topic, message) => {
      const payload = message.toString();

      // Update raw message stream
      const entry = {
        id: `${Date.now()}-${Math.random()}`,
        text: `[${topic}] ${payload}`,
      };
      setMessages((prev) => [...prev.slice(-49), entry]);

      // Parse and update real-time sensor state
      try {
        const data = JSON.parse(payload);
        if (data && typeof data === "object") {
          setSensorData(data);
        }
      } catch (err) {
        console.error("Failed to parse incoming payload:", err);
      }
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      setConnectionStatus("Error");
      client.end();
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  if (!mounted) return null;

  // Map the exact payload variables to your digital inputs
  const digitalInputs = sensorData
    ? [
        {
          id: "tilt",
          name: "Tilt Sensor",
          value: sensorData.tilt,
          status: sensorData.tilt === 1 ? "Alert" : "Normal",
          active: sensorData.tilt === 1,
        },
        {
          id: "ir1",
          name: "IR Sensor 1",
          value: sensorData.ir1,
          status: sensorData.ir1 === 1 ? "Detecting" : "Clear",
          active: sensorData.ir1 === 1,
        },
        {
          id: "ir2",
          name: "IR Sensor 2",
          value: sensorData.ir2,
          status: sensorData.ir2 === 1 ? "Detecting" : "Clear",
          active: sensorData.ir2 === 1,
        },
        {
          id: "ir3",
          name: "IR Sensor 3",
          value: sensorData.ir3,
          status: sensorData.ir3 === 1 ? "Detecting" : "Clear",
          active: sensorData.ir3 === 1,
        },
      ]
    : [];

  // Map and format the exact payload variables to your analog sensors
  const analogSensors = sensorData
    ? [
        {
          id: "temperature",
          name: "Temperature",
          value: sensorData.temperature.toFixed(1), // Formats 30.60 to 30.6
          unit: "°C",
          badgeType: sensorData.temperature > 35 ? "danger" : "success",
        },
        {
          id: "humidity",
          name: "Humidity",
          value: sensorData.humidity.toFixed(1), // Formats 54.10 to 54.1
          unit: "%",
          badgeType: "success",
        },
      ]
    : [];

  const isSystemOff = sensorData?.status === "OFF";

  return (
    <main className="max-w-7xl mx-auto w-full min-h-screen p-6 md:p-10 lg:p-12 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-3">
            Smart Cane Dashboard
          </h1>
          <div className="flex items-center gap-4 text-xs md:text-sm font-semibold tracking-wider uppercase text-zinc-500">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${connectionStatus === "Connected" ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {connectionStatus}
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${!sensorData ? "bg-zinc-300" : isSystemOff ? "bg-zinc-500" : "bg-blue-500"}`}
              />
              {!sensorData ? "AWAITING DATA" : `SYSTEM ${sensorData.status}`}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between mb-10 shadow-sm gap-4">
        <div className="flex items-center gap-4 md:gap-5">
          <Wifi
            className={`w-7 h-7 md:w-8 md:h-8 ${connectionStatus === "Connected" ? "text-emerald-500" : "text-zinc-400"}`}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm md:text-base">
              SmartCane ESP32 Node
            </span>
            <span className="text-xs md:text-sm text-zinc-500 font-mono mt-0.5">
              ws://172.29.192.126:9001
            </span>
          </div>
        </div>
        <span className="text-xs md:text-sm text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-md w-fit">
          {currentTime}
        </span>
      </div>

      {!sensorData ? (
        <div className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl mb-10 text-zinc-400">
          <Activity className="w-12 h-12 mb-4 opacity-50 animate-pulse" />
          <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-300">
            Awaiting Telemetry
          </h2>
          <p className="text-sm mt-1">
            Ensure the physical button on the ESP32 is toggled ON.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-10 ${isSystemOff ? "opacity-50 grayscale transition-all duration-500" : "transition-all duration-500"}`}
        >
          <section className="lg:col-span-5 xl:col-span-4">
            <h2 className="text-xs md:text-sm font-semibold tracking-widest text-zinc-400 mb-4 uppercase">
              Digital Obstacle Sensors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
              {digitalInputs.map((input) => (
                <DigitalInputCard
                  key={input.id}
                  label={input.name}
                  state={input.status}
                  active={input.active}
                  iconName={""}
                  {...input}
                />
              ))}
            </div>
          </section>

          <section className="lg:col-span-7 xl:col-span-8">
            <h2 className="text-xs md:text-sm font-semibold tracking-widest text-zinc-400 mb-4 uppercase">
              Environment Data
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {analogSensors.map((sensor) => (
                <AnalogSensorCard
                  key={sensor.id}
                  label={sensor.name}
                  badgeText={sensor.value}
                  iconName={""}
                  {...sensor}
                  badgeType={
                    sensor.badgeType as "success" | "warning" | "danger"
                  }
                />
              ))}
            </div>
          </section>
        </div>
      )}

      <section className="mt-10 md:mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xs md:text-sm font-semibold tracking-widest text-zinc-400 mb-4 uppercase flex items-center gap-2">
          <Database className="w-4 h-4" /> Raw Payload Log
        </h3>
        <div className="bg-zinc-100 dark:bg-zinc-900 p-4 md:p-6 rounded-xl h-[300px] md:h-[400px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 text-xs md:text-sm font-mono shadow-inner flex flex-col-reverse">
          {messages.length === 0 ? (
            <p className="text-zinc-500 italic h-full flex items-center justify-center">
              Waiting for hardware data...
            </p>
          ) : (
            <ul className="space-y-1.5 md:space-y-2">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className="text-zinc-700 dark:text-zinc-300 break-all border-b border-zinc-200 dark:border-zinc-800/50 pb-1"
                >
                  {msg.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

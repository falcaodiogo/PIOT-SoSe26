"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    // Connect to the Mosquitto broker over WebSockets
    const client = mqtt.connect("ws://localhost:9001");

    client.on("connect", () => {
      setConnectionStatus("Connected");
      // Subscribe to the test topic Phase 2 will use
      client.subscribe("smartcane/test", (err) => {
        if (!err) console.log("Subscribed to smartcane/test");
      });
    });

    client.on("message", (topic, message) => {
      const payload = message.toString();
      setMessages((prev) => [...prev, `[${topic}] ${payload}`]);
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      client.end();
    });

    // Cleanup connection on unmount
    return () => {
      if (client) client.end();
    };
  }, []);

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">IoT Data Pipeline</h1>

      <div className="mb-6 flex items-center gap-2">
        <span className="font-semibold">Broker Status:</span>
        <span
          className={`px-2 py-1 rounded text-sm text-white ${
            connectionStatus === "Connected" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {connectionStatus}
        </span>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg min-h-75 border border-gray-300">
        <h2 className="text-lg text-black font-semibold mb-3">Incoming Messages</h2>
        {messages.length === 0 ? (
          <p className="text-black italic">Waiting for hardware data...</p>
        ) : (
          <ul className="space-y-2 text-black">
            {messages.map((msg) => (
              <li
                key={msg}
                className="font-mono bg-white p-2 border rounded shadow-sm"
              >
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

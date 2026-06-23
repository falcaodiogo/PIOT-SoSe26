"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { Wifi } from "lucide-react";
import { mockData } from "./data/mockSensorData";
import DigitalInputCard from "./components/DigitalInputCard";
import AnalogSensorCard from "./components/AnalogSensorCard";

export default function Home() {
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [currentTime, setCurrentTime] = useState("");
  const [mounted, setMounted] = useState(false);

  const [digitalInputs, setDigitalInputs] = useState(mockData.digitalInputs);
  const [analogSensors, setAnalogSensors] = useState(mockData.analogSensors);

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
    const client = mqtt.connect("ws://localhost:9001");

    client.on("connect", () => {
      setConnectionStatus("Connected");
      client.subscribe("smartcane/test", (err) => {
        if (!err) console.log("Subscribed to smartcane/test");
      });
    });

    client.on("message", (topic, message) => {
      const payload = message.toString();

      const entry = {
        id: `${Date.now()}-${Math.random()}`,
        text: `[${topic}] ${payload}`,
      };
      setMessages((prev) => [...prev, entry]);

      try {
        const data = JSON.parse(payload);

        if (data.type === "digital") {
          setDigitalInputs((prev) =>
            prev.map((sensor) =>
              sensor.id === data.id
                ? { ...sensor, value: data.value, status: data.status }
                : sensor,
            ),
          );
        }

        if (data.type === "analog") {
          setAnalogSensors((prev) =>
            prev.map((sensor) =>
              sensor.id === data.id
                ? { ...sensor, value: data.value, badgeType: data.badgeType }
                : sensor,
            ),
          );
        }
      } catch (err) {
        console.error("Failed to parse incoming payload:", err);
      }
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      client.end();
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  if (!mounted) return null;

  return (
    <main className="max-w-7xl mx-auto w-full min-h-screen p-6 md:p-10 lg:p-12 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-3">
            Smart Cane - PIOT Project
          </h1>
          <div className="flex items-center gap-4 text-xs md:text-sm font-semibold tracking-wider uppercase text-zinc-500">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${connectionStatus === "Connected" ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {connectionStatus}
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-500" />
              ACTIVE
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
              SmartCane ESP32
            </span>
            <span className="text-xs md:text-sm text-zinc-500 font-mono mt-0.5">
              ws://localhost:9001
            </span>
          </div>
        </div>
        <span className="text-xs md:text-sm text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-md w-fit">
          {currentTime}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-10">
        <section className="lg:col-span-5 xl:col-span-4">
          <h2 className="text-xs md:text-sm font-semibold tracking-widest text-zinc-400 mb-4 uppercase">
            Digital Inputs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
            {digitalInputs.map((input) => (
              <DigitalInputCard iconName={""} key={input.id} {...input} />
            ))}
          </div>
        </section>

        <section className="lg:col-span-7 xl:col-span-8">
          <h2 className="text-xs md:text-sm font-semibold tracking-widest text-zinc-400 mb-4 uppercase">
            Analog Sensors
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {analogSensors.map((sensor) => (
              <AnalogSensorCard
                iconName={""}
                key={sensor.id}
                {...sensor}
                badgeType={sensor.badgeType as "success" | "warning" | "danger"}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10 md:mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xs md:text-sm font-semibold tracking-widest text-zinc-400 mb-4 uppercase">
          Raw MQTT Stream
        </h3>
        <div className="bg-zinc-100 dark:bg-zinc-900 p-4 md:p-6 rounded-xl h-[300px] md:h-[400px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 text-xs md:text-sm font-mono shadow-inner">
          {messages.length === 0 ? (
            <p className="text-zinc-500 italic">Waiting for hardware data...</p>
          ) : (
            <ul className="space-y-1.5 md:space-y-2">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className="text-zinc-700 dark:text-zinc-300 break-all"
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

// "use client";

// import { useEffect, useState } from "react";
// import mqtt from "mqtt";

// export default function Home() {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [connectionStatus, setConnectionStatus] = useState("Disconnected");

//   useEffect(() => {
//     // Connect to the Mosquitto broker over WebSockets
//     const client = mqtt.connect("ws://localhost:9001");

//     client.on("connect", () => {
//       setConnectionStatus("Connected");
//       // Subscribe to the test topic Phase 2 will use
//       client.subscribe("smartcane/test", (err) => {
//         if (!err) console.log("Subscribed to smartcane/test");
//       });
//     });

//     client.on("message", (topic, message) => {
//       const payload = message.toString();
//       setMessages((prev) => [...prev, `[${topic}] ${payload}`]);
//     });

//     client.on("error", (err) => {
//       console.error("Connection error: ", err);
//       client.end();
//     });

//     // Cleanup connection on unmount
//     return () => {
//       if (client) client.end();
//     };
//   }, []);

//   return (
//     <main className="p-8 font-sans">
//       <h1 className="text-2xl font-bold mb-4">IoT Data Pipeline</h1>

//       <div className="mb-6 flex items-center gap-2">
//         <span className="font-semibold">Broker Status:</span>
//         <span
//           className={`px-2 py-1 rounded text-sm text-white ${
//             connectionStatus === "Connected" ? "bg-green-600" : "bg-red-600"
//           }`}
//         >
//           {connectionStatus}
//         </span>
//       </div>

//       <div className="bg-gray-100 p-4 rounded-lg min-h-75 border border-gray-300">
//         <h2 className="text-lg text-black font-semibold mb-3">Incoming Messages</h2>
//         {messages.length === 0 ? (
//           <p className="text-black italic">Waiting for hardware data...</p>
//         ) : (
//           <ul className="space-y-2 text-black">
//             {messages.map((msg) => (
//               <li
//                 key={msg}
//                 className="font-mono bg-white p-2 border rounded shadow-sm"
//               >
//                 {msg}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </main>
//   );
// }

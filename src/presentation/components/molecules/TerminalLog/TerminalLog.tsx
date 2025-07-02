import React, { useState, useEffect } from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { useTemperature, useHumidity, useFan, useIsConnected } from "../../../../app/store/dashboardStore";
import { formatTimestamp } from "../../../../shared/utils/formatters";
interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: "info" | "warning" | "error";
}

export const TerminalLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const temperature = useTemperature();
  const humidity = useHumidity();
  const fan = useFan();
  const isConnected = useIsConnected();

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: `${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      message,
      type,
    };
    setLogs((prev) => [...prev.slice(-19), newLog]); // Keep last 20 logs
  };

  useEffect(() => {
    addLog("System started...", "info");
  }, []);

  useEffect(() => {
    if (isConnected) {
      addLog("ESP32 connected", "info");
    } else {
      addLog("ESP32 disconnected", "warning");
    }
  }, [isConnected]);

  useEffect(() => {
    if (temperature) {
      addLog(`Temperature: ${temperature.toCelsius().toFixed(1)}°C`, "info");
    }
  }, [temperature]);

  useEffect(() => {
    if (humidity) {
      addLog(`Humidity: ${humidity.value.toFixed(1)}%`, "info");
    }
  }, [humidity]);

  useEffect(() => {
    if (fan) {
      addLog(`Fan: ${fan.isOn() ? "ON" : "OFF"}`, "info");
    }
  }, [fan]);

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Terminal</h3>
      <div className="bg-black rounded p-4 h-32 overflow-y-auto">
        <div className="text-xs font-mono space-y-1">
          {logs.map((log) => (
            <div key={log.id} className={getLogColor(log.type)}>
              [{formatTimestamp(log.timestamp)}] {log.message}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

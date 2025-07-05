import React, { useState, useEffect } from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { useTemperature, useHumidity, useFan, useIsConnected } from "../../../../app/store/dashboardStore";
import { formatTimestamp } from "../../../../shared/utils/formatters";

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

export const TerminalLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
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
    setLogs((prev) => [...prev.slice(-24), newLog]); // Keep last 25 logs
  };

  useEffect(() => {
    addLog("🚀 System initialized successfully", "success");
    addLog("📡 Starting sensor monitoring...", "info");
  }, []);

  useEffect(() => {
    if (isConnected) {
      addLog("✅ ESP32 connection established", "success");
    } else {
      addLog("⚠️ ESP32 connection lost", "warning");
    }
  }, [isConnected]);

  useEffect(() => {
    if (temperature) {
      const temp = temperature.toCelsius().toFixed(1);
      addLog(`🌡️ Temperature reading: ${temp}°C`, "info");
    }
  }, [temperature]);

  useEffect(() => {
    if (humidity) {
      const hum = humidity.value.toFixed(1);
      addLog(`💧 Humidity reading: ${hum}%`, "info");
    }
  }, [humidity]);

  useEffect(() => {
    if (fan) {
      addLog(`🌀 Fan status: ${fan.isOn() ? "STARTED" : "STOPPED"}`, fan.isOn() ? "success" : "warning");
    }
  }, [fan]);

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "success":
        return "text-green-400";
      default:
        return "text-cyan-400";
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("🧹 Terminal cleared", "info");
  };

  return (
    <Card variant="elevated" rounded="xl" shadow="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
              <span className="text-2xl">💻</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">System Terminal</h3>
              <p className="text-sm text-slate-400">Live system logs</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className={`p-2 rounded-lg text-xs transition-colors ${
                isAutoScroll 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              Auto
            </button>
            <button
              onClick={clearLogs}
              className="p-2 rounded-lg text-xs bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              Clear
            </button>
            {/* Traffic lights */}
            <div className="flex gap-1 ml-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Terminal */}
        <div className="relative">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 h-40 overflow-y-auto border border-green-500/30">
            <div className="text-xs font-mono space-y-1">
              {logs.map((log) => (
                <div key={log.id} className={`${getLogColor(log.type)} hover:bg-white/5 px-2 py-0.5 rounded transition-colors`}>
                  <span className="text-slate-500">[{formatTimestamp(log.timestamp)}]</span>{" "}
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scrollbar indicator */}
          <div className="absolute right-2 top-2 bottom-2 w-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="w-full bg-green-500 rounded-full transition-all duration-300" style={{ height: '20%' }} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
          <span>{logs.length} entries</span>
          <span>Auto-scroll: {isAutoScroll ? 'ON' : 'OFF'}</span>
        </div>
      </div>
    </Card>
  );
};
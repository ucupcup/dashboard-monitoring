import React, { useState, useEffect } from "react";
import { MonitoringPanel } from "../MonitoringPanel/MonitoringPanel";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { FanController } from "../../molecules/FanController/FanControl";
import { StatusIndicator } from "../../molecules/StatusIndicator/StatusIndicator";
import { TerminalLog } from "../../molecules/TerminalLog/TerminalLog";
import { DebugPanel } from "../../molecules/DebugPanel/DebugPanel";
import { useTemperatureData } from "../../../../app/hooks/useTemperatureData";
import { useWebSocket } from "../../../../app/hooks/useWebSocket";
import { useAutoFanControl } from "../../../../app/hooks/useAutoFanControl";
import {
  useError,
  useIsLoading,
  useIsConnected,
  useTemperature,
  useHumidity,
} from "../../../../app/store/dashboardStore";
import { useDashboardStore } from "../../../../app/store/dashboardStore";
import type { LoginDTO } from "../../../../app/hooks/useAuth";

export const Dashboard: React.FC = () => {
  useTemperatureData();
  useWebSocket();
  useAutoFanControl();

  const error = useError();
  const isLoading = useIsLoading();
  const isConnected = useIsConnected();
  const temperature = useTemperature();
  const humidity = useHumidity();
  const lastUpdate = useDashboardStore((s) => s.lastUpdate);

  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const token = localStorage.getItem("token");
  const decoded = token ? (JSON.parse(token) as LoginDTO) : null;
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  console.log({ error, lastUpdate, isConnected });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-40 right-40 w-64 h-64 bg-cyan-500/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 left-40 w-56 h-56 bg-orange-500/8 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      {/* Animated Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none"></div>

      <div className="relative z-10 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto w-full space-y-8 lg:space-y-12">
          {/* Enhanced Header Section */}
          <header className="text-center">
            <div className="relative inline-block">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>

              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl">
                {/* Animated Icons */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-5xl lg:text-6xl animate-bounce">🏠</div>
                  <div className="text-4xl lg:text-5xl">🐔</div>
                  <div className="text-4xl lg:text-5xl animate-pulse">🌡️</div>
                  <div className="text-3xl lg:text-4xl animate-bounce delay-500">
                    🌀
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-3">
                  Smart Chicken Farm
                </h1>
                {decoded ? (
                  <p className="text-gray-300 lg:text-3xl text-3xl font-bold mb-6">
                    Welcome, {decoded.name ?? "-"}
                  </p>
                ) : null}
                <p className="text-gray-300 text-base lg:text-lg font-medium mb-6">
                  🚀 Advanced IoT Monitoring & Automated Control System
                </p>

                {/* Status Indicators */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected
                          ? "bg-green-400 animate-ping"
                          : "bg-yellow-400"
                      }`}
                    ></div>
                    <span className="text-sm font-semibold text-green-300">
                      {isConnected ? "LIVE" : "OFFLINE"}
                    </span>
                  </div>

                  {isLoading && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                      <span className="text-sm font-semibold text-blue-300">
                        Syncing...
                      </span>
                    </div>
                  )}

                  {/* Real-time Clock */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                    <div className="text-purple-400">🕒</div>
                    <span className="text-sm font-semibold text-purple-300">
                      {currentTime.toLocaleTimeString("id-ID")}
                    </span>
                  </div>

                  {/* Current Temperature Badge */}
                  {temperature && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30">
                      <div className="text-orange-400">🌡️</div>
                      <span className="text-sm font-semibold text-orange-300">
                        {temperature.toCelsius().toFixed(1)}°C
                      </span>
                    </div>
                  )}

                  {/* Current Humidity Badge */}
                  {humidity && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-500/30">
                      <div className="text-cyan-400">💧</div>
                      <span className="text-sm font-semibold text-cyan-300">
                        {humidity?.value.toFixed(0)}%
                      </span>
                    </div>
                  )}
                  <div
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full border border-purple-500/30 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <span className="text-sm font-semibold text-white">
                      LOGOUT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Enhanced Monitoring Panel */}
          <section>
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-6 lg:p-8">
                <MonitoringPanel />
              </div>
            </div>
          </section>

          {/* Enhanced Control Grid */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Control Panel Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
                  <div className="p-6">
                    <ControlPanel />
                  </div>
                </div>
              </div>

              {/* Fan Controller Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
                  <div className="p-6">
                    <FanController />
                  </div>
                </div>
              </div>

              {/* Status Monitor Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
                  <div className="p-6">
                    <StatusIndicator />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Terminal & Debug Section */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Terminal Log */}
            <div className="xl:col-span-2">
              <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-3xl border border-green-500/20 shadow-2xl overflow-hidden">
                <div className="p-6 lg:p-8">
                  <TerminalLog />
                </div>
              </div>
            </div>

            {/* Debug Panel Toggle */}
            <div className="space-y-6">
              {/* Debug Panel Toggle Button */}
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="text-2xl">🔧</div>
                  <h3 className="text-lg font-semibold text-white">
                    Developer Tools
                  </h3>
                  <button
                    onClick={() => setShowDebugPanel(!showDebugPanel)}
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      showDebugPanel
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    }`}
                  >
                    {showDebugPanel ? "Hide Debug Panel" : "Show Debug Panel"}
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">System Status</span>
                    <span
                      className={`font-semibold ${
                        isConnected ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isConnected ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Data Points</span>
                    <span className="text-blue-400 font-semibold">24/7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Uptime</span>
                    <span className="text-green-400 font-semibold">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Response Time</span>
                    <span className="text-purple-400 font-semibold">
                      &lt;100ms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Debug Panel - Conditional Render */}
          {showDebugPanel && (
            <section className="animate-in slide-in-from-bottom duration-500">
              <DebugPanel />
            </section>
          )}

          {/* Enhanced Footer Status */}
          <footer>
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-2xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                {/* Connection Status */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`w-5 h-5 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-yellow-400"
                      } transition-colors duration-300`}
                    ></div>
                    {isConnected && (
                      <div className="absolute inset-0 w-5 h-5 rounded-full bg-green-500 animate-ping"></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-lg">
                      ESP32 Device: {isConnected ? "🟢 Online" : "🟡 Offline"}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {isConnected
                        ? "Real-time data streaming"
                        : "Displaying last known data"}
                    </span>
                  </div>
                </div>

                {/* System Information Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Last Update */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-blue-400 text-xl">🕒</div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-semibold">
                        Last Update
                      </span>
                      <span className="text-gray-300 text-xs">
                        {lastUpdate
                          ? new Date(lastUpdate).toLocaleString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              day: "2-digit",
                              month: "short",
                            })
                          : "No data available"}
                      </span>
                    </div>
                  </div>

                  {/* Version Info */}
                  {/* <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
                    <div className="text-purple-400 text-xl">⚡</div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-semibold">
                        Smart Farm v3.0
                      </span>
                      <span className="text-purple-300 text-xs">
                        IoT Dashboard Pro
                      </span>
                    </div>
                  </div> */}

                  {/* Performance Badge */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 lg:col-span-1 col-span-2">
                    <div className="text-green-400 text-xl">🚀</div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-semibold">
                        High Performance
                      </span>
                      <span className="text-green-300 text-xs">
                        Optimized & Fast
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    99.9%
                  </div>
                  <div className="text-gray-400 text-sm">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    24/7
                  </div>
                  <div className="text-gray-400 text-sm">Live Monitoring</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    Real-time
                  </div>
                  <div className="text-gray-400 text-sm">Data Sync</div>
                </div>
                <div className="text-center p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                  <div className="text-3xl font-bold text-orange-400 mb-1">
                    Smart
                  </div>
                  <div className="text-gray-400 text-sm">Automation</div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { MonitoringPanel } from "../MonitoringPanel/MonitoringPanel";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { FanController } from "../../molecules/FanController/FanControl";
import { StatusIndicator } from "../../molecules/StatusIndicator/StatusIndicator";
import { TerminalLog } from "../../molecules/TerminalLog/TerminalLog";
import { useTemperatureData } from "../../../../app/hooks/useTemperatureData";
import { useWebSocket } from "../../../../app/hooks/useWebSocket";
import { useAutoFanControl } from "../../../../app/hooks/useAutoFanControl";
import { useError, useIsLoading } from "../../../../app/store/dashboardStore";
import { ConnectionStatus } from "../../molecules/ConnectionStatus/ConnectionStatus";


export const Dashboard: React.FC = () => {
  // Initialize hooks
  useTemperatureData();
  useWebSocket();
  useAutoFanControl();

  const error = useError();
  const isLoading = useIsLoading();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <div className="text-white">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sistem Monitoring Suhu Peternakan Ayam Broiler</h1>
          <div className="text-gray-400">Real-time monitoring dan kontrol otomatis</div>
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <ConnectionStatus />
        </div>

        {/* Monitoring Panel */}
        <div className="mb-8">
          <MonitoringPanel />
        </div>

        {/* Control and Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Control Panel */}
          <div>
            <ControlPanel />
          </div>

          {/* Fan Controller */}
          <div>
            <FanController />
          </div>

          {/* Status Indicator */}
          <div>
            <StatusIndicator />
          </div>
        </div>

        {/* Terminal Log */}
        <div className="mb-8">
          <TerminalLog />
        </div>

        {/* Status Footer */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center text-sm">
            <div className="text-white">
              <span className="text-green-400 mr-2">●</span>
              ESP32 Status - Last update: {new Date().toLocaleTimeString("id-ID")}
            </div>
            <div className="text-gray-400">Chicken Farm Dashboard v1.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { TemperatureGauge } from '@/presentation/components/molecules/TemperatureGauge/TemperatureGauge';
import { HumidityGauge } from '@/presentation/components/molecules/HumidityGauge/HumidityGauge';
import { useTemperature, useHumidity, useTemperatureThreshold } from '@/app/store/dashboardStore';
import { celsiusToFahrenheit } from '@/shared/utils/converters';

export const MonitoringPanel: React.FC = () => {
  const temperature = useTemperature();
  const humidity = useHumidity();
  const temperatureThreshold = useTemperatureThreshold();

  const tempCelsius = temperature?.toCelsius() || 0;
  const tempFahrenheit = temperature?.toFahrenheit() || celsiusToFahrenheit(tempCelsius);
  const humidityValue = humidity?.value || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TemperatureGauge
        value={tempCelsius}
        unit="celsius"
        max={50}
        threshold={temperatureThreshold}
        label="Suhu"
      />
      <TemperatureGauge
        value={tempFahrenheit}
        unit="fahrenheit"
        max={120}
        threshold={celsiusToFahrenheit(temperatureThreshold)}
        label="Suhu Fahrenheit"
      />
      <HumidityGauge
        value={humidityValue}
        label="Kelembaban"
      />
    </div>
  );
};

// src/presentation/components/organisms/Dashboard/Dashboard.tsx
import React from 'react';
import { MonitoringPanel } from '@/presentation/components/organisms/MonitoringPanel/MonitoringPanel';
import { ControlPanel } from '@/presentation/components/organisms/ControlPanel/ControlPanel';
import { FanController } from '@/presentation/components/molecules/FanController/FanController';
import { StatusIndicator } from '@/presentation/components/molecules/StatusIndicator/StatusIndicator';
import { TerminalLog } from '@/presentation/components/molecules/TerminalLog/TerminalLog';
import { useTemperatureData } from '@/app/hooks/useTemperatureData';
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { useAutoFanControl } from '@/app/hooks/useAutoFanControl';
import { useError, useIsLoading } from '@/app/store/dashboardStore';

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Sistem Monitoring Suhu Peternakan Ayam Broiler
          </h1>
          <div className="text-gray-400">
            Real-time monitoring dan kontrol otomatis
          </div>
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
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
              ESP32 Status - Last update: {new Date().toLocaleTimeString('id-ID')}
            </div>
            <div className="text-gray-400">
              Chicken Farm Dashboard v1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
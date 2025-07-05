import React, { useState } from "react";
import { useFan, useHumidity, useManualMode, useTemperature, useTemperatureThreshold } from "../../../../app/store/dashboardStore";
import { celsiusToFahrenheit } from "../../../../shared/utils/converters";
import { HumidityGauge } from "../../molecules/HumidityGauge/HumidityGauge";
import { TemperatureGauge } from "../../molecules/TemperatureGauge/TemperatureGauge";

// type TimeRange = 'live' | '1h' | '6h' | '1d' | '1w' | '1mo' | '3mo' | '6mo' | '1y';

export const MonitoringPanel: React.FC = () => {
  const temperature = useTemperature();
  const humidity = useHumidity();
  const temperatureThreshold = useTemperatureThreshold();
  const fan = useFan();
  const manualMode = useManualMode();

  // const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('live');
  const [isAdjustingThreshold, setIsAdjustingThreshold] = useState(false);

  const tempCelsius = temperature?.toCelsius() || 0;
  const tempFahrenheit = temperature?.toFahrenheit() || celsiusToFahrenheit(tempCelsius);
  const humidityValue = humidity?.value || 0;

  // const timeRanges: { key: TimeRange; label: string; icon: string }[] = [
  //   { key: 'live', label: 'Live', icon: '🔴' },
  //   { key: '1h', label: '1H', icon: '🕐' },
  //   { key: '6h', label: '6H', icon: '🕕' },
  //   { key: '1d', label: '1D', icon: '📅' },
  //   { key: '1w', label: '1W', icon: '📊' },
  //   { key: '1mo', label: '1M', icon: '📈' },
  //   { key: '3mo', label: '3M', icon: '📉' },
  //   { key: '6mo', label: '6M', icon: '📋' },
  //   { key: '1y', label: '1Y', icon: '🗓️' },
  // ];

  const handleThresholdAdjust = (delta: number) => {
    setIsAdjustingThreshold(true);
    // Here you would call the actual threshold adjustment function
    console.log(`Adjusting threshold by ${delta}`);
    setTimeout(() => setIsAdjustingThreshold(false), 500);
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Environmental Monitoring
          </h2>
          <p className="text-slate-400 text-lg">Real-time sensor data analysis and control</p>
        </div>

        {/* Enhanced Time Filter Tabs */}
        {/* <div className="flex flex-wrap gap-2 p-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
          {timeRanges.map((range) => (
            <button
              key={range.key}
              onClick={() => setSelectedTimeRange(range.key)}
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                selectedTimeRange === range.key
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {selectedTimeRange === range.key && range.key === 'live' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
              <span className="mr-1">{range.icon}</span>
              {range.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* Main Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Temperature Celsius */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <TemperatureGauge 
              value={tempCelsius} 
              unit="celsius" 
              max={50} 
              threshold={temperatureThreshold} 
              label="Temperature (°C)"
            />
          </div>
        </div>

        {/* Temperature Fahrenheit */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <TemperatureGauge 
              value={tempFahrenheit} 
              unit="fahrenheit" 
              max={122} 
              threshold={celsiusToFahrenheit(temperatureThreshold)} 
              label="Temperature (°F)"
            />
          </div>
        </div>

        {/* Humidity */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <HumidityGauge value={humidityValue} label="Relative Humidity" />
          </div>
        </div>
      </div>

      {/* Control & Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* System Mode Status */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${manualMode ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
              <span className="text-xl">{manualMode ? '👤' : '🤖'}</span>
            </div>
            <h3 className="text-slate-300 text-sm font-semibold">System Mode</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Current Mode</span>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                manualMode 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {manualMode ? 'MANUAL' : 'AUTO'}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              {manualMode 
                ? 'User has full control over fan operations'
                : 'System automatically controls fan based on temperature'
              }
            </div>
          </div>
        </div>

        {/* Fan Status */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${fan?.isOn() ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
              <div className={`text-xl transition-all duration-500 ${fan?.isOn() ? 'animate-spin' : ''}`}>
                🌀
              </div>
            </div>
            <h3 className="text-slate-300 text-sm font-semibold">Fan Status</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Current State</span>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                fan?.isOn() 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
              }`}>
                {fan?.isOn() ? 'RUNNING' : 'STOPPED'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${fan?.isOn() ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
              <span className="text-xs text-slate-500">
                {fan?.isOn() ? 'Active cooling system' : 'Standby mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Temperature Threshold Display */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="text-slate-300 text-sm font-semibold">Temperature Threshold</h3>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {temperatureThreshold}°C
              </div>
              <div className="text-xs text-slate-500">Current threshold</div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(temperatureThreshold / 50) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-slate-500">
              <span>20°C</span>
              <span>40°C</span>
            </div>
          </div>
        </div>

        {/* Quick Threshold Control */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <span className="text-xl">⚙️</span>
            </div>
            <h3 className="text-slate-300 text-sm font-semibold">Quick Adjust</h3>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-1">
                {temperatureThreshold}°C
              </div>
              <div className="text-xs text-slate-500">Target temperature</div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button 
                onClick={() => handleThresholdAdjust(-0.5)}
                disabled={isAdjustingThreshold}
                className="flex-1 h-8 rounded-lg bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <span className="text-lg font-bold">−</span>
              </button>
              
              <div className="px-3 py-1 bg-slate-700 rounded-lg">
                <span className="text-white text-sm font-medium">±0.5°C</span>
              </div>
              
              <button 
                onClick={() => handleThresholdAdjust(0.5)}
                disabled={isAdjustingThreshold}
                className="flex-1 h-8 rounded-lg bg-green-600 hover:bg-green-500 text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <span className="text-lg font-bold">+</span>
              </button>
            </div>

            {isAdjustingThreshold && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-xs text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Adjusting...
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* System Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{tempCelsius.toFixed(1)}°C</div>
          <div className="text-xs text-slate-400">Current Temperature</div>
        </div>
        
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 text-center">
          <div className="text-2xl font-bold text-cyan-400 mb-1">{humidityValue.toFixed(0)}%</div>
          <div className="text-xs text-slate-400">Current Humidity</div>
        </div>
        
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{temperatureThreshold}°C</div>
          <div className="text-xs text-slate-400">Threshold Setting</div>
        </div>
        
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 text-center">
          <div className={`text-2xl font-bold mb-1 ${
            tempCelsius >= temperatureThreshold ? 'text-red-400' : 'text-green-400'
          }`}>
            {tempCelsius >= temperatureThreshold ? 'ALERT' : 'NORMAL'}
          </div>
          <div className="text-xs text-slate-400">System Status</div>
        </div>
      </div>

    </div>
  );
};
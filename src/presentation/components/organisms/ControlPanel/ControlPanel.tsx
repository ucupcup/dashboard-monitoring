import React from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { Toggle } from "../../../components/atoms/Toggle/Toggle";
import { Slider } from "../../../components/atoms/Slider/Slider";
import { Button } from "../../../components/atoms/Button/Button";
import { useDashboardStore } from "../../../../app/store/dashboardStore";

export const ControlPanel: React.FC = () => {
  const { 
    manualMode, 
    temperatureThreshold, 
    fan,
    isConnected,
    setManualMode, 
    setTemperatureThreshold,
    controlFan,
    changeModeAndNotifyBackend
  } = useDashboardStore();

  const handleModeChange = async (manual: boolean) => {
    try {
      await changeModeAndNotifyBackend(manual);
    } catch (error) {
      console.error('Failed to change mode:', error);
    }
  };

  const handleFanControl = async (state: boolean) => {
    try {
      await controlFan(state);
    } catch (error) {
      console.error('Failed to control fan:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Manual Mode Control */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Control Mode</h3>
        <div className="flex items-center justify-between">
          <Toggle 
            isOn={manualMode} 
            onToggle={() => handleModeChange(!manualMode)} 
            label="" 
            disabled={!isConnected}
          />
          <span className="text-white font-medium">
            {manualMode ? "MANUAL" : "AUTO"}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          {manualMode 
            ? "Manual control enabled - Fan controlled manually" 
            : "Auto mode enabled - Fan controlled by temperature threshold"
          }
        </div>
        {!isConnected && (
          <div className="mt-2 text-sm text-red-400">
            Device offline - Controls disabled
          </div>
        )}
      </Card>

      {/* Manual Fan Control - Only shown in manual mode */}
      {manualMode && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Fan Control</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white">Fan Status:</span>
            <span className={`font-semibold ${fan?.state === 'on' ? 'text-green-400' : 'text-gray-400'}`}>
              {fan?.state === 'on' ? 'ON' : 'OFF'}
            </span>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => handleFanControl(true)}
              disabled={!isConnected || fan?.state === 'on'}
              className={`flex-1 ${
                fan?.state === 'on' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-green-600'
              }`}
            >
              Turn ON
            </Button>
            <Button
              onClick={() => handleFanControl(false)}
              disabled={!isConnected || fan?.state === 'off'}
              className={`flex-1 ${
                fan?.state === 'off' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-red-600'
              }`}
            >
              Turn OFF
            </Button>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Manual fan control - Override automatic temperature control
          </div>
        </Card>
      )}

      {/* Temperature Threshold */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Temperature Threshold</h3>
        <Slider 
          value={temperatureThreshold} 
          onChange={setTemperatureThreshold} 
          min={20} 
          max={40} 
          step={0.5} 
          unit="°C" 
          showValue={true}
          disabled={!isConnected}
        />
        <div className="mt-2 text-sm text-gray-400">
          {manualMode 
            ? "Threshold setting (will be used when switching back to auto mode)"
            : "Fan will turn on automatically when temperature exceeds this threshold"
          }
        </div>
      </Card>
    </div>
  );
};
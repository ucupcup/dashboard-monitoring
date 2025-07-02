import React from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { Toggle } from "../../../components/atoms/Toggle/Toggle";
import { Slider } from "../../../components/atoms/Slider/Slider";
import { useDashboardStore } from "../../../../app/store/dashboardStore";
export const ControlPanel: React.FC = () => {
  const { manualMode, temperatureThreshold, setManualMode, setTemperatureThreshold } = useDashboardStore();

  return (
    <div className="space-y-6">
      {/* Manual Mode Control */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Manual Mode</h3>
        <div className="flex items-center justify-between">
          <Toggle isOn={manualMode} onToggle={() => setManualMode(!manualMode)} label="" />
          <span className="text-white font-medium">{manualMode ? "ON" : "OFF"}</span>
        </div>
        <div className="mt-2 text-sm text-gray-400">{manualMode ? "Manual control enabled - Fan controlled manually" : "Auto mode enabled - Fan controlled by temperature threshold"}</div>
      </Card>

      {/* Temperature Threshold */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Temperature Threshold</h3>
        <Slider value={temperatureThreshold} onChange={setTemperatureThreshold} min={20} max={40} step={0.5} unit="°C" showValue={true} />
        <div className="mt-2 text-sm text-gray-400">Fan will turn on automatically when temperature exceeds this threshold</div>
      </Card>
    </div>
  );
};

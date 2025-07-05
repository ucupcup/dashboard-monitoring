import React, { useState } from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { Toggle } from "../../../components/atoms/Toggle/Toggle";
import { Button } from "../../../components/atoms/Button/Button";
import { useFanControl } from "../../../../app/hooks/useFanControl";
import { useFan, useManualMode } from "../../../../app/store/dashboardStore";

export const FanController: React.FC = () => {
  const fan = useFan();
  const manualMode = useManualMode();
  const { controlFan } = useFanControl();
  const [fanSpeed, setFanSpeed] = useState(75);
  const [isControlling, setIsControlling] = useState(false);

  const handleFanToggle = async () => {
    if (!fan || !manualMode) return;
    setIsControlling(true);
    const newState = fan.isOn() ? "off" : "on";
    await controlFan(newState);
    setTimeout(() => setIsControlling(false), 500);
  };

  const handleQuickControl = async (state: "on" | "off") => {
    setIsControlling(true);
    await controlFan(state);
    setTimeout(() => setIsControlling(false), 500);
  };

  return (
    <Card variant="glass" rounded="2xl" shadow="xl" hover glow>
      <div className="space-y-6">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
              <div className={`text-2xl transition-all duration-500 ${fan?.isOn() ? "animate-spin" : ""}`}>🌀</div>
              {fan?.isOn() && <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-lg animate-pulse" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Fan Controller</h3>
              <p className="text-sm text-slate-400">{manualMode ? "Manual Control" : "Auto Mode"}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${fan?.isOn() ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
            {fan?.isOn() ? "RUNNING" : "STOPPED"}
          </div>
        </div>

        {/* Main Fan Visualization */}
        <div className="relative flex justify-center">
          <div className="relative">
            {/* Background glow */}
            {fan?.isOn() && <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-2xl animate-pulse" />}

            {/* Fan circle */}
            <div
              className={`relative w-32 h-32 rounded-full border-4 transition-all duration-500 ${
                fan?.isOn() ? "border-green-400 bg-gradient-to-br from-green-500/10 to-emerald-500/10 shadow-green-500/50 shadow-2xl" : "border-slate-600 bg-slate-800/50"
              }`}>
              {/* Speed indicator bars */}
              <div className="absolute inset-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-0.5 h-6 rounded-full transition-all duration-300 ${fan?.isOn() ? "bg-green-400" : "bg-slate-600"}`}
                    style={{
                      transform: `rotate(${i * 45}deg) translateY(-20px)`,
                      transformOrigin: "center 32px",
                      opacity: fan?.isOn() ? (i < fanSpeed / 12.5 ? 1 : 0.3) : 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Center display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-lg font-bold transition-colors duration-300 ${fan?.isOn() ? "text-green-400" : "text-slate-400"}`}>{fan?.isOn() ? `${fanSpeed}%` : "OFF"}</div>
                  <div className="text-xs text-slate-500">Speed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fan Speed Control */}
        {fan?.isOn() && manualMode && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Fan Speed</span>
              <span className="text-sm text-green-400 font-bold">{fanSpeed}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="25"
                max="100"
                value={fanSpeed}
                onChange={(e) => setFanSpeed(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(34, 197, 94) 0%, rgb(34, 197, 94) ${fanSpeed}%, rgb(71, 85, 105) ${fanSpeed}%, rgb(71, 85, 105) 100%)`,
                }}
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          <Toggle isOn={fan?.isOn() || false} onToggle={handleFanToggle} disabled={!manualMode || isControlling} variant="success" size="lg" label="Main Switch" showStatus animated loading={isControlling} />

          <div className="grid grid-cols-2 gap-3">
            <Button variant="success" size="sm" onClick={() => handleQuickControl("on")} disabled={!manualMode || isControlling} leftIcon="▶️" fullWidth>
              Start
            </Button>
            <Button variant="danger" size="sm" onClick={() => handleQuickControl("off")} disabled={!manualMode || isControlling} leftIcon="⏹️" fullWidth>
              Stop
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">1,250</div>
            <div className="text-xs text-slate-400">RPM</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">95%</div>
            <div className="text-xs text-slate-400">Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">2.5W</div>
            <div className="text-xs text-slate-400">Power</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

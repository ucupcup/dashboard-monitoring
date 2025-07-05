import React, { useState } from "react";
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
    setTemperatureThreshold,
    controlFan,
    changeModeAndNotifyBackend,
  } = useDashboardStore();

  const [isChangingMode, setIsChangingMode] = useState(false);
  const [isControllingFan, setIsControllingFan] = useState(false);

  const handleModeChange = async (manual: boolean) => {
    try {
      setIsChangingMode(true);
      await changeModeAndNotifyBackend(manual);
    } catch (error) {
      console.error("Failed to change mode:", error);
    } finally {
      setIsChangingMode(false);
    }
  };

  const handleFanControl = async (state: boolean) => {
    try {
      setIsControllingFan(true);
      await controlFan(state);
    } catch (error) {
      console.error("Failed to control fan:", error);
    } finally {
      setIsControllingFan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Control Mode Card */}
      <Card variant="glass" rounded="2xl" shadow="xl" hover>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Control Mode</h3>
              <p className="text-sm text-slate-400">System operation mode</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <Toggle
                isOn={manualMode}
                onToggle={() => handleModeChange(!manualMode)}
                variant={manualMode ? "warning" : "success"}
                size="lg"
                disabled={!isConnected || isChangingMode}
                loading={isChangingMode}
                animated
              />
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${
                    manualMode ? "text-orange-400" : "text-green-400"
                  }`}
                >
                  {manualMode ? "MANUAL" : "AUTO"}
                </div>
                <div className="text-xs text-slate-400">
                  {manualMode ? "User Control" : "Smart Control"}
                </div>
              </div>
            </div>

            {/* Mode Description */}
            <div
              className={`p-3 rounded-lg border transition-all duration-300 ${
                manualMode
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-200"
                  : "bg-green-500/10 border-green-500/30 text-green-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{manualMode ? "👤" : "🤖"}</span>
                <div>
                  <div className="font-medium text-sm">
                    {manualMode
                      ? "Manual Control Active"
                      : "Automatic Control Active"}
                  </div>
                  <div className="text-xs opacity-90 mt-1">
                    {manualMode
                      ? "You have full control over fan operation. Temperature thresholds are ignored."
                      : "System automatically controls fan based on temperature readings and thresholds."}
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            {!isConnected && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <div className="font-medium text-sm">Device Offline</div>
                    <div className="text-xs opacity-90">
                      Controls disabled until connection is restored
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Enhanced Manual Fan Control */}
      {manualMode && (
        <Card variant="gradient" rounded="2xl" shadow="xl" hover glow>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
                <div
                  className={`text-2xl transition-all duration-500 ${
                    fan?.state === "on" ? "animate-spin" : ""
                  }`}
                >
                  🌀
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Manual Fan Control
                </h3>
                <p className="text-sm text-slate-400">
                  Direct fan operation control
                </p>
              </div>
            </div>

            {/* Fan Status Display */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-300 font-medium">
                  Current Status:
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      fan?.state === "on"
                        ? "bg-green-500 animate-pulse"
                        : "bg-slate-500"
                    }`}
                  />
                  <span
                    className={`text-lg font-bold ${
                      fan?.state === "on" ? "text-green-400" : "text-slate-400"
                    }`}
                  >
                    {fan?.state === "on" ? "RUNNING" : "STOPPED"}
                  </span>
                </div>
              </div>

              {/* Fan Control Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => handleFanControl(true)}
                  disabled={
                    !isConnected || fan?.state === "on" || isControllingFan
                  }
                  leftIcon="▶️"
                  fullWidth
                  isLoading={isControllingFan && fan?.state !== "on"}
                >
                  Start Fan
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => handleFanControl(false)}
                  disabled={
                    !isConnected || fan?.state === "off" || isControllingFan
                  }
                  leftIcon="⏹️"
                  fullWidth
                  isLoading={isControllingFan && fan?.state !== "off"}
                >
                  Stop Fan
                </Button>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700/50">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {fan?.state === "on" ? "1,250" : "0"}
                  </div>
                  <div className="text-xs text-slate-400">RPM</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">
                    {fan?.state === "on" ? "95%" : "0%"}
                  </div>
                  <div className="text-xs text-slate-400">Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">
                    {fan?.state === "on" ? "2.5W" : "0W"}
                  </div>
                  <div className="text-xs text-slate-400">Power</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Temperature Threshold Control */}
      <Card variant="glass" rounded="2xl" shadow="xl" hover>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30">
              <span className="text-2xl">🌡️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Temperature Control
              </h3>
              <p className="text-sm text-slate-400">
                Automatic threshold settings
              </p>
            </div>
          </div>

          {/* Threshold Slider */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <Slider
              value={temperatureThreshold}
              onChange={(e) => {
                setTemperatureThreshold(e);
                console.log({ e });
              }}
              min={20}
              max={40}
              step={0.5}
              unit="°C"
              variant="temperature"
              size="lg"
              showValue={true}
              showTicks={true}
              showTooltip={true}
              animate={true}
              disabled={!isConnected}
              label="Temperature Threshold"
              icon="🎯"
            />

            {/* Threshold Info */}
            <div
              className={`mt-4 p-3 rounded-lg border transition-all duration-300 ${
                manualMode
                  ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-200"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{manualMode ? "⚠️" : "ℹ️"}</span>
                <div>
                  <div className="font-medium text-sm">
                    {manualMode
                      ? "Threshold Standby"
                      : "Active Threshold Control"}
                  </div>
                  <div className="text-xs opacity-90 mt-1">
                    {manualMode
                      ? "This threshold will be used when you switch back to automatic mode."
                      : `Fan will automatically turn ON when temperature exceeds ${temperatureThreshold}°C and turn OFF when temperature drops below this threshold.`}
                  </div>
                </div>
              </div>
            </div>

            {/* Temperature Ranges Guide */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="text-blue-400 font-medium">Cool</div>
                <div className="text-blue-300">20-25°C</div>
              </div>
              <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="text-green-400 font-medium">Optimal</div>
                <div className="text-green-300">25-30°C</div>
              </div>
              <div className="text-center p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                <div className="text-red-400 font-medium">Hot</div>
                <div className="text-red-300">30-40°C</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

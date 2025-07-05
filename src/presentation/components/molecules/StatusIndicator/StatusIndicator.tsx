import React, { useState, useEffect } from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { useFan, useIsConnected } from "../../../../app/store/dashboardStore";
import { formatTimestamp } from "../../../../shared/utils/formatters";

export const StatusIndicator: React.FC = () => {
  const fan = useFan();
  const isConnected = useIsConnected();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card variant="glass" rounded="xl" shadow="lg" hover>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/30">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">System Status</h3>
            <p className="text-sm text-slate-400">Real-time monitoring</p>
          </div>
        </div>

        {/* Main Status Display */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            {fan?.isOn() && (
              <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-lg animate-pulse" />
            )}
            <div className={`relative text-3xl font-bold px-6 py-3 rounded-2xl border transition-all duration-300 ${
              fan?.isOn() 
                ? 'text-green-400 bg-green-500/10 border-green-500/30' 
                : 'text-red-400 bg-red-500/10 border-red-500/30'
            }`}>
              {fan?.isOn() ? "SYSTEM ACTIVE" : "SYSTEM STANDBY"}
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-6 h-6 rounded-full ${fan?.isOn() ? "bg-green-500" : "bg-red-500"} transition-colors duration-300`} />
              {fan?.isOn() && (
                <div className="absolute inset-0 w-6 h-6 rounded-full bg-green-500 animate-ping" />
              )}
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className={`text-lg font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'ONLINE' : 'OFFLINE'}
            </div>
            <div className="text-xs text-slate-400 mt-1">Connection</div>
            <div className="flex justify-center mt-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-blue-400">
              {formatUptime(uptime)}
            </div>
            <div className="text-xs text-slate-400 mt-1">Uptime</div>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-center pt-4 border-t border-slate-700/50">
          <div className="text-xs text-slate-400">
            Last update: {formatTimestamp(new Date())}
          </div>
        </div>
      </div>
    </Card>
  );
};
import React from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { formatHumidity } from "../../../../shared/utils/formatters";

export interface HumidityGaugeProps {
  value: number;
  label: string;
}

export const HumidityGauge: React.FC<HumidityGaugeProps> = ({ value, label }) => {
  const percentage = Math.min(value, 100);
  
  const getHumidityStatus = (humidity: number) => {
    if (humidity < 40) return { status: 'Low', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (humidity > 70) return { status: 'High', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    return { status: 'Optimal', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const { status, color, bg } = getHumidityStatus(value);

  return (
    <Card variant="glass" rounded="xl" shadow="lg" hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${bg} ${color} border border-current/30`}>
            %RH
          </div>
        </div>

        {/* Liquid Fill Gauge */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="relative w-36 h-36 rounded-full border-4 border-slate-600 overflow-hidden bg-slate-800">
              {/* Water fill */}
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t transition-all duration-1000 ease-out ${
                  value < 40 ? 'from-yellow-500 to-orange-400' :
                  value > 70 ? 'from-blue-500 to-cyan-400' :
                  'from-green-500 to-emerald-400'
                }`}
                style={{ height: `${percentage}%` }}
              >
                {/* Wave effect */}
                <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
                  <div className="absolute -top-2 left-0 w-full h-8 bg-white/20 rounded-full animate-pulse" />
                </div>
              </div>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">
                    {formatHumidity(value)}
                  </div>
                  <div className={`text-xs font-medium ${color} drop-shadow`}>
                    {status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scale */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Dry</span>
            <span>Optimal</span>
            <span>Humid</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                value < 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                value > 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                'bg-gradient-to-r from-green-500 to-emerald-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
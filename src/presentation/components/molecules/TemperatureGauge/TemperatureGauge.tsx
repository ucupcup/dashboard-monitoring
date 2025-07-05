import React from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { formatTemperature } from "../../../../shared/utils/formatters";
import { getTemperatureColor } from "../../../../shared/utils/converters";
export interface TemperatureGaugeProps {
  value: number;
  unit: "celsius" | "fahrenheit";
  max: number;
  threshold?: number;
  label: string;
}

export const TemperatureGauge: React.FC<TemperatureGaugeProps> = ({ 
  value, unit, max, threshold, label 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;
  const colorClass = threshold ? getTemperatureColor(value, threshold) : "text-green-500";
  const isOverThreshold = Boolean(threshold && value >= threshold);

  return (
    <Card 
      variant={isOverThreshold ? "neon" : "glass"} 
      rounded="xl" 
      shadow="lg" 
      hover 
      glow={isOverThreshold}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
            isOverThreshold 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {unit === 'celsius' ? '°C' : '°F'}
          </div>
        </div>

        {/* Gauge */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Background glow for alerts */}
            {isOverThreshold && (
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            )}
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                {/* Background circle */}
                <circle 
                  cx="72" 
                  cy="72" 
                  r="45" 
                  stroke="rgb(71, 85, 105)" 
                  strokeWidth="8" 
                  fill="none" 
                  className="opacity-30"
                />
                
                {/* Threshold indicator */}
                {threshold && (
                  <circle
                    cx="72"
                    cy="72"
                    r="45"
                    stroke="rgb(234, 179, 8)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * (threshold / max))}
                    className="opacity-60"
                  />
                )}
                
                {/* Progress circle */}
                <circle 
                  cx="72" 
                  cy="72" 
                  r="45" 
                  stroke={isOverThreshold ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)"} 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute text-center">
                <div className={`text-2xl font-bold mb-1 ${colorClass} transition-colors duration-300`}>
                  {formatTemperature(value, unit)}
                </div>
                {threshold && (
                  <div className="text-xs text-slate-400">
                    Target: {threshold}{unit === 'celsius' ? '°C' : '°F'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>0</span>
            <span>{max}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                isOverThreshold 
                  ? 'bg-gradient-to-r from-red-500 to-red-400' 
                  : 'bg-gradient-to-r from-green-500 to-blue-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
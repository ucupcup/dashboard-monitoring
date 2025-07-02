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

export const TemperatureGauge: React.FC<TemperatureGaugeProps> = ({ value, unit, max, threshold, label }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  const colorClass = threshold ? getTemperatureColor(value, threshold) : "text-green-500";

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
      <div className="flex justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="45" stroke="rgb(75, 85, 99)" strokeWidth="8" fill="none" />
            <circle cx="64" cy="64" r="45" stroke="rgb(34, 197, 94)" strokeWidth="8" fill="none" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} className="transition-all duration-500" />
          </svg>
          <div className="absolute text-center">
            <div className={`text-2xl font-bold ${colorClass}`}>{formatTemperature(value, unit)}</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>
    </Card>
  );
};

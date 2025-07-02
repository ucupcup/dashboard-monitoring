import React from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { formatHumidity } from "../../../../shared/utils/formatters";
import { getHumidityColor } from "../../../../shared/utils/converters";

export interface HumidityGaugeProps {
  value: number;
  label: string;
}

export const HumidityGauge: React.FC<HumidityGaugeProps> = ({ value, label }) => {
  const percentage = Math.min(value, 100);
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  const colorClass = getHumidityColor(value);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
      <div className="flex justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="45" stroke="rgb(75, 85, 99)" strokeWidth="8" fill="none" />
            <circle cx="64" cy="64" r="45" stroke="rgb(249, 115, 22)" strokeWidth="8" fill="none" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} className="transition-all duration-500" />
          </svg>
          <div className="absolute text-center">
            <div className={`text-2xl font-bold ${colorClass}`}>{formatHumidity(value)}</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>0</span>
          <span>100</span>
        </div>
      </div>
    </Card>
  );
};

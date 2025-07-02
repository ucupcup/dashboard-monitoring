import React from "react";
import { TemperatureGauge } from "../../molecules/TemperatureGauge/TemperatureGauge";
import { HumidityGauge } from "../../molecules/HumidityGauge/HumidityGauge";
import { useTemperature, useHumidity, useTemperatureThreshold } from "../../../../app/store/dashboardStore";
import { celsiusToFahrenheit } from "../../../../shared/utils/converters";

export const MonitoringPanel: React.FC = () => {
  const temperature = useTemperature();
  const humidity = useHumidity();
  const temperatureThreshold = useTemperatureThreshold();

  const tempCelsius = temperature?.toCelsius() || 0;
  const tempFahrenheit = temperature?.toFahrenheit() || celsiusToFahrenheit(tempCelsius);
  const humidityValue = humidity?.value || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TemperatureGauge value={tempCelsius} unit="celsius" max={50} threshold={temperatureThreshold} label="Suhu" />
      <TemperatureGauge value={tempFahrenheit} unit="fahrenheit" max={120} threshold={celsiusToFahrenheit(temperatureThreshold)} label="Suhu Fahrenheit" />
      <HumidityGauge value={humidityValue} label="Kelembaban" />
    </div>
  );
};
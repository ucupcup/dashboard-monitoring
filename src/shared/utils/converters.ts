export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9 / 5) + 32;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5 / 9;
};

export const getTemperatureColor = (temperature: number, threshold: number): string => {
  if (temperature >= threshold + 5) return 'text-red-500';
  if (temperature >= threshold) return 'text-yellow-500';
  return 'text-green-500';
};

export const getHumidityColor = (humidity: number): string => {
  if (humidity >= 80) return 'text-blue-500';
  if (humidity >= 60) return 'text-green-500';
  if (humidity >= 40) return 'text-yellow-500';
  return 'text-red-500';
};
export const formatTemperature = (value: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string => {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${value.toFixed(1)}${symbol}`;
};

export const formatHumidity = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'Asia/Jakarta',
  }).format(date);
};
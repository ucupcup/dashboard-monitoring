export interface SensorReading {
  value: number;
  unit: string;
  timestamp: Date;
  deviceId: string;
}

export interface TemperatureReading extends SensorReading {
  unit: TemperatureUnit;
}

export interface HumidityReading extends SensorReading {
  unit: '%';
}
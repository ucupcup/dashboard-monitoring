export type TemperatureUnit = 'celsius' | 'fahrenheit';

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

export type SensorStatus = 'active' | 'inactive' | 'error' | 'calibrating';

export interface SensorMetadata {
  sensorId: string;
  sensorType: 'temperature' | 'humidity' | 'pressure' | 'wind';
  status: SensorStatus;
  lastCalibration?: Date;
  accuracy?: number;
  location?: string;
}
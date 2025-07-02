export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type DeviceStatus = 'online' | 'offline' | 'error';
export type FanState = 'on' | 'off' | 'auto';
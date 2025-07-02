export interface DeviceConfig {
  temperatureThreshold: number;
  humidityThreshold: number;
  fanAutoMode: boolean;
  refreshInterval: number;
}

export interface DeviceCommand {
  type: 'fan_control' | 'threshold_update' | 'mode_change';
  payload: Record<string, unknown>;
  timestamp: Date;
}
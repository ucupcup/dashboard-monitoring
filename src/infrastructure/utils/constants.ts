export const API_ENDPOINTS = {
  TEMPERATURE: '/temperature',
  HUMIDITY: '/humidity',
  DEVICE: '/device',
  CONFIG: '/config',
  COMMANDS: '/commands',
} as const;

export const WEBSOCKET_EVENTS = {
  TEMPERATURE_UPDATE: 'temperature_update',
  HUMIDITY_UPDATE: 'humidity_update',
  DEVICE_STATUS: 'device_status',
  FAN_STATUS: 'fan_status',
  ERROR: 'error',
} as const;

export const MQTT_TOPICS = {
  TEMPERATURE: 'sensors/temperature',
  HUMIDITY: 'sensors/humidity',
  FAN_CONTROL: 'actuators/fan',
  DEVICE_STATUS: 'device/status',
} as const;
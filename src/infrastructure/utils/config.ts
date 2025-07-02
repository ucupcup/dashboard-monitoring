export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 10000,
  },
  websocket: {
    url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws',
    reconnectInterval: 5000,
    maxRetries: 5,
  },
  mqtt: {
    brokerUrl: import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:1883',
    clientId: `client_${Math.random().toString(36).substr(2, 9)}`,
  },
  device: {
    id: import.meta.env.VITE_ESP32_DEVICE_ID || 'chicken_farm_001',
    refreshInterval: Number(import.meta.env.VITE_REFRESH_INTERVAL) || 5000,
    temperatureThreshold: Number(import.meta.env.VITE_TEMPERATURE_THRESHOLD) || 30,
    humidityThreshold: Number(import.meta.env.VITE_HUMIDITY_THRESHOLD) || 60,
  },
} as const;
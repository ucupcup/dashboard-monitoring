export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.7:3001/api',
    timeout: 10000,
  },
  websocket: {
    url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://192.168.1.7:3001/ws',
    reconnectInterval: 5000,
    maxRetries: 5,
  },
  device: {
    id: import.meta.env.VITE_ESP32_DEVICE_ID || 'chicken_farm_001',
    refreshInterval: Number(import.meta.env.VITE_REFRESH_INTERVAL) || 1000,
    temperatureThreshold: Number(import.meta.env.VITE_TEMPERATURE_THRESHOLD) || 30,
    humidityThreshold: Number(import.meta.env.VITE_HUMIDITY_THRESHOLD) || 60,
  },
} as const;
Object.defineProperty(window, 'import.meta', {
  value: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:8000/api',
      VITE_WEBSOCKET_URL: 'ws://localhost:8000/ws',
      VITE_ESP32_DEVICE_ID: 'test_device',
    },
  },
});
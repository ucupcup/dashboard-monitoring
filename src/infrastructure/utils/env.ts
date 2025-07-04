Object.defineProperty(window, 'import.meta', {
  value: {
    env: {
      VITE_API_BASE_URL: 'https://358e-103-119-65-164.ngrok-free.app/api',
      VITE_WEBSOCKET_URL: 'ws://localhost:8000/wswss://358e-103-119-65-164.ngrok-free.app/ws',
      VITE_ESP32_DEVICE_ID: 'test_device',
    },
  },
});
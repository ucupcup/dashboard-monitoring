import { useEffect } from 'react';
import { webSocketClient } from '@/infrastructure/api/client/websocketClient';
import { useDashboardStore } from '@/app/store/dashboardStore';

export const useWebSocket = () => {
  const { setConnected, setError } = useDashboardStore();

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await webSocketClient.connect();
        setConnected(true);
      } catch (error) {
        setError('WebSocket connection failed');
        setConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      webSocketClient.disconnect();
      setConnected(false);
    };
  }, [setConnected, setError]);

  return {
    isConnected: webSocketClient.isConnected,
    send: webSocketClient.send.bind(webSocketClient),
  };
};
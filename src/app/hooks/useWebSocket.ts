import { useEffect, useCallback } from 'react';
import { webSocketClient } from '../../infrastructure/api/client/websocketClient';
import { useDashboardStore } from '../store/dashboardStore';

export const useWebSocket = () => {
  const { setConnected, setError } = useDashboardStore();

  const handleConnectionError = useCallback((error: unknown) => {
    let errorMessage = 'WebSocket connection failed';
    
    if (error instanceof Error) {
      errorMessage = `WebSocket error: ${error.message}`;
    } else if (typeof error === 'string') {
      errorMessage = `WebSocket error: ${error}`;
    }
    
    setError(errorMessage);
    setConnected(false);
    
    // Log untuk debugging
    console.error('WebSocket connection failed:', error);
  }, [setError, setConnected]);

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await webSocketClient.connect();
        setConnected(true);
        setError(null); // Clear previous errors
      } catch (error) {
        handleConnectionError(error);
      }
    };

    connectWebSocket();

    return () => {
      webSocketClient.disconnect();
      setConnected(false);
    };
  }, [setConnected, setError, handleConnectionError]);

  const reconnect = useCallback(async () => {
    try {
      await webSocketClient.connect();
      setConnected(true);
      setError(null);
    } catch (error) {
      handleConnectionError(error);
    }
  }, [setConnected, setError, handleConnectionError]);

  return {
    isConnected: webSocketClient.isConnected,
    send: webSocketClient.send.bind(webSocketClient),
    reconnect, // Bonus: manual reconnect function
  };
};
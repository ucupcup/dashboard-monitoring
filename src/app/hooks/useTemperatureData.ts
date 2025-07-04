import { useEffect, useCallback, useRef } from "react";
import { TemperatureService } from "../../DTO/services/TemperatureService";
import { TemperatureRepository } from "../../infrastructure/repositories/TemperatureRepository";
import { Temperature } from "../../DTO/entities/Temperature";
import { Humidity } from "../../DTO/entities/Humidity";
import { Fan } from "../../DTO/entities/Fan";
import { useDashboardStore } from "../store/dashboardStore";
import { config } from "../../infrastructure/utils/config";

const temperatureService = new TemperatureService(new TemperatureRepository());

// Interface for API response
interface SensorDataResponse {
  success: boolean;
  data: {
    temperature: number;
    humidity: number;
    fanState: boolean;
    autoMode: boolean;
    manualMode: boolean;
    temperatureThreshold: number;
    deviceId?: string;
    lastUpdate: string;
    deviceStatus: 'online' | 'offline' | 'error';
  };
  timestamp: string;
}

export const useTemperatureData = (deviceId: string = config.device.id) => {
  const { 
    setTemperature, 
    setHumidity, 
    setFan, 
    setLoading, 
    setError, 
    isConnected 
  } = useDashboardStore();
  
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const isPolling = useRef(false);

  // Fetch current data from backend API
  const fetchCurrentData = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sensor-data`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: SensorDataResponse = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        // Update temperature
        if (data.temperature !== undefined) {
          const temperature = new Temperature(
            data.temperature, 
            'celsius', 
            new Date(), 
            data.deviceId || deviceId
          );
          setTemperature(temperature);
        }
        
        // Update humidity  
        if (data.humidity !== undefined) {
          const humidity = new Humidity(
            data.humidity, 
            new Date(), 
            data.deviceId || deviceId
          );
          setHumidity(humidity);
        }
        
        // Update fan state
        if (data.fanState !== undefined) {
          const fan = new Fan(
            data.deviceId || deviceId, 
            data.fanState ? 'on' : 'off', 
            data.autoMode || false, 
            new Date()
          );
          setFan(fan);
        }

        // Log sensor data update (compact format)
        console.log(`Sensor Update: T:${data.temperature}°C H:${data.humidity}% Fan:${data.fanState ? 'ON' : 'OFF'}`);
        
        setError(null);
        
      } else {
        throw new Error(result.data ? 'Invalid response format' : 'No data received');
      }
      
    } catch (error) {
      console.error('Sensor data fetch failed:', error instanceof Error ? error.message : error);
      
      // Only set error if WebSocket is also not connected
      if (!isConnected) {
        setError(error instanceof Error ? error.message : "Failed to fetch sensor data");
      }
    } finally {
      setLoading(false);
    }
  }, [deviceId, setTemperature, setHumidity, setFan, setLoading, setError, isConnected]);

  // Legacy temperature service fetch (fallback)
  const fetchCurrentTemperature = useCallback(async () => {
    try {
      setLoading(true);
      const temperature = await temperatureService.getCurrentTemperature(deviceId);
      setTemperature(temperature);
      setError(null);
    } catch (error) {
      console.error('Legacy temperature fetch failed:', error instanceof Error ? error.message : error);
      
      // Try the direct API fetch as fallback
      if (!isConnected) {
        await fetchCurrentData();
      } else {
        setError(error instanceof Error ? error.message : "Failed to fetch temperature");
      }
    } finally {
      setLoading(false);
    }
  }, [deviceId, setTemperature, setLoading, setError, isConnected, fetchCurrentData]);

  // Subscribe to temperature updates via WebSocket
  const subscribeToTemperatureUpdates = useCallback(() => {
    try {
      const unsubscribe = temperatureService.subscribeToUpdates(deviceId, (temperature) => {
        console.log(`WebSocket Update: ${temperature.value}°C`);
        setTemperature(temperature);
      });

      return unsubscribe;
    } catch (error) {
      console.error('WebSocket subscription failed:', error instanceof Error ? error.message : error);
      return () => {}; // Return empty cleanup function
    }
  }, [deviceId, setTemperature]);

  // Start HTTP polling when WebSocket is disconnected
  const startPolling = useCallback(() => {
    if (isPolling.current) return;
    
    console.log('Starting HTTP polling (WebSocket disconnected)');
    isPolling.current = true;
    
    // Initial fetch
    fetchCurrentData();
    
    // Set up polling interval
    pollingInterval.current = setInterval(() => {
      fetchCurrentData();
    }, 1000); // Poll every 5 seconds
    
  }, [fetchCurrentData]);

  // Stop HTTP polling when WebSocket is connected
  const stopPolling = useCallback(() => {
    if (!isPolling.current) return;
    
    console.log('Stopping HTTP polling (WebSocket connected)');
    isPolling.current = false;
    
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, []);

  // Main effect to handle data fetching strategy
  useEffect(() => {
    if (isConnected) {
      // WebSocket is connected, use subscription + stop polling
      console.log('Using WebSocket connection');
      stopPolling();
      
      // Try legacy subscription first
      const unsubscribe = subscribeToTemperatureUpdates();
      
      // Also fetch initial data
      fetchCurrentTemperature();
      
      return unsubscribe;
      
    } else {
      // WebSocket is not connected, use HTTP polling
      console.log('Using HTTP polling');
      startPolling();
      
      return () => {
        stopPolling();
      };
    }
  }, [isConnected, subscribeToTemperatureUpdates, fetchCurrentTemperature, startPolling, stopPolling]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    if (isConnected) {
      await fetchCurrentTemperature();
    } else {
      await fetchCurrentData();
    }
  }, [isConnected, fetchCurrentTemperature, fetchCurrentData]);

  // Force fetch latest data
  const forceRefresh = useCallback(async () => {
    console.log('Force refreshing sensor data');
    await fetchCurrentData();
  }, [fetchCurrentData]);

  return {
    refetch: refresh,
    forceRefresh,
    fetchCurrentData, // Direct API access
    isPolling: isPolling.current
  };
};
import { useEffect, useCallback } from "react";
import { webSocketClient } from "../../infrastructure/api/client/websocketClient";
import { useDashboardStore } from "../../app/store/dashboardStore";
import { Temperature } from "../../DTO/entities/Temperature";
import { Humidity } from "../../DTO/entities/Humidity";
import { Fan } from "../../DTO/entities/Fan";

// Define proper types for WebSocket message data
interface SensorData {
  deviceId?: string;
  temperature?: number;
  humidity?: number;
  fanState?: boolean;
  autoMode?: boolean;
  manualMode?: boolean;
  temperatureThreshold?: number;
  timestamp?: number;
}

interface DeviceStatus {
  status: 'online' | 'offline' | 'error';
  deviceId?: string;
  lastSeen?: string;
}

interface FanStatus {
  deviceId?: string;
  state: boolean;
  mode: 'auto' | 'manual';
  timestamp?: number;
}

export const useWebSocket = () => {
  const { 
    setConnected, 
    setError, 
    setTemperature, 
    setHumidity, 
    setFan 
  } = useDashboardStore();

  const handleSensorData = useCallback(
    (data: SensorData) => {
      try {
        console.log("📊 Sensor data received:", data);

        // Update temperature
        if (data.temperature !== undefined) {
          const temperature = new Temperature(
            data.temperature, 
            "celsius", 
            new Date(), 
            data.deviceId || "esp32"
          );
          setTemperature(temperature);
        }

        // Update humidity
        if (data.humidity !== undefined) {
          const humidity = new Humidity(
            data.humidity, 
            new Date(), 
            data.deviceId || "esp32"
          );
          setHumidity(humidity);
        }

        // Update fan state
        if (data.fanState !== undefined) {
          const fan = new Fan(
            data.deviceId || "esp32", 
            data.fanState ? "on" : "off", 
            data.autoMode || false, 
            new Date()
          );
          setFan(fan);
        }
      } catch (error) {
        console.error("❌ Error processing sensor data:", error);
        setError("Failed to process sensor data");
      }
    },
    [setTemperature, setHumidity, setFan, setError]
  );

  const handleDeviceStatus = useCallback(
    (data: DeviceStatus) => {
      console.log("📱 Device status update:", data);
      setConnected(data.status === "online");
    },
    [setConnected]
  );

  const handleFanStatus = useCallback(
    (data: FanStatus) => {
      try {
        console.log("🌪️ Fan status update:", data);
        const fan = new Fan(
          data.deviceId || "esp32", 
          data.state ? "on" : "off", 
          data.mode === "auto", 
          new Date()
        );
        setFan(fan);
      } catch (error) {
        console.error("❌ Error processing fan status:", error);
      }
    },
    [setFan]
  );

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        console.log("🔌 Attempting WebSocket connection...");
        await webSocketClient.connect();
        console.log("✅ WebSocket connected successfully!");
        setConnected(true);
      } catch (error) {
        console.error("❌ WebSocket connection failed:", error);
        const errorMessage = error instanceof Error ? error.message : "WebSocket connection failed";
        setError(errorMessage);
        setConnected(false);
      }
    };

    // Subscribe to WebSocket events
    const unsubscribeSensorData = webSocketClient.on("sensor_data", (data: unknown) => {
      handleSensorData(data as SensorData);
    });
    
    const unsubscribeDeviceStatus = webSocketClient.on("device_status", (data: unknown) => {
      handleDeviceStatus(data as DeviceStatus);
    });
    
    const unsubscribeFanStatus = webSocketClient.on("fan_status", (data: unknown) => {
      handleFanStatus(data as FanStatus);
    });

    // Connect WebSocket
    connectWebSocket();

    // Request initial device status
    setTimeout(() => {
      if (webSocketClient.isConnected) {
        console.log("📋 Requesting initial device status...");
        // Send request via general send method
        webSocketClient.send({
          type: 'request_status',
          data: {}
        });
      }
    }, 1000);

    return () => {
      console.log("🔌 Cleaning up WebSocket connections...");
      unsubscribeSensorData();
      unsubscribeDeviceStatus();
      unsubscribeFanStatus();
      webSocketClient.disconnect();
      setConnected(false);
    };
  }, [setConnected, setError, handleSensorData, handleDeviceStatus, handleFanStatus]);

  // Functions to control ESP32
  const controlFan = useCallback((state: boolean) => {
    console.log(`🌪️ Sending fan control: ${state ? "ON" : "OFF"}`);
    webSocketClient.send({
      type: 'fan_control',
      data: { state }
    });
  }, []);

  const updateThreshold = useCallback((threshold: number) => {
    console.log(`🌡️ Sending threshold update: ${threshold}°C`);
    webSocketClient.send({
      type: 'threshold_update',
      data: { threshold }
    });
  }, []);

  const changeMode = useCallback((autoMode: boolean, manual: boolean) => {
    console.log(`⚙️ Sending mode change: Auto=${autoMode}, Manual=${manual}`);
    webSocketClient.send({
      type: 'mode_change',
      data: { autoMode, manualMode: manual }
    });
  }, []);

  return {
    isConnected: webSocketClient.isConnected,
    send: webSocketClient.send.bind(webSocketClient),
    reconnect: webSocketClient.reconnect.bind(webSocketClient),
    controlFan,
    updateThreshold,
    changeMode,
  };
};
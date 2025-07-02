import { useEffect, useCallback } from "react";
import { webSocketClient } from "../../infrastructure/api/client/websocketClient";
import { useDashboardStore } from "../../app/store/dashboardStore";
import { Temperature } from "../../DTO/entities/Temperature";
import { Humidity } from "../../DTO/entities/Humidity";
import { Fan } from "../../DTO/entities/Fan";

export const useWebSocket = () => {
  const { setConnected, setError, setTemperature, setHumidity, setFan, manualMode, temperatureThreshold } = useDashboardStore();

  const handleSensorData = useCallback(
    (data: any) => {
      try {
        console.log("📊 Sensor data received:", data); // Debug log

        // Update temperature
        if (data.temperature !== undefined) {
          const temperature = new Temperature(data.temperature, "celsius", new Date(), data.deviceId || "esp32");
          setTemperature(temperature);
        }

        // Update humidity
        if (data.humidity !== undefined) {
          const humidity = new Humidity(data.humidity, new Date(), data.deviceId || "esp32");
          setHumidity(humidity);
        }

        // Update fan state
        if (data.fanState !== undefined) {
          const fan = new Fan(data.deviceId || "esp32", data.fanState ? "on" : "off", data.autoMode || false, new Date());
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
    (data: any) => {
      console.log("📱 Device status update:", data); // Debug log
      setConnected(data.status === "online");
    },
    [setConnected]
  );

  const handleFanStatus = useCallback(
    (data: any) => {
      try {
        console.log("🌪️ Fan status update:", data); // Debug log
        const fan = new Fan(data.deviceId || "esp32", data.state ? "on" : "off", data.mode === "auto", new Date());
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
        console.log("🔌 Attempting WebSocket connection..."); // Debug log
        await webSocketClient.connect();
        console.log("✅ WebSocket connected successfully!"); // Debug log
        setConnected(true);
      } catch (error) {
        console.error("❌ WebSocket connection failed:", error); // Debug log
        const errorMessage = error instanceof Error ? error.message : "WebSocket connection failed";
        setError(errorMessage);
        setConnected(false);
      }
    };

    // Subscribe to WebSocket events
    const unsubscribeSensorData = webSocketClient.on("sensor_data", handleSensorData);
    const unsubscribeDeviceStatus = webSocketClient.on("device_status", handleDeviceStatus);
    const unsubscribeFanStatus = webSocketClient.on("fan_status", handleFanStatus);

    // Connect WebSocket
    connectWebSocket();

    // Request initial device status
    setTimeout(() => {
      if (webSocketClient.isConnected) {
        console.log("📋 Requesting initial device status..."); // Debug log
        webSocketClient.requestDeviceStatus();
      }
    }, 1000);

    return () => {
      console.log("🔌 Cleaning up WebSocket connections..."); // Debug log
      unsubscribeSensorData();
      unsubscribeDeviceStatus();
      unsubscribeFanStatus();
      webSocketClient.disconnect();
      setConnected(false);
    };
  }, [setConnected, setError, handleSensorData, handleDeviceStatus, handleFanStatus]);

  // Functions to control ESP32
  const controlFan = useCallback((state: boolean) => {
    console.log(`🌪️ Sending fan control: ${state ? "ON" : "OFF"}`); // Debug log
    webSocketClient.sendFanControl(state);
  }, []);

  const updateThreshold = useCallback((threshold: number) => {
    console.log(`🌡️ Sending threshold update: ${threshold}°C`); // Debug log
    webSocketClient.sendThresholdUpdate(threshold);
  }, []);

  const changeMode = useCallback((autoMode: boolean, manual: boolean) => {
    console.log(`⚙️ Sending mode change: Auto=${autoMode}, Manual=${manual}`); // Debug log
    webSocketClient.sendModeChange(autoMode, manual);
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

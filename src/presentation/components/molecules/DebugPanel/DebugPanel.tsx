import React, { useState, useEffect, useCallback } from "react";
import { Card } from "../../atoms/Card/Card";
import { Button } from "../../atoms/Button/Button";
import { useDashboardStore } from "../../../../app/store/dashboardStore";

// Define interface for test data
interface TestData {
  deviceId: string;
  temperature: number;
  humidity: number;
  fanState: boolean;
  autoMode: boolean;
  manualMode: boolean;
  temperatureThreshold: number;
  timestamp: number;
  wifiRSSI: number;
  uptime: number;
}

// Define interface for API response
interface ApiHealthResponse {
  success: boolean;
  data: {
    status: string;
    connections: number;
    esp32Connected: boolean;
    deviceOnline?: boolean;
  };
  timestamp: string;
}

export const DebugPanel: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>("checking...");
  const [wsStatus, setWsStatus] = useState<string>("checking...");
  const [lastData, setLastData] = useState<TestData | null>(null);

  const { isConnected, error, temperature, humidity, fan } = useDashboardStore();

  // Test API connection
  const testAPI = useCallback(async () => {
    try {
      setApiStatus("testing...");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`);
      const data: ApiHealthResponse = await response.json();
      setApiStatus(response.ok ? "Connected ✅" : "Failed ❌");
      console.log("API Health Check:", data);
    } catch (error) {
      setApiStatus("Error ❌");
      console.error("API Test Error:", error);
    }
  }, []);

  // Test WebSocket connection
  const testWebSocket = useCallback(() => {
    try {
      setWsStatus("testing...");
      const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

      ws.onopen = () => {
        setWsStatus("Connected ✅");
        ws.close();
      };

      ws.onerror = () => {
        setWsStatus("Error ❌");
      };

      ws.onclose = () => {
        // Use a timeout to ensure state is checked after it's set
        setTimeout(() => {
          setWsStatus(prevStatus => prevStatus === "Connected ✅" ? prevStatus : "Failed ❌");
        }, 100);
      };
    } catch (error) {
      setWsStatus("Error ❌");
      console.error("WebSocket Test Error:", error);
    }
  }, []);

  // Send test data to simulate ESP32
  const sendTestData = useCallback(async () => {
    try {
      const testData: TestData = {
        deviceId: "chicken_farm_001",
        temperature: 25.5 + Math.random() * 5,
        humidity: 60 + Math.random() * 10,
        fanState: Math.random() > 0.5,
        autoMode: true,
        manualMode: false,
        temperatureThreshold: 30.0,
        timestamp: Date.now(),
        wifiRSSI: -45,
        uptime: 3600,
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sensor-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const result: unknown = await response.json();
      console.log("Test data sent:", result);
      setLastData(testData);
    } catch (error) {
      console.error("Send test data error:", error);
    }
  }, []);

  // Clear test data
  const clearTestData = useCallback(() => {
    setLastData(null);
  }, []);

  // Manual refresh connections
  const refreshConnections = useCallback(() => {
    testAPI();
    testWebSocket();
  }, [testAPI, testWebSocket]);

  useEffect(() => {
    testAPI();
    testWebSocket();
  }, [testAPI, testWebSocket]);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">🔧 Debug Panel</h3>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-300">Backend API</div>
            <div className="text-white font-medium">{apiStatus}</div>
          </div>
          <div>
            <div className="text-sm text-gray-300">WebSocket</div>
            <div className="text-white font-medium">{wsStatus}</div>
          </div>
        </div>

        {/* Configuration */}
        <div className="text-xs text-gray-400 space-y-1">
          <div>API: {import.meta.env.VITE_API_BASE_URL}</div>
          <div>WS: {import.meta.env.VITE_WEBSOCKET_URL}</div>
          <div>Device ID: {import.meta.env.VITE_ESP32_DEVICE_ID}</div>
        </div>

        {/* Current Data */}
        <div className="text-sm">
          <div className="text-gray-300">Current Data:</div>
          <div className="text-white">
            Temp: {temperature?.toCelsius()?.toFixed(1) || "N/A"}°C | 
            Humidity: {humidity?.value?.toFixed(1) || "N/A"}% | 
            Fan: {fan?.isOn() ? "ON" : "OFF"}
          </div>
          <div className="text-gray-400">
            Connected: {isConnected ? "Yes" : "No"} | 
            Error: {error || "None"}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={testAPI}>
            Test API
          </Button>
          <Button size="sm" onClick={testWebSocket}>
            Test WS
          </Button>
          <Button size="sm" onClick={sendTestData} variant="success">
            Send Test Data
          </Button>
          <Button size="sm" onClick={refreshConnections} variant="secondary">
            Refresh
          </Button>
          {lastData && (
            <Button size="sm" onClick={clearTestData} variant="danger">
              Clear Data
            </Button>
          )}
        </div>

        {/* Connection Issues Help */}
        {(apiStatus.includes('❌') || wsStatus.includes('❌')) && (
          <div className="p-3 rounded bg-yellow-900 border border-yellow-600">
            <div className="text-yellow-200 text-sm">
              <div className="font-medium mb-2">⚠️ Connection Issues:</div>
              <ul className="text-xs space-y-1">
                <li>• Check if backend server is running on port 3001</li>
                <li>• Verify IP address: {import.meta.env.VITE_API_BASE_URL}</li>
                <li>• Check firewall settings</li>
                <li>• Ensure both devices are on the same network</li>
                <li>• Try restarting the backend server</li>
              </ul>
            </div>
          </div>
        )}

        {/* Success Message */}
        {apiStatus.includes('✅') && wsStatus.includes('✅') && (
          <div className="p-3 rounded bg-green-900 border border-green-600">
            <div className="text-green-200 text-sm">
              ✅ All connections working! Ready to receive ESP32 data.
            </div>
          </div>
        )}

        {/* Last Test Data */}
        {lastData && (
          <div className="text-xs text-gray-400">
            <div className="flex justify-between items-center mb-2">
              <span>Last test data sent:</span>
              <span className="text-green-400">
                {new Date(lastData.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <pre className="bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-40">
              {JSON.stringify(lastData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};
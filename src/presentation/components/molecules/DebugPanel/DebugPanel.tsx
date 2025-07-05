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
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [connectionHistory, setConnectionHistory] = useState<Array<{timestamp: Date, status: string}>>([]);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

  const { isConnected, error, temperature, humidity, fan } = useDashboardStore();

  // Get status indicator props
  const getStatusIndicator = (status: string) => {
    if (status.includes('✅')) return { color: 'text-green-400', bg: 'bg-green-500/20', pulse: true };
    if (status.includes('❌')) return { color: 'text-red-400', bg: 'bg-red-500/20', pulse: false };
    return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', pulse: true };
  };

  // Test API connection with performance metrics
  const testAPI = useCallback(async () => {
    try {
      setApiStatus("testing...");
      const startTime = performance.now();
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`);
      const data: ApiHealthResponse = await response.json();
      
      const endTime = performance.now();
      const responseTimeMs = Math.round(endTime - startTime);
      setResponseTime(responseTimeMs);

      const status = response.ok ? "Connected ✅" : "Failed ❌";
      setApiStatus(status);
      
      // Add to connection history
      setConnectionHistory(prev => [
        ...prev.slice(-4), // Keep only last 5 entries
        { timestamp: new Date(), status: `API ${status} (${responseTimeMs}ms)` }
      ]);

      console.log("API Health Check:", data);
    } catch (error) {
      setApiStatus("Error ❌");
      setResponseTime(null);
      setConnectionHistory(prev => [
        ...prev.slice(-4),
        { timestamp: new Date(), status: "API Error ❌" }
      ]);
      console.error("API Test Error:", error);
    }
  }, []);

  // Test WebSocket connection with enhanced feedback
  const testWebSocket = useCallback(() => {
    try {
      setWsStatus("testing...");
      const startTime = performance.now();
      const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

      const timeout = setTimeout(() => {
        ws.close();
        setWsStatus("Timeout ❌");
        setConnectionHistory(prev => [
          ...prev.slice(-4),
          { timestamp: new Date(), status: "WS Timeout ❌" }
        ]);
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        const connectionTime = Math.round(performance.now() - startTime);
        setWsStatus(`Connected ✅ (${connectionTime}ms)`);
        setConnectionHistory(prev => [
          ...prev.slice(-4),
          { timestamp: new Date(), status: `WS Connected ✅ (${connectionTime}ms)` }
        ]);
        ws.close();
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        setWsStatus("Error ❌");
        setConnectionHistory(prev => [
          ...prev.slice(-4),
          { timestamp: new Date(), status: "WS Error ❌" }
        ]);
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        if (!event.wasClean && !wsStatus.includes('✅')) {
          setWsStatus("Connection Closed ❌");
        }
      };
    } catch (error) {
      setWsStatus("Error ❌");
      console.error("WebSocket Test Error:", error);
    }
  }, [wsStatus]);

  // Send test data with enhanced feedback
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
      
      setConnectionHistory(prev => [
        ...prev.slice(-4),
        { timestamp: new Date(), status: `Test Data Sent ✅` }
      ]);
    } catch (error) {
      console.error("Send test data error:", error);
      setConnectionHistory(prev => [
        ...prev.slice(-4),
        { timestamp: new Date(), status: `Test Data Failed ❌` }
      ]);
    }
  }, []);

  // Clear test data
  const clearTestData = useCallback(() => {
    setLastData(null);
    setConnectionHistory([]);
  }, []);

  // Manual refresh connections
  const refreshConnections = useCallback(() => {
    testAPI();
    testWebSocket();
  }, [testAPI, testWebSocket]);

  // Auto refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshConnections();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshConnections]);

  // Initial connection test
  useEffect(() => {
    testAPI();
    testWebSocket();
  }, [testAPI, testWebSocket]);

  const apiIndicator = getStatusIndicator(apiStatus);
  const wsIndicator = getStatusIndicator(wsStatus);

  return (
    <Card variant="glass" rounded="2xl" shadow="xl">
      {/* Header with status indicators */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30">
            <span className="text-2xl">🔧</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Debug Console</h3>
            <p className="text-sm text-slate-400">System diagnostics & testing</p>
          </div>
        </div>

        {/* Auto refresh toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Auto</span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              autoRefresh ? 'bg-green-500' : 'bg-slate-600'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              autoRefresh ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enhanced Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* API Status Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${apiIndicator.bg} ${apiIndicator.pulse ? 'animate-pulse' : ''}`}>
                  <div className={`w-full h-full rounded-full ${apiIndicator.color.replace('text-', 'bg-')}`} />
                </div>
                <span className="text-sm font-medium text-slate-300">Backend API</span>
              </div>
              {responseTime && (
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                  {responseTime}ms
                </span>
              )}
            </div>
            <div className={`font-bold ${apiIndicator.color}`}>{apiStatus}</div>
          </div>

          {/* WebSocket Status Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${wsIndicator.bg} ${wsIndicator.pulse ? 'animate-pulse' : ''}`}>
                  <div className={`w-full h-full rounded-full ${wsIndicator.color.replace('text-', 'bg-')}`} />
                </div>
                <span className="text-sm font-medium text-slate-300">WebSocket</span>
              </div>
            </div>
            <div className={`font-bold ${wsIndicator.color}`}>{wsStatus}</div>
          </div>
        </div>

        {/* Environment Configuration */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span className="text-blue-400">⚙️</span>
            Environment Configuration
          </h4>
          <div className="grid grid-cols-1 gap-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">API Base:</span>
              <span className="text-blue-400">{import.meta.env.VITE_API_BASE_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">WebSocket:</span>
              <span className="text-purple-400">{import.meta.env.VITE_WEBSOCKET_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Device ID:</span>
              <span className="text-green-400">{import.meta.env.VITE_ESP32_DEVICE_ID}</span>
            </div>
          </div>
        </div>

        {/* Real-time Data Monitor */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span className="text-green-400">📊</span>
            Live Data Stream
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="text-orange-400 text-lg font-bold">
                {temperature?.toCelsius()?.toFixed(1) || "--"}°C
              </div>
              <div className="text-xs text-slate-400">Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-lg font-bold">
                {humidity?.value?.toFixed(1) || "--"}%
              </div>
              <div className="text-xs text-slate-400">Humidity</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${fan?.isOn() ? 'text-green-400' : 'text-red-400'}`}>
                {fan?.isOn() ? "ON" : "OFF"}
              </div>
              <div className="text-xs text-slate-400">Fan Status</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? "ONLINE" : "OFFLINE"}
              </div>
              <div className="text-xs text-slate-400">Connection</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" leftIcon="🔍" onClick={testAPI}>
            Test API
          </Button>
          <Button size="sm" variant="outline" leftIcon="🔌" onClick={testWebSocket}>
            Test WebSocket
          </Button>
          <Button size="sm" variant="success" leftIcon="📤" onClick={sendTestData}>
            Send Test Data
          </Button>
          <Button size="sm" variant="secondary" leftIcon="🔄" onClick={refreshConnections}>
            Refresh All
          </Button>
          {(lastData || connectionHistory.length > 0) && (
            <Button size="sm" variant="danger" leftIcon="🗑️" onClick={clearTestData}>
              Clear History
            </Button>
          )}
        </div>

        {/* Connection History */}
        {connectionHistory.length > 0 && (
          <div className="bg-black/30 rounded-xl p-4 border border-slate-700/30">
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <span className="text-cyan-400">📝</span>
              Connection History
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {connectionHistory.map((entry, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`font-medium ${
                    entry.status.includes('✅') ? 'text-green-400' : 
                    entry.status.includes('❌') ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {(apiStatus.includes('❌') || wsStatus.includes('❌')) && (
          <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">⚠️</span>
              <div>
                <div className="text-yellow-200 font-semibold mb-2">Connection Issues Detected</div>
                <ul className="text-xs text-yellow-100 space-y-1">
                  <li>• Verify backend server is running on port 3001</li>
                  <li>• Check network connectivity and firewall settings</li>
                  <li>• Ensure both devices are on the same network</li>
                  <li>• Try restarting the backend server</li>
                  <li>• Check ESP32 device connection</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {apiStatus.includes('✅') && wsStatus.includes('✅') && (
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <div className="text-green-200 font-semibold">All Systems Operational</div>
                <div className="text-green-100 text-sm">Ready to receive ESP32 data streams</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Data Display */}
        {lastData && (
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-700/50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span className="text-purple-400">📋</span>
                Last Test Data Payload
              </h4>
              <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full">
                {new Date(lastData.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <pre className="bg-black/50 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-auto max-h-40 border border-slate-800">
              {JSON.stringify(lastData, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-xl p-4 border border-red-500/30">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">❌</span>
              <div>
                <div className="text-red-200 font-semibold">System Error</div>
                <div className="text-red-100 text-sm mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
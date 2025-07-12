import type { DeviceConfig, DeviceCommand } from "../types/device";

interface WebSocketMessage {
  device_id?: string;
  type?: string;
  command?: DeviceCommand;
  timestamp?: string;
  [key: string]: unknown;
}

export interface IDeviceCommandService {
  sendCommand(deviceId: string, command: DeviceCommand): Promise<boolean>;
  updateThreshold(deviceId: string, temperatureThreshold: number, humidityThreshold?: number): Promise<boolean>;
  updateConfig(deviceId: string, config: Partial<DeviceConfig>): Promise<boolean>;
  getConnectionStatus(): boolean;
  subscribeToCommandResponses(deviceId: string, callback: (response: string) => void): () => void;
}

export class WebSocketDeviceCommandService implements IDeviceCommandService {
  private webSocket: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, Array<(data: string) => void>> = new Map();
  private commandResponseHandlers: Map<string, Array<(response: string) => void>> = new Map();

  constructor(private webSocketUrl: string = 'ws://localhost:8080') {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    try {
      this.webSocket = new WebSocket(this.webSocketUrl);
      
      this.webSocket.onopen = () => {
        console.log('WebSocket connected to IoT devices');
        this.isConnected = true;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.webSocket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.attemptReconnect();
      };

      this.webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      };

      this.webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectTimeout) return;
    
    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      this.initializeWebSocket();
    }, 5000);
  }

  private handleWebSocketMessage(data: WebSocketMessage): void {
    const stringData = JSON.stringify(data);

    const handlers = this.messageHandlers.get('all') || [];
    handlers.forEach(handler => handler(stringData));

    if (data.device_id) {
      const deviceHandlers = this.messageHandlers.get(data.device_id) || [];
      deviceHandlers.forEach(handler => handler(stringData));
    }

    if (data.type === 'command_response' || data.type === 'threshold_updated' || data.type === 'config_updated') {
      const responseHandlers = this.commandResponseHandlers.get(data.device_id || 'all') || [];
      responseHandlers.forEach(handler => handler(stringData));
    }

    console.log('Received WebSocket message:', data);
  }

  public async sendCommand(deviceId: string, command: DeviceCommand): Promise<boolean> {
    if (!this.isConnected || !this.webSocket) {
      throw new Error('WebSocket not connected to IoT devices');
    }

    try {
      const message: WebSocketMessage = {
        device_id: deviceId,
        command: command,
        timestamp: command.timestamp.toISOString()
      };

      this.webSocket.send(JSON.stringify(message));
      console.log(`Command sent to device ${deviceId}:`, command);
      return true;
    } catch (error) {
      console.error('Error sending command:', error);
      throw new Error(`Failed to send command: ${error}`);
    }
  }

  public async updateThreshold(
    deviceId: string, 
    temperatureThreshold: number, 
    humidityThreshold?: number
  ): Promise<boolean> {
    const command: DeviceCommand = {
      type: 'threshold_update',
      payload: {
        temperatureThreshold,
        ...(humidityThreshold !== undefined && { humidityThreshold })
      },
      timestamp: new Date()
    };

    return this.sendCommand(deviceId, command);
  }

  public async updateConfig(deviceId: string, config: Partial<DeviceConfig>): Promise<boolean> {
    const command: DeviceCommand = {
      type: 'mode_change',
      payload: config,
      timestamp: new Date()
    };

    return this.sendCommand(deviceId, command);
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public subscribeToCommandResponses(deviceId: string, callback: (response: string) => void): () => void {
    if (!this.commandResponseHandlers.has(deviceId)) {
      this.commandResponseHandlers.set(deviceId, []);
    }
    
    const handlers = this.commandResponseHandlers.get(deviceId)!;
    handlers.push(callback);

    return () => {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  public subscribeToMessages(deviceId: string, callback: (data: string) => void): () => void {
    if (!this.messageHandlers.has(deviceId)) {
      this.messageHandlers.set(deviceId, []);
    }
    
    const handlers = this.messageHandlers.get(deviceId)!;
    handlers.push(callback);

    return () => {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
    
    this.isConnected = false;
    this.messageHandlers.clear();
    this.commandResponseHandlers.clear();
  }
}
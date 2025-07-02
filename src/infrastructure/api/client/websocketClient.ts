import { config } from '../../utils/config';

export type WebSocketEventHandler = (data: unknown) => void;

export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp?: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = config.websocket.maxRetries;
  private reconnectInterval = config.websocket.reconnectInterval;
  private isConnecting = false;
  private connectionId: string | null = null;

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || this.isConnected) {
        resolve();
        return;
      }

      this.isConnecting = true;
      console.log(`Connecting to WebSocket: ${config.websocket.url}`);
      
      this.ws = new WebSocket(config.websocket.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected to backend server');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.connectionId = `react_client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Send initial connection message
        this.send({
          type: 'client_connected',
          data: {
            clientType: 'react_dashboard',
            connectionId: this.connectionId,
            timestamp: Date.now()
          }
        });
        
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message.type, message.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected', { code: event.code, reason: event.reason });
        this.isConnecting = false;
        this.connectionId = null;
        
        if (event.code !== 1000) { // Not a normal closure
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        reject(error);
      };
    });
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.connectionId = null;
    this.eventHandlers.clear();
  }

  public on(event: string, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);

    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  public send(message: object): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const messageWithTimestamp = {
        ...message,
        timestamp: Date.now(),
        connectionId: this.connectionId,
      };
      this.ws.send(JSON.stringify(messageWithTimestamp));
      console.log('WebSocket message sent:', message);
    } else {
      console.warn('WebSocket is not connected, message not sent:', message);
    }
  }

  // Specific methods for ESP32 communication
  public sendFanControl(state: boolean): void {
    this.send({
      type: 'fan_control',
      data: { state }
    });
  }

  public sendThresholdUpdate(threshold: number): void {
    this.send({
      type: 'threshold_update',
      data: { threshold }
    });
  }

  public sendModeChange(autoMode: boolean, manualMode: boolean): void {
    this.send({
      type: 'mode_change',
      data: { autoMode, manualMode }
    });
  }

  public requestDeviceStatus(): void {
    this.send({
      type: 'request_status',
      data: {}
    });
  }

  private handleMessage(message: WebSocketMessage): void {
    if (!message.type) {
      console.warn('Received message without type:', message);
      return;
    }

    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message.data);
        } catch (error) {
          console.error(`Error in event handler for ${message.type}:`, error);
        }
      });
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public get connectionInfo(): { id: string | null; readyState: number | null } {
    return {
      id: this.connectionId,
      readyState: this.ws?.readyState ?? null,
    };
  }

  public async reconnect(): Promise<void> {
    this.disconnect();
    this.reconnectAttempts = 0;
    return this.connect();
  }
}

export const webSocketClient = new WebSocketClient();
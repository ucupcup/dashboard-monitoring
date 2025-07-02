import { config } from '../../utils/config';
import { WEBSOCKET_EVENTS } from '../../utils/constants';

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
      if (this.isConnecting) {
        return;
      }

      this.isConnecting = true;
      this.ws = new WebSocket(config.websocket.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Send connection event
        this.emitEvent(WEBSOCKET_EVENTS.DEVICE_STATUS, {
          status: 'connected',
          connectionId: this.connectionId,
          timestamp: Date.now(),
        });
        
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
          this.emitEvent(WEBSOCKET_EVENTS.ERROR, {
            type: 'parse_error',
            error: error instanceof Error ? error.message : 'Unknown parsing error',
            rawData: event.data,
          });
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected', { code: event.code, reason: event.reason });
        this.isConnecting = false;
        
        // Emit disconnect event
        this.emitEvent(WEBSOCKET_EVENTS.DEVICE_STATUS, {
          status: 'disconnected',
          code: event.code,
          reason: event.reason,
          timestamp: Date.now(),
        });
        
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        
        // Emit error event
        this.emitEvent(WEBSOCKET_EVENTS.ERROR, {
          type: 'connection_error',
          error: 'WebSocket connection failed',
          timestamp: Date.now(),
        });
        
        reject(error);
      };
    });
  }

  public disconnect(): void {
    if (this.ws) {
      // Send disconnect notification before closing
      this.emitEvent(WEBSOCKET_EVENTS.DEVICE_STATUS, {
        status: 'disconnecting',
        connectionId: this.connectionId,
        timestamp: Date.now(),
      });
      
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

    // Return unsubscribe function
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
    } else {
      console.warn('WebSocket is not connected');
      this.emitEvent(WEBSOCKET_EVENTS.ERROR, {
        type: 'send_error',
        message: 'Cannot send message: WebSocket not connected',
        data: message,
      });
    }
  }

  // Utility methods using WEBSOCKET_EVENTS
  public subscribeToTemperature(handler: WebSocketEventHandler): () => void {
    return this.on(WEBSOCKET_EVENTS.TEMPERATURE_UPDATE, handler);
  }

  public subscribeToHumidity(handler: WebSocketEventHandler): () => void {
    return this.on(WEBSOCKET_EVENTS.HUMIDITY_UPDATE, handler);
  }

  public subscribeToFanStatus(handler: WebSocketEventHandler): () => void {
    return this.on(WEBSOCKET_EVENTS.FAN_STATUS, handler);
  }

  public subscribeToDeviceStatus(handler: WebSocketEventHandler): () => void {
    return this.on(WEBSOCKET_EVENTS.DEVICE_STATUS, handler);
  }

  public subscribeToErrors(handler: WebSocketEventHandler): () => void {
    return this.on(WEBSOCKET_EVENTS.ERROR, handler);
  }

  private handleMessage(message: WebSocketMessage): void {
    // Validate message structure
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
          this.emitEvent(WEBSOCKET_EVENTS.ERROR, {
            type: 'handler_error',
            eventType: message.type,
            error: error instanceof Error ? error.message : 'Handler execution failed',
          });
        }
      });
    } else {
      console.debug(`No handlers registered for event type: ${message.type}`);
    }
  }

  private emitEvent(type: string, data: unknown): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
          this.emitEvent(WEBSOCKET_EVENTS.ERROR, {
            type: 'reconnect_failed',
            attempt: this.reconnectAttempts,
            maxAttempts: this.maxReconnectAttempts,
            error: error instanceof Error ? error.message : 'Reconnection failed',
          });
        });
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.emitEvent(WEBSOCKET_EVENTS.ERROR, {
        type: 'max_reconnect_reached',
        attempts: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts,
      });
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

  // Manual reconnect method
  public async reconnect(): Promise<void> {
    this.disconnect();
    this.reconnectAttempts = 0;
    return this.connect();
  }
}

export const webSocketClient = new WebSocketClient();
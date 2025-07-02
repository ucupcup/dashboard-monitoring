// src/domain/entities/Device.ts - Fixed version
import type { BaseEntity, DeviceStatus } from '../types/common';
import type { DeviceConfig } from '../types/device';

// Define interface for JSON data
interface DeviceJsonData {
  id: string;
  name: string;
  status: DeviceStatus;
  config: DeviceConfig;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export class Device implements BaseEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: DeviceStatus,
    public readonly config: DeviceConfig,
    public readonly lastSeen: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public isOnline(): boolean {
    return this.status === 'online';
  }

  public isOffline(): boolean {
    return this.status === 'offline';
  }

  public hasError(): boolean {
    return this.status === 'error';
  }

  public updateStatus(status: DeviceStatus): Device {
    return new Device(
      this.id,
      this.name,
      status,
      this.config,
      new Date(),
      this.createdAt,
      new Date()
    );
  }

  public updateConfig(config: Partial<DeviceConfig>): Device {
    const newConfig = { ...this.config, ...config };
    return new Device(
      this.id,
      this.name,
      this.status,
      newConfig,
      this.lastSeen,
      this.createdAt,
      new Date()
    );
  }

  // Additional utility methods
  public getConnectionDuration(): number {
    if (!this.isOnline()) return 0;
    return Date.now() - this.lastSeen.getTime();
  }

  public isStale(timeoutMs: number = 30000): boolean {
    const timeDiff = Date.now() - this.lastSeen.getTime();
    return timeDiff > timeoutMs;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      config: this.config,
      lastSeen: this.lastSeen.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      isOnline: this.isOnline(),
      connectionDuration: this.getConnectionDuration(),
    };
  }

  public static fromJSON(data: DeviceJsonData): Device {
    return new Device(
      data.id,
      data.name,
      data.status,
      data.config,
      new Date(data.lastSeen),
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
}

// Re-export only the types that are actually used
export type { DeviceConfig } from '../types/device';
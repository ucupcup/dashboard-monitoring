import type { BaseEntity, DeviceStatus } from '../types/common';
import type { DeviceConfig } from '../types/device';

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
}
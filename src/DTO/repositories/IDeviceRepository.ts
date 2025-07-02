import { Device } from '../entities/Device';
import { DeviceCommand, DeviceConfig } from '../entities/Device';

export interface IDeviceRepository {
  getDevice(deviceId: string): Promise<Device>;
  updateDeviceConfig(deviceId: string, config: Partial<DeviceConfig>): Promise<Device>;
  sendCommand(deviceId: string, command: DeviceCommand): Promise<boolean>;
  subscribeToDeviceStatus(
    deviceId: string,
    callback: (device: Device) => void
  ): () => void;
}
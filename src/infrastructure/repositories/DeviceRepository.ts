import { IDeviceRepository } from '@/domain/repositories/IDeviceRepository';
import { Device } from '@/domain/entities/Device';
import { DeviceConfig, DeviceCommand } from '@/domain/types/device';
import { deviceApi, DeviceApiResponse } from '@/infrastructure/api/endpoints/deviceApi';
import { webSocketClient } from '@/infrastructure/api/client/websocketClient';
import { WEBSOCKET_EVENTS } from '@/infrastructure/utils/constants';

export class DeviceRepository implements IDeviceRepository {
  public async getDevice(deviceId: string): Promise<Device> {
    try {
      const response = await deviceApi.getDevice(deviceId);
      return this.mapApiResponseToDevice(response);
    } catch (error) {
      throw new Error(`Failed to get device: ${error}`);
    }
  }

  public async updateDeviceConfig(
    deviceId: string,
    config: Partial<DeviceConfig>
  ): Promise<Device> {
    try {
      const response = await deviceApi.updateDeviceConfig(deviceId, config);
      return this.mapApiResponseToDevice(response);
    } catch (error) {
      throw new Error(`Failed to update device config: ${error}`);
    }
  }

  public async sendCommand(deviceId: string, command: DeviceCommand): Promise<boolean> {
    try {
      return await deviceApi.sendCommand(deviceId, command);
    } catch (error) {
      throw new Error(`Failed to send command: ${error}`);
    }
  }

  public subscribeToDeviceStatus(
    deviceId: string,
    callback: (device: Device) => void
  ): () => void {
    const handleDeviceStatusUpdate = (data: unknown) => {
      try {
        const response = data as DeviceApiResponse;
        if (response.id === deviceId) {
          const device = this.mapApiResponseToDevice(response);
          callback(device);
        }
      } catch (error) {
        console.error('Error processing device status update:', error);
      }
    };

    return webSocketClient.on(WEBSOCKET_EVENTS.DEVICE_STATUS, handleDeviceStatusUpdate);
  }

  private mapApiResponseToDevice(response: DeviceApiResponse): Device {
    return new Device(
      response.id,
      response.name,
      response.status,
      response.config,
      new Date(response.lastSeen),
      new Date(response.createdAt),
      new Date(response.updatedAt)
    );
  }
}
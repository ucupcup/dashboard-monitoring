import { httpClient } from '@/infrastructure/api/client/httpClient';
import { API_ENDPOINTS } from '@/infrastructure/utils/constants';
import { ApiResponse } from '@/domain/types/common';
import { DeviceConfig, DeviceCommand } from '@/domain/types/device';

export interface DeviceApiResponse {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error';
  config: DeviceConfig;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export class DeviceApi {
  public async getDevice(deviceId: string): Promise<DeviceApiResponse> {
    const response = await httpClient.get<ApiResponse<DeviceApiResponse>>(
      `${API_ENDPOINTS.DEVICE}/${deviceId}`
    );
    return response.data;
  }

  public async updateDeviceConfig(
    deviceId: string,
    config: Partial<DeviceConfig>
  ): Promise<DeviceApiResponse> {
    const response = await httpClient.put<ApiResponse<DeviceApiResponse>>(
      `${API_ENDPOINTS.DEVICE}/${deviceId}/config`,
      config
    );
    return response.data;
  }

  public async sendCommand(
    deviceId: string,
    command: DeviceCommand
  ): Promise<boolean> {
    const response = await httpClient.post<ApiResponse<{ success: boolean }>>(
      `${API_ENDPOINTS.DEVICE}/${deviceId}/commands`,
      command
    );
    return response.data.success;
  }

  public async getDeviceStatus(deviceId: string): Promise<'online' | 'offline' | 'error'> {
    const response = await httpClient.get<ApiResponse<{ status: 'online' | 'offline' | 'error' }>>(
      `${API_ENDPOINTS.DEVICE}/${deviceId}/status`
    );
    return response.data.status;
  }
}

export const deviceApi = new DeviceApi();
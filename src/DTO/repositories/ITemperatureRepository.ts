import { Temperature } from '@/DTO/entities/Temperature';
import { ApiResponse } from '@/DTO/types/common';

export interface ITemperatureRepository {
  getCurrentTemperature(deviceId: string): Promise<Temperature>;
  getTemperatureHistory(deviceId: string, limit?: number): Promise<Temperature[]>;
  subscribeToTemperatureUpdates(
    deviceId: string,
    callback: (temperature: Temperature) => void
  ): () => void;
}
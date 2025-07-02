import { Temperature } from '../entities/Temperature';
import type { ITemperatureRepository } from '../repositories/ITemperatureRepository';

export class TemperatureService {
  constructor(
    private temperatureRepository: ITemperatureRepository
  ) {}

  public async getCurrentTemperature(deviceId: string): Promise<Temperature> {
    try {
      return await this.temperatureRepository.getCurrentTemperature(deviceId);
    } catch (error) {
      throw new Error(`Failed to get current temperature: ${error}`);
    }
  }

  public async getTemperatureHistory(
    deviceId: string,
    limit = 100
  ): Promise<Temperature[]> {
    try {
      return await this.temperatureRepository.getTemperatureHistory(deviceId, limit);
    } catch (error) {
      throw new Error(`Failed to get temperature history: ${error}`);
    }
  }

  public subscribeToUpdates(
    deviceId: string,
    callback: (temperature: Temperature) => void
  ): () => void {
    return this.temperatureRepository.subscribeToTemperatureUpdates(
      deviceId,
      callback
    );
  }

  public checkTemperatureAlert(
    temperature: Temperature,
    threshold: number
  ): { isAlert: boolean; message: string } {
    const isAlert = temperature.isHigh(threshold);
    const message = isAlert
      ? `High temperature alert: ${temperature.toCelsius().toFixed(1)}°C (threshold: ${threshold}°C)`
      : 'Temperature normal';

    return { isAlert, message };
  }
}
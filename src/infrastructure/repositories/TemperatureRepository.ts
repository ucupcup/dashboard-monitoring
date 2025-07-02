import type { ITemperatureRepository } from "../../DTO/repositories/ITemperatureRepository";
import { Temperature } from "../../DTO/entities/Temperature";
import { temperatureApi } from "../../infrastructure/api/endpoints/temperatureApi";
import { webSocketClient } from "../../infrastructure/api/client/websocketClient";
import { WEBSOCKET_EVENTS } from "../../infrastructure/utils/constants";
import type { TemperatureReading } from "../../DTO/types/sensor";

export class TemperatureRepository implements ITemperatureRepository {
  public async getCurrentTemperature(deviceId: string): Promise<Temperature> {
    try {
      const reading = await temperatureApi.getCurrentTemperature(deviceId);
      return Temperature.fromReading(reading);
    } catch (error) {
      throw new Error(`Failed to get current temperature: ${error}`);
    }
  }

  public async getTemperatureHistory(deviceId: string, limit = 100): Promise<Temperature[]> {
    try {
      const readings = await temperatureApi.getTemperatureHistory(deviceId, limit);
      return readings.map((reading) => Temperature.fromReading(reading));
    } catch (error) {
      throw new Error(`Failed to get temperature history: ${error}`);
    }
  }

  public subscribeToTemperatureUpdates(deviceId: string, callback: (temperature: Temperature) => void): () => void {
    const handleTemperatureUpdate = (data: unknown) => {
      try {
        const reading = data as TemperatureReading;
        if (reading.deviceId === deviceId) {
          const temperature = Temperature.fromReading(reading);
          callback(temperature);
        }
      } catch (error) {
        console.error("Error processing temperature update:", error);
      }
    };

    return webSocketClient.on(WEBSOCKET_EVENTS.TEMPERATURE_UPDATE, handleTemperatureUpdate);
  }
}

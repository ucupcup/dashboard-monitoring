import { httpClient } from "../../api/client/httpClient";
import { API_ENDPOINTS } from "../../utils/constants";
import type { ApiResponse } from "../../../DTO/types/common";
import type { TemperatureReading } from "../../../DTO/types/sensor";

export interface TemperatureApiResponse {
  current: TemperatureReading;
  history: TemperatureReading[];
}

export class TemperatureApi {
  public async getCurrentTemperature(deviceId: string): Promise<TemperatureReading> {
    const response = await httpClient.get<ApiResponse<TemperatureReading>>(`${API_ENDPOINTS.TEMPERATURE}/current/${deviceId}`);
    return response.data;
  }

  public async getTemperatureHistory(deviceId: string, limit = 100): Promise<TemperatureReading[]> {
    const response = await httpClient.get<ApiResponse<TemperatureReading[]>>(`${API_ENDPOINTS.TEMPERATURE}/history/${deviceId}?limit=${limit}`);
    return response.data;
  }

  public async getTemperatureStats(deviceId: string): Promise<TemperatureApiResponse> {
    const response = await httpClient.get<ApiResponse<TemperatureApiResponse>>(`${API_ENDPOINTS.TEMPERATURE}/stats/${deviceId}`);
    return response.data;
  }
}

export const temperatureApi = new TemperatureApi();

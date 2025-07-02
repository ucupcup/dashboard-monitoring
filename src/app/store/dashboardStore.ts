import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Temperature } from "../../DTO/entities/Temperature";
import { Humidity } from "../../DTO/entities/Humidity";
import { Fan } from "../../DTO/entities/Fan";
import { Device } from "../../DTO/entities/Device";

export interface DashboardState {
  // Data State
  temperature: Temperature | null;
  humidity: Humidity | null;
  fan: Fan | null;
  device: Device | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdate: Date | null;

  // Control State
  manualMode: boolean;
  temperatureThreshold: number;

  // Actions
  setTemperature: (temperature: Temperature) => void;
  setHumidity: (humidity: Humidity) => void;
  setFan: (fan: Fan) => void;
  setDevice: (device: Device) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnected: (connected: boolean) => void;
  setManualMode: (manual: boolean) => void;
  setTemperatureThreshold: (threshold: number) => void;
  reset: () => void;
}

const initialState = {
  temperature: null,
  humidity: null,
  fan: null,
  device: null,
  isLoading: false,
  error: null,
  isConnected: false,
  lastUpdate: null,
  manualMode: false,
  temperatureThreshold: 30,
};

export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    setTemperature: (temperature: Temperature) => 
      set({ temperature, lastUpdate: new Date(), error: null }),

    setHumidity: (humidity: Humidity) => 
      set({ humidity, lastUpdate: new Date(), error: null }),

    setFan: (fan: Fan) => 
      set({ fan, lastUpdate: new Date(), error: null }),

    setDevice: (device: Device) => 
      set({ device, lastUpdate: new Date(), error: null }),

    setLoading: (isLoading: boolean) => set({ isLoading }),

    setError: (error: string | null) => set({ error, isLoading: false }),

    setConnected: (isConnected: boolean) => set({ isConnected }),

    setManualMode: (manualMode: boolean) => set({ manualMode }),

    setTemperatureThreshold: (temperatureThreshold: number) => 
      set({ temperatureThreshold }),

    reset: () => set(initialState),
  }))
);

// Selectors
export const useTemperature = () => useDashboardStore((state) => state.temperature);
export const useHumidity = () => useDashboardStore((state) => state.humidity);
export const useFan = () => useDashboardStore((state) => state.fan);
export const useDevice = () => useDashboardStore((state) => state.device);
export const useIsLoading = () => useDashboardStore((state) => state.isLoading);
export const useError = () => useDashboardStore((state) => state.error);
export const useIsConnected = () => useDashboardStore((state) => state.isConnected);
export const useManualMode = () => useDashboardStore((state) => state.manualMode);
export const useTemperatureThreshold = () => useDashboardStore((state) => state.temperatureThreshold);
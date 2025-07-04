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
  
  // New Control Actions
  controlFan: (state: boolean) => Promise<void>;
  changeModeAndNotifyBackend: (manual: boolean) => Promise<void>;
  updateThresholdOnBackend: (threshold: number) => Promise<void>;
  
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

// API helper functions
const apiCall = async (endpoint: string, data: any, method: string = 'POST') => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector((set, get) => ({
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

    // New control actions
    controlFan: async (state: boolean) => {
      try {
        set({ isLoading: true, error: null });
        
        await apiCall('fan-control', {
          state,
          deviceId: 'chicken_farm_001',
          mode: 'manual'
        });

        console.log(`Fan control sent: ${state ? 'ON' : 'OFF'}`);
        
      } catch (error) {
        console.error('Fan control failed:', error);
        set({ error: error instanceof Error ? error.message : 'Fan control failed' });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    changeModeAndNotifyBackend: async (manual: boolean) => {
      try {
        set({ isLoading: true, error: null });
        
        await apiCall('mode', {
          autoMode: !manual,
          manualMode: manual,
          deviceId: 'chicken_farm_001'
        });

        set({ manualMode: manual });
        console.log(`Mode changed to: ${manual ? 'Manual' : 'Auto'}`);
        
      } catch (error) {
        console.error('Mode change failed:', error);
        set({ error: error instanceof Error ? error.message : 'Mode change failed' });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    updateThresholdOnBackend: async (threshold: number) => {
      try {
        set({ isLoading: true, error: null });
        
        await apiCall('threshold', {
          threshold,
          deviceId: 'chicken_farm_001'
        });

        set({ temperatureThreshold: threshold });
        console.log(`Threshold updated to: ${threshold}°C`);
        
      } catch (error) {
        console.error('Threshold update failed:', error);
        set({ error: error instanceof Error ? error.message : 'Threshold update failed' });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    reset: () => set(initialState),
  }))
);

// Selectors (unchanged)
export const useTemperature = () => useDashboardStore((state) => state.temperature);
export const useHumidity = () => useDashboardStore((state) => state.humidity);
export const useFan = () => useDashboardStore((state) => state.fan);
export const useDevice = () => useDashboardStore((state) => state.device);
export const useIsLoading = () => useDashboardStore((state) => state.isLoading);
export const useError = () => useDashboardStore((state) => state.error);
export const useIsConnected = () => useDashboardStore((state) => state.isConnected);
export const useManualMode = () => useDashboardStore((state) => state.manualMode);
export const useTemperatureThreshold = () => useDashboardStore((state) => state.temperatureThreshold);
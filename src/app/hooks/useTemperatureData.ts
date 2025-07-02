import { useEffect, useCallback } from 'react';
import { TemperatureService } from '@/domain/services/TemperatureService';
import { TemperatureRepository } from '@/infrastructure/repositories/TemperatureRepository';
import { useDashboardStore } from '@/app/store/dashboardStore';
import { config } from '@/infrastructure/utils/config';

const temperatureService = new TemperatureService(new TemperatureRepository());

export const useTemperatureData = (deviceId: string = config.device.id) => {
  const { setTemperature, setLoading, setError } = useDashboardStore();

  const fetchCurrentTemperature = useCallback(async () => {
    try {
      setLoading(true);
      const temperature = await temperatureService.getCurrentTemperature(deviceId);
      setTemperature(temperature);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch temperature');
    } finally {
      setLoading(false);
    }
  }, [deviceId, setTemperature, setLoading, setError]);

  const subscribeToTemperatureUpdates = useCallback(() => {
    const unsubscribe = temperatureService.subscribeToUpdates(
      deviceId,
      (temperature) => {
        setTemperature(temperature);
      }
    );

    return unsubscribe;
  }, [deviceId, setTemperature]);

  useEffect(() => {
    fetchCurrentTemperature();
    const unsubscribe = subscribeToTemperatureUpdates();

    return unsubscribe;
  }, [fetchCurrentTemperature, subscribeToTemperatureUpdates]);

  return {
    refetch: fetchCurrentTemperature,
  };
};
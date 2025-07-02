import { useCallback } from 'react';
import { FanControlService } from '../../DTO/services/FanControlService';
import { DeviceRepository } from '../../infrastructure/repositories/DeviceRepository';
import { useDashboardStore } from '../store/dashboardStore';
import { Fan } from '../../DTO/entities/Fan';
import { config } from '../../infrastructure/utils/config';

const fanControlService = new FanControlService(new DeviceRepository());

export const useFanControl = (deviceId: string = config.device.id) => {
  const { setFan, setError, manualMode } = useDashboardStore();

  const controlFan = useCallback(async (state: 'on' | 'off') => {
    try {
      const success = await fanControlService.controlFan(deviceId, state);
      if (success) {
        const newFan = new Fan(deviceId, state, manualMode);
        setFan(newFan);
      } else {
        setError('Failed to control fan');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fan control error');
    }
  }, [deviceId, manualMode, setFan, setError]);

  const toggleFan = useCallback(async (currentState: 'on' | 'off') => {
    const newState = currentState === 'on' ? 'off' : 'on';
    await controlFan(newState);
  }, [controlFan]);

  return {
    controlFan,
    toggleFan,
  };
};
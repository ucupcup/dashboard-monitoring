import { useEffect } from "react";
import { useDashboardStore } from "../store/dashboardStore";
import { FanControlService } from "../../DTO/services/FanControlService";
import { DeviceRepository } from "../../infrastructure/repositories/DeviceRepository";
import { config } from "../../infrastructure/utils/config";

const fanControlService = new FanControlService(new DeviceRepository());

export const useAutoFanControl = (deviceId: string = config.device.id) => {
  const { temperature, fan, temperatureThreshold, manualMode, setFan, setError } = useDashboardStore();

  useEffect(() => {
    const performAutoControl = async () => {
      if (!temperature || !fan || manualMode) {
        return;
      }

      try {
        await fanControlService.autoControlFan(deviceId, temperature, temperatureThreshold, fan);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Auto fan control error");
      }
    };

    performAutoControl();
  }, [temperature, fan, temperatureThreshold, manualMode, deviceId, setFan, setError]);
};

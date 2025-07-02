import { Fan } from "../entities/Fan";
import { Temperature } from "../entities/Temperature";
import type { IDeviceRepository } from "../repositories/IDeviceRepository";
import type { DeviceCommand } from "../types/device";

export class FanControlService {
  constructor(private deviceRepository: IDeviceRepository) {}

  public async controlFan(deviceId: string, fanState: "on" | "off"): Promise<boolean> {
    const command: DeviceCommand = {
      type: "fan_control",
      payload: { state: fanState },
      timestamp: new Date(),
    };

    try {
      return await this.deviceRepository.sendCommand(deviceId, command);
    } catch (error) {
      throw new Error(`Failed to control fan: ${error}`);
    }
  }

  public shouldTurnOnFan(temperature: Temperature, threshold: number, fan: Fan): boolean {
    if (!fan.isAutomatic()) {
      return fan.isOn();
    }

    return temperature.isHigh(threshold);
  }

  public async autoControlFan(deviceId: string, temperature: Temperature, threshold: number, currentFan: Fan): Promise<boolean> {
    if (!currentFan.isAutomatic()) {
      return false;
    }

    const shouldBeOn = this.shouldTurnOnFan(temperature, threshold, currentFan);
    const currentlyOn = currentFan.isOn();

    if (shouldBeOn !== currentlyOn) {
      return this.controlFan(deviceId, shouldBeOn ? "on" : "off");
    }

    return true;
  }
}

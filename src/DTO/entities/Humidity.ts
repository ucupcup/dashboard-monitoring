import type { HumidityReading } from '../types/sensor';

export class Humidity {
  constructor(
    public readonly value: number,
    public readonly timestamp: Date = new Date(),
    public readonly deviceId: string
  ) {
    this.validateHumidity();
  }

  private validateHumidity(): void {
    if (this.value < 0 || this.value > 100) {
      throw new Error('Humidity value must be between 0 and 100');
    }
  }

  public isHigh(threshold: number): boolean {
    return this.value > threshold;
  }

  public isLow(threshold: number): boolean {
    return this.value < threshold;
  }

  public toReading(): HumidityReading {
    return {
      value: this.value,
      unit: '%',
      timestamp: this.timestamp,
      deviceId: this.deviceId,
    };
  }

  public static fromReading(reading: HumidityReading): Humidity {
    return new Humidity(
      reading.value,
      reading.timestamp,
      reading.deviceId
    );
  }
}
import type { TemperatureReading, TemperatureUnit } from '../types/sensor';

export class Temperature {
  constructor(
    public readonly value: number,
    public readonly unit: TemperatureUnit,
    public readonly timestamp: Date = new Date(),
    public readonly deviceId: string
  ) {
    this.validateTemperature();
  }

  private validateTemperature(): void {
    if (this.value < -50 || this.value > 100) {
      throw new Error('Temperature value out of valid range');
    }
  }

  public toCelsius(): number {
    if (this.unit === 'fahrenheit') {
      return (this.value - 32) * 5 / 9;
    }
    return this.value;
  }

  public toFahrenheit(): number {
    if (this.unit === 'celsius') {
      return (this.value * 9 / 5) + 32;
    }
    return this.value;
  }

  public isHigh(threshold: number): boolean {
    return this.toCelsius() > threshold;
  }

  public toReading(): TemperatureReading {
    return {
      value: this.value,
      unit: this.unit,
      timestamp: this.timestamp,
      deviceId: this.deviceId,
    };
  }

  public static fromReading(reading: TemperatureReading): Temperature {
    return new Temperature(
      reading.value,
      reading.unit,
      reading.timestamp,
      reading.deviceId
    );
  }
}

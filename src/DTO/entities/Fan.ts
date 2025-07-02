import type { FanState } from '../types/common';

export class Fan {
  constructor(
    public readonly id: string,
    public readonly state: FanState,
    public readonly isAutoMode: boolean = false,
    public readonly lastUpdated: Date = new Date()
  ) {}

  public isOn(): boolean {
    return this.state === 'on';
  }

  public isOff(): boolean {
    return this.state === 'off';
  }

  public isAutomatic(): boolean {
    return this.isAutoMode;
  }

  public turnOn(): Fan {
    return new Fan(this.id, 'on', this.isAutoMode, new Date());
  }

  public turnOff(): Fan {
    return new Fan(this.id, 'off', this.isAutoMode, new Date());
  }

  public setAutoMode(auto: boolean): Fan {
    return new Fan(this.id, auto ? 'auto' : this.state, auto, new Date());
  }
}
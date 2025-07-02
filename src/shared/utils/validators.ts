export const validateTemperature = (value: number): boolean => {
  return value >= -50 && value <= 100;
};

export const validateHumidity = (value: number): boolean => {
  return value >= 0 && value <= 100;
};

export const validateThreshold = (value: number): boolean => {
  return value >= 10 && value <= 50;
};

export const validateDeviceId = (deviceId: string): boolean => {
  return deviceId.length > 0 && /^[a-zA-Z0-9_-]+$/.test(deviceId);
};
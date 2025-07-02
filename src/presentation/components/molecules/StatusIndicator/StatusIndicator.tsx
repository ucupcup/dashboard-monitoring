import React from 'react';
import { Card } from '@/presentation/components/atoms/Card/Card';
import { useFan, useIsConnected } from '@/app/store/dashboardStore';
import { formatTimestamp } from '@/shared/utils/formatters';

export const StatusIndicator: React.FC = () => {
  const fan = useFan();
  const isConnected = useIsConnected();

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Fan Status</h3>
      <div className="text-center space-y-4">
        <div className="text-3xl font-bold text-white">
          {fan?.isOn() ? 'Kipas ON' : 'Kipas OFF'}
        </div>
        <div className="flex justify-center">
          <div
            className={`w-4 h-4 rounded-full ${
              fan?.isOn() ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </div>
        <div className="text-sm text-gray-400">
          Last update: {formatTimestamp(new Date())}
        </div>
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </Card>
  );
};
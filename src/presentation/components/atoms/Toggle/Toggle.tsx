import React from 'react';
import { clsx } from 'clsx';

export interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onToggle,
  disabled = false,
  size = 'md',
  label,
}) => {
  const sizeClasses = {
    sm: { container: 'h-6 w-11', thumb: 'h-4 w-4', translate: 'translate-x-6' },
    md: { container: 'h-8 w-14', thumb: 'h-6 w-6', translate: 'translate-x-7' },
    lg: { container: 'h-10 w-18', thumb: 'h-8 w-8', translate: 'translate-x-9' },
  };

  const { container, thumb, translate } = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm text-gray-300">{label}</span>}
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={clsx(
          'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
          container,
          {
            'bg-blue-600': isOn,
            'bg-gray-600': !isOn,
            'opacity-50 cursor-not-allowed': disabled,
            'cursor-pointer': !disabled,
          }
        )}
      >
        <span
          className={clsx(
            'inline-block transform rounded-full bg-white transition-transform',
            thumb,
            {
              [translate]: isOn,
              'translate-x-1': !isOn,
            }
          )}
        />
      </button>
    </div>
  );
};
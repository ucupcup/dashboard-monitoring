import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  showValue?: boolean;
  variant?: 'default' | 'temperature' | 'danger' | 'success' | 'neon' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTicks?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  colorStops?: Array<{ value: number; color: string }>;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit,
  disabled = false,
  showValue = true,
  variant = 'default',
  size = 'md',
  showTicks = false,
  showTooltip = false,
  animate = true,
  colorStops,
  icon,
  suffix,
  prefix,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const percentage = ((value - min) / (max - min)) * 100;

  // Generate tick marks
  const ticks = showTicks ? Array.from(
    { length: Math.min(11, Math.floor((max - min) / step) + 1) },
    (_, i) => min + (i * (max - min) / (showTicks ? 10 : Math.floor((max - min) / step)))
  ) : [];

  // Variant configurations
  const variantConfig = {
    default: {
      track: 'bg-slate-700',
      fill: 'from-blue-500 to-blue-600',
      thumb: 'bg-blue-500 border-blue-400',
      glow: 'shadow-blue-500/50',
    },
    temperature: {
      track: 'bg-slate-700',
      fill: 'from-orange-500 via-red-500 to-red-600',
      thumb: 'bg-red-500 border-red-400',
      glow: 'shadow-red-500/50',
    },
    danger: {
      track: 'bg-slate-700',
      fill: 'from-red-500 to-red-600',
      thumb: 'bg-red-500 border-red-400',
      glow: 'shadow-red-500/50',
    },
    success: {
      track: 'bg-slate-700',
      fill: 'from-green-500 to-green-600',
      thumb: 'bg-green-500 border-green-400',
      glow: 'shadow-green-500/50',
    },
    neon: {
      track: 'bg-slate-900 border border-cyan-500/30',
      fill: 'from-cyan-400 to-cyan-500',
      thumb: 'bg-cyan-400 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)]',
      glow: 'shadow-cyan-400/60',
    },
    gradient: {
      track: 'bg-gradient-to-r from-slate-800 to-slate-700',
      fill: 'from-purple-500 via-blue-500 to-cyan-500',
      thumb: 'bg-gradient-to-br from-purple-400 to-cyan-400 border-white/50',
      glow: 'shadow-purple-500/50',
    },
  };

  const sizeConfig = {
    sm: {
      track: 'h-1.5',
      thumb: 'w-4 h-4',
      tooltip: 'text-xs px-2 py-1',
    },
    md: {
      track: 'h-2',
      thumb: 'w-5 h-5',
      tooltip: 'text-sm px-3 py-1.5',
    },
    lg: {
      track: 'h-3',
      thumb: 'w-6 h-6',
      tooltip: 'text-base px-3 py-2',
    },
    xl: {
      track: 'h-4',
      thumb: 'w-8 h-8',
      tooltip: 'text-lg px-4 py-2',
    },
  };

  // Dynamic color based on color stops
  const getGradientFromStops = () => {
    if (!colorStops) return variantConfig[variant].fill;
    
    const sortedStops = [...colorStops].sort((a, b) => a.value - b.value);
    const gradientStops = sortedStops.map(stop => {
      const stopPercentage = ((stop.value - min) / (max - min)) * 100;
      return `${stop.color} ${stopPercentage}%`;
    }).join(', ');
    
    return `linear-gradient(to right, ${gradientStops})`;
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = () => {
      if (isDragging && animate) {
        // Add subtle vibration effect during drag
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, animate]);

  return (
    <div className={clsx('space-y-3', { 'opacity-50': disabled })}>
      {/* Header */}
      {(label || showValue || icon) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={clsx(
                'p-1.5 rounded-lg bg-slate-800 border border-slate-600',
                variantConfig[variant].glow
              )}>
                {icon}
              </div>
            )}
            {label && (
              <span className="text-sm font-medium text-slate-300">{label}</span>
            )}
          </div>
          
          {showValue && (
            <div className="flex items-center gap-1">
              <span className={clsx(
                'font-bold transition-all duration-300',
                size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : size === 'xl' ? 'text-2xl' : 'text-lg',
                isDragging ? 'text-white scale-110' : 'text-slate-200'
              )}>
                {prefix}{value}{suffix || unit}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Slider Container */}
      <div className="relative px-2" ref={sliderRef}>
        {/* Track */}
        <div className={clsx(
          'relative rounded-full overflow-hidden transition-all duration-300',
          sizeConfig[size].track,
          variantConfig[variant].track,
          {
            'shadow-lg': isDragging,
            'scale-105': isDragging && animate,
          }
        )}>
          {/* Fill */}
          <div 
            className={clsx(
              'absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out',
              `bg-gradient-to-r ${variantConfig[variant].fill}`,
              {
                'shadow-lg': variant === 'neon',
                'animate-pulse': animate && isDragging,
              }
            )}
            style={{ 
              width: `${percentage}%`,
              ...(colorStops && { background: getGradientFromStops() })
            }}
          />
          
          {/* Glow effect for neon variant */}
          {variant === 'neon' && (
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400/50 to-cyan-500/50 blur-sm"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>

        {/* Ticks */}
        {showTicks && (
          <div className="absolute top-0 left-0 right-0 flex justify-between pointer-events-none">
            {ticks.map((tick, index) => (
              <div
                key={index}
                className={clsx(
                  'w-0.5 bg-slate-500 transition-colors duration-200',
                  sizeConfig[size].track.replace('h-', 'h-'),
                  {
                    'bg-white': ((tick - min) / (max - min)) * 100 <= percentage,
                  }
                )}
              />
            ))}
          </div>
        )}

        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseEnter={() => setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
          disabled={disabled}
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent cursor-pointer focus:outline-none"
          style={{
            background: 'transparent',
          }}
        />

        {/* Custom Thumb */}
        <div
          className={clsx(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 transition-all duration-300 cursor-pointer',
            sizeConfig[size].thumb,
            variantConfig[variant].thumb,
            {
              'scale-125 shadow-lg': isDragging,
              [`${variantConfig[variant].glow} shadow-lg`]: isDragging || variant === 'neon',
              'animate-pulse': animate && isDragging,
            },
            disabled ? 'cursor-not-allowed' : 'hover:scale-110'
          )}
          style={{ left: `${percentage}%` }}
        >
          {/* Inner dot for enhanced visual */}
          <div className={clsx(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white',
            size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2 h-2' : size === 'xl' ? 'w-3 h-3' : 'w-1.5 h-1.5'
          )} />
        </div>

        {/* Tooltip */}
        {(showTooltip || showTooltipState) && (
          <div
            className={clsx(
              'absolute -top-12 -translate-x-1/2 bg-slate-900 border border-slate-600 rounded-lg shadow-xl transition-all duration-200',
              sizeConfig[size].tooltip,
              'text-white font-medium whitespace-nowrap',
              {
                'opacity-100 scale-100': showTooltipState || isDragging,
                'opacity-0 scale-95': !showTooltipState && !isDragging,
              }
            )}
            style={{ left: `${percentage}%` }}
          >
            {prefix}{value}{suffix || unit}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </div>
        )}
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-slate-400 px-2">
        <span className="flex items-center gap-1">
          {min}{unit}
        </span>
        <span className="flex items-center gap-1">
          {max}{unit}
        </span>
      </div>

      {/* Progress Indicator */}
      {animate && (
        <div className="flex justify-center">
          <div className={clsx(
            'h-1 bg-slate-700 rounded-full overflow-hidden transition-all duration-300',
            size === 'sm' ? 'w-16' : size === 'lg' ? 'w-24' : size === 'xl' ? 'w-32' : 'w-20'
          )}>
            <div 
              className={clsx(
                'h-full rounded-full transition-all duration-300',
                `bg-gradient-to-r ${variantConfig[variant].fill}`
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
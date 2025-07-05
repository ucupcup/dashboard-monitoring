import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'neon' | 'gradient';
  label?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showStatus?: boolean;
  animated?: boolean;
  loading?: boolean;
  sound?: boolean;
  haptic?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onToggle,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  description,
  leftIcon,
  rightIcon,
  showStatus = false,
  animated = true,
  loading = false,
  sound = false,
  haptic = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Size configurations
  const sizeConfig = {
    xs: { 
      container: 'h-4 w-8', 
      thumb: 'h-3 w-3', 
      translate: 'translate-x-4',
      padding: 'p-0.5',
      gap: 'gap-1.5',
      text: 'text-xs',
    },
    sm: { 
      container: 'h-5 w-10', 
      thumb: 'h-4 w-4', 
      translate: 'translate-x-5',
      padding: 'p-0.5',
      gap: 'gap-2',
      text: 'text-sm',
    },
    md: { 
      container: 'h-6 w-12', 
      thumb: 'h-5 w-5', 
      translate: 'translate-x-6',
      padding: 'p-0.5',
      gap: 'gap-3',
      text: 'text-sm',
    },
    lg: { 
      container: 'h-8 w-16', 
      thumb: 'h-7 w-7', 
      translate: 'translate-x-8',
      padding: 'p-0.5',
      gap: 'gap-3',
      text: 'text-base',
    },
    xl: { 
      container: 'h-10 w-20', 
      thumb: 'h-9 w-9', 
      translate: 'translate-x-10',
      padding: 'p-0.5',
      gap: 'gap-4',
      text: 'text-lg',
    },
  };

  // Variant configurations
  const variantConfig = {
    default: {
      on: 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/25',
      off: 'bg-slate-700 border border-slate-600',
      thumb: 'bg-white shadow-lg',
      glow: 'shadow-blue-500/50',
      focus: 'focus:ring-blue-500',
    },
    success: {
      on: 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/25',
      off: 'bg-slate-700 border border-slate-600',
      thumb: 'bg-white shadow-lg',
      glow: 'shadow-green-500/50',
      focus: 'focus:ring-green-500',
    },
    danger: {
      on: 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/25',
      off: 'bg-slate-700 border border-slate-600',
      thumb: 'bg-white shadow-lg',
      glow: 'shadow-red-500/50',
      focus: 'focus:ring-red-500',
    },
    warning: {
      on: 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/25',
      off: 'bg-slate-700 border border-slate-600',
      thumb: 'bg-white shadow-lg',
      glow: 'shadow-yellow-500/50',
      focus: 'focus:ring-yellow-500',
    },
    neon: {
      on: 'bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/50',
      off: 'bg-slate-900 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
      thumb: 'bg-gradient-to-br from-cyan-200 to-white shadow-[0_0_15px_rgba(6,182,212,0.6)]',
      glow: 'shadow-cyan-400/60',
      focus: 'focus:ring-cyan-400',
    },
    gradient: {
      on: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-purple-500/25',
      off: 'bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600',
      thumb: 'bg-gradient-to-br from-white to-gray-100 shadow-lg',
      glow: 'shadow-purple-500/50',
      focus: 'focus:ring-purple-500',
    },
  };

  const { container, thumb, translate, padding, gap, text } = sizeConfig[size];
  const colors = variantConfig[variant];

  // Handle toggle with effects
  const handleToggle = () => {
    if (disabled || loading) return;

    // Haptic feedback simulation
    if (haptic) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 100);
    }

    // Sound feedback simulation
    if (sound) {
      // In a real app, you'd play an actual sound
      console.log('🔊 Toggle sound effect');
    }

    onToggle();
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className={clsx(
      'absolute inset-0 flex items-center justify-center',
      container
    )}>
      <div className={clsx(
        'rounded-full border-2 border-white border-t-transparent animate-spin',
        size === 'xs' ? 'w-2 h-2' :
        size === 'sm' ? 'w-2.5 h-2.5' :
        size === 'md' ? 'w-3 h-3' :
        size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
      )} />
    </div>
  );

  return (
    <div className={clsx('flex items-center', gap)}>
      {/* Left content */}
      <div className="flex items-center gap-2">
        {leftIcon && (
          <div className={clsx(
            'flex items-center justify-center rounded-lg bg-slate-800 border border-slate-600 p-2',
            isOn && colors.glow,
            text
          )}>
            {leftIcon}
          </div>
        )}
        
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className={clsx(
                'font-medium text-slate-200',
                text,
                { 'text-slate-400': disabled }
              )}>
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-400">
                {description}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Toggle Switch */}
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          disabled={disabled || loading}
          className={clsx(
            'relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
            container,
            padding,
            colors.focus,
            {
              [colors.on]: isOn && !loading,
              [colors.off]: !isOn && !loading,
              'opacity-50 cursor-not-allowed': disabled,
              'cursor-pointer': !disabled && !loading,
              'scale-95': isPressed && !disabled,
              'hover:scale-105': !disabled && !loading && animated,
              'shadow-2xl': isOn && variant === 'neon',
            }
          )}
          aria-pressed={isOn}
          role="switch"
        >
          {/* Background Glow for Neon */}
          {variant === 'neon' && isOn && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-cyan-500/20 blur-md" />
          )}

          {/* Thumb */}
          <span
            className={clsx(
              'relative inline-block transform rounded-full transition-all duration-300 ease-out',
              thumb,
              colors.thumb,
              {
                [translate]: isOn,
                'translate-x-0.5': !isOn,
                'scale-110': isPressed && !disabled,
                'shadow-2xl': isOn && variant === 'neon',
                [`${colors.glow} shadow-lg`]: isOn && animated,
              }
            )}
          >
            {/* Inner glow for neon variant */}
            {variant === 'neon' && isOn && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/30 to-transparent" />
            )}

            {/* Thumb indicator dot */}
            <div className={clsx(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300',
              size === 'xs' ? 'w-1 h-1' :
              size === 'sm' ? 'w-1.5 h-1.5' :
              size === 'md' ? 'w-2 h-2' :
              size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3',
              {
                'bg-blue-500': isOn && variant === 'default',
                'bg-green-500': isOn && variant === 'success',
                'bg-red-500': isOn && variant === 'danger',
                'bg-yellow-500': isOn && variant === 'warning',
                'bg-cyan-400': isOn && variant === 'neon',
                'bg-purple-500': isOn && variant === 'gradient',
                'bg-slate-400': !isOn,
              }
            )} />
          </span>

          {/* Loading overlay */}
          {loading && <LoadingSpinner />}

          {/* Track indicators */}
          {!loading && (
            <>
              {/* ON indicator */}
              <div className={clsx(
                'absolute left-1 top-1/2 -translate-y-1/2 text-white font-bold transition-opacity duration-300',
                size === 'xs' ? 'text-[0.5rem]' :
                size === 'sm' ? 'text-xs' :
                size === 'md' ? 'text-xs' :
                size === 'lg' ? 'text-sm' : 'text-base',
                {
                  'opacity-100': isOn,
                  'opacity-0': !isOn,
                }
              )}>
                {size === 'xs' || size === 'sm' ? '•' : 'ON'}
              </div>

              {/* OFF indicator */}
              <div className={clsx(
                'absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 font-bold transition-opacity duration-300',
                size === 'xs' ? 'text-[0.5rem]' :
                size === 'sm' ? 'text-xs' :
                size === 'md' ? 'text-xs' :
                size === 'lg' ? 'text-sm' : 'text-base',
                {
                  'opacity-0': isOn,
                  'opacity-100': !isOn,
                }
              )}>
                {size === 'xs' || size === 'sm' ? '•' : 'OFF'}
              </div>
            </>
          )}
        </button>

        {/* Status indicator */}
        {showStatus && (
          <div className={clsx(
            'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 transition-all duration-300',
            {
              'bg-green-500 animate-pulse': isOn,
              'bg-slate-500': !isOn,
            }
          )} />
        )}
      </div>

      {/* Right content */}
      {rightIcon && (
        <div className={clsx(
          'flex items-center justify-center rounded-lg bg-slate-800 border border-slate-600 p-2',
          isOn && colors.glow,
          text
        )}>
          {rightIcon}
        </div>
      )}

      {/* Status text */}
      {showStatus && (
        <span className={clsx(
          'font-medium transition-colors duration-300',
          text,
          {
            'text-green-400': isOn,
            'text-slate-400': !isOn,
          }
        )}>
          {isOn ? 'Active' : 'Inactive'}
        </span>
      )}
    </div>
  );
};
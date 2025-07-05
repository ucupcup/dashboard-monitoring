import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = 'lg',
  shadow = 'md',
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transform active:scale-95 disabled:transform-none';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 border border-blue-600 hover:border-blue-700',
    secondary: 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 focus:ring-slate-500 border border-slate-600 hover:border-slate-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 border border-red-600 hover:border-red-700',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 border border-green-600 hover:border-green-700',
    ghost: 'bg-transparent text-slate-300 hover:bg-white/10 hover:text-white focus:ring-slate-500 border border-transparent hover:border-slate-600',
    outline: 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500 border border-slate-600 hover:border-slate-500',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
  };

  const LoadingSpinner = () => (
    <div className="relative">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-75" />
    </div>
  );

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        shadowClasses[shadow],
        {
          'w-full': fullWidth,
          'opacity-50 cursor-not-allowed pointer-events-none': disabled || isLoading,
          'hover:scale-105': !disabled && !isLoading,
          'backdrop-blur-sm': variant === 'ghost',
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Left Icon or Loading */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        leftIcon && (
          <span className="flex-shrink-0">
            {leftIcon}
          </span>
        )
      )}
      
      {/* Button Content */}
      <span className={clsx(
        'flex-1 text-center',
        {
          'opacity-75': isLoading,
        }
      )}>
        {children}
      </span>
      
      {/* Right Icon */}
      {rightIcon && !isLoading && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </button>
  );
};
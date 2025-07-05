import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'gradient' | 'neon';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hover?: boolean;
  glow?: boolean;
  animated?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  status?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  hover = false,
  glow = false,
  animated = false,
  header,
  footer,
  status = 'default',
  className,
  ...props
}) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-500 ease-out';
  
  const variantClasses = {
    default: 'bg-slate-800 border border-slate-700',
    bordered: 'bg-slate-800/90 border-2 border-slate-600',
    elevated: 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700',
    glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
    gradient: 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border border-slate-600',
    neon: 'bg-slate-900 border border-cyan-500/50',
  };

  const paddingClasses = {
    none: '',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  const statusClasses = {
    default: '',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-yellow-500',
    error: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-blue-500',
  };

  const hoverClasses = hover ? 'hover:scale-105 hover:shadow-2xl cursor-pointer' : '';
  const glowClasses = glow ? 'before:absolute before:inset-0 before:rounded-lg before:blur-xl before:opacity-20 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:-z-10' : '';
  const animatedClasses = animated ? 'animate-pulse' : '';

  // Neon glow effect for neon variant
  const neonGlow = variant === 'neon' ? 'shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]' : '';

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        roundedClasses[rounded],
        shadowClasses[shadow],
        statusClasses[status],
        hoverClasses,
        glowClasses,
        animatedClasses,
        neonGlow,
        {
          'group': hover, // Enable group hover for nested elements
        },
        className
      )}
      {...props}
    >
      {/* Background Pattern for Glass Variant */}
      {variant === 'glass' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      )}

      {/* Animated Background Particles for Neon Variant */}
      {variant === 'neon' && (
        <>
          <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
          <div className="absolute bottom-3 left-3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1000" />
        </>
      )}

      {/* Card Header */}
      {header && (
        <div className={clsx(
          'border-b border-slate-700/50 pb-4 mb-4',
          padding !== 'none' ? '-mx-6 -mt-6 px-6 pt-6' : ''
        )}>
          {header}
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className={clsx(
          'border-t border-slate-700/50 pt-4 mt-4',
          padding !== 'none' ? '-mx-6 -mb-6 px-6 pb-6' : ''
        )}>
          {footer}
        </div>
      )}

      {/* Gradient Overlay for Elevated Variant */}
      {variant === 'elevated' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      )}

      {/* Interactive Highlight */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  );
};

// Compound Components for Better Organization
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={clsx(
      'flex items-center justify-between',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3
    className={clsx(
      'text-lg font-semibold text-white',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p
    className={clsx(
      'text-sm text-slate-400',
      className
    )}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={clsx(
      'space-y-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={clsx(
      'flex items-center gap-2',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
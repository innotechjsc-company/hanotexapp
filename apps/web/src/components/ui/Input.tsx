'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    icon, 
    variant = 'default',
    size = 'md',
    type = 'text',
    ...props 
  }, ref) => {
    const inputClasses = clsx(
      'w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        // Size variants
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-3 text-base': size === 'md',
        'px-5 py-4 text-lg': size === 'lg',
        
        // Style variants
        'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500': variant === 'default' && !error,
        'border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500': variant === 'filled' && !error,
        'border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500': variant === 'outlined' && !error,
        
        // Error state
        'border-red-300 focus:border-red-500 focus:ring-red-500': error,
        
        // Icon padding
        'pl-10': icon && size === 'sm',
        'pl-12': icon && size === 'md',
        'pl-14': icon && size === 'lg',
      },
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className={clsx(
              'absolute left-0 top-0 flex items-center justify-center text-gray-400',
              {
                'h-8 w-8': size === 'sm',
                'h-12 w-12': size === 'md',
                'h-16 w-16': size === 'lg',
              }
            )}>
              {icon}
            </div>
          )}
          
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            {...props}
          />
        </div>
        
        {error && (
          <p className="form-error">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="form-help">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

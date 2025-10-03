'use client';

import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cn} from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-charcoal hover:bg-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light',
  secondary:
    'bg-accent text-charcoal hover:bg-accent-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light',
  ghost:
    'bg-transparent text-brand hover:bg-brand/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm font-medium',
  lg: 'h-12 px-6 text-base font-semibold'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {className, variant = 'primary', size = 'md', asChild = false, loading, disabled, children, type, ...props},
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;
    const spinner = !asChild && loading ? (
      <span
        className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-white/50 border-t-white"
        aria-hidden
      />
    ) : null;

    const content = asChild ? children : <span>{children}</span>;

    if (asChild) {
      return (
        <Comp
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 disabled:pointer-events-none disabled:opacity-50',
            VARIANT_CLASSES[variant],
            SIZE_CLASSES[size],
            className
          )}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          data-disabled={isDisabled ? '' : undefined}
          {...props}
        >
          {content}
        </Comp>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 disabled:pointer-events-none disabled:opacity-50',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className
        )}
        aria-busy={loading}
        disabled={isDisabled}
        type={type ?? 'button'}
        {...props}
      >
        {spinner}
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

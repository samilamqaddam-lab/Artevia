'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import {cn} from '@/lib/utils';

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = ({className}: {className?: string}) => (
  <ToastPrimitive.Viewport
    className={cn(
      'fixed top-6 end-6 z-[60] flex w-[320px] flex-col gap-3 outline-none',
      'max-sm:inset-x-4 max-sm:bottom-4 max-sm:top-auto max-sm:w-auto',
      className
    )}
  />
);

export const Toast = ToastPrimitive.Root;
export const ToastTitle = ({className, ...props}: React.ComponentProps<typeof ToastPrimitive.Title>) => (
  <ToastPrimitive.Title className={cn('text-sm font-semibold text-slate-900', className)} {...props} />
);

export const ToastDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) => (
  <ToastPrimitive.Description
    className={cn('text-sm text-slate-600', className)}
    {...props}
  />
);

export const ToastAction = ToastPrimitive.Action;

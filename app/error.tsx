'use client';

import {useEffect} from 'react';
import {Button} from '@/components/ui/Button';
import {logger} from '@/lib/logger';

/**
 * Global Error Boundary for the entire application
 * Catches runtime errors in React components
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for monitoring
    logger.error('Application error:', error);

    // TODO: Send to Sentry when integrated
    // Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Une erreur s&apos;est produite
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et travaille à résoudre le problème.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg bg-red-50 p-4 text-left dark:bg-red-900/20">
            <p className="font-mono text-sm text-red-800 dark:text-red-200">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-red-600 dark:text-red-300">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            Réessayer
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  );
}

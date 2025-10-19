'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/Button';
import {logger} from '@/lib/logger';

/**
 * Error Boundary for Account pages
 * Provides user-specific error handling and recovery options
 */
export default function AccountError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error for monitoring
    logger.error('Account error:', error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Erreur de chargement
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Impossible de charger vos informations. Veuillez réessayer.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg bg-red-50 p-4 text-left dark:bg-red-900/20">
            <p className="font-mono text-sm text-red-800 dark:text-red-200">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            Réessayer
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}

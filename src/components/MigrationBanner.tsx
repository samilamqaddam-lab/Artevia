'use client';

import {useState, useEffect} from 'react';
import {Cloud, X, AlertCircle, Check} from 'lucide-react';
import {Button} from './ui/Button';
import {
  migrateProjectsToSupabase,
  hasLocalProjectsToMigrate,
  getPendingMigrationCount,
  type MigrationResult
} from '@/lib/supabase/migrate-projects';
import {logger} from '@/lib/logger';

export function MigrationBanner() {
  const [show, setShow] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  useEffect(() => {
    checkMigration();
  }, []);

  async function checkMigration() {
    try {
      const hasProjects = await hasLocalProjectsToMigrate();
      const count = await getPendingMigrationCount();

      setShow(hasProjects);
      setPendingCount(count);
    } catch (error) {
      logger.error('Error checking migration status:', error);
    }
  }

  async function handleMigrate() {
    setMigrating(true);
    try {
      const migrationResult = await migrateProjectsToSupabase(false);
      setResult(migrationResult);

      // Hide banner after successful migration
      if (migrationResult.success) {
        setTimeout(() => setShow(false), 5000);
      }
    } catch (error) {
      logger.error('Migration error:', error);
    } finally {
      setMigrating(false);
    }
  }

  if (!show) return null;

  return (
    <div className="relative border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            {result ? (
              result.success ? (
                <>
                  <Check
                    size={20}
                    className="flex-shrink-0 text-green-600 dark:text-green-400"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      ✨ Migration réussie!
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {result.migrated} projet(s) synchronisé(s) avec le cloud
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle
                    size={20}
                    className="flex-shrink-0 text-orange-600 dark:text-orange-400"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      Migration terminée avec quelques problèmes
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      {result.migrated} réussi(s), {result.errors} erreur(s)
                    </p>
                  </div>
                </>
              )
            ) : (
              <>
                <Cloud
                  size={20}
                  className="flex-shrink-0 text-blue-600 dark:text-blue-400"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Synchronisez vos designs avec le cloud
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {pendingCount} projet(s) local(aux) · Accédez-y depuis n&apos;importe quel
                    appareil
                  </p>                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!result && (
              <Button
                onClick={handleMigrate}
                disabled={migrating}
                size="sm"
                className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {migrating ? (
                  <>
                    <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Migration...
                  </>
                ) : (
                  <>
                    <Cloud size={16} className="mr-2" />
                    Migrer vers le cloud
                  </>
                )}
              </Button>
            )}

            <button
              onClick={() => setShow(false)}
              className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {result && result.details.length > 0 && (
          <details className="mt-2 rounded-lg border border-blue-200 bg-white/50 p-2 dark:border-blue-800 dark:bg-blue-950/30">
            <summary className="cursor-pointer text-xs font-medium text-blue-900 dark:text-blue-100">
              Détails de la migration
            </summary>
            <ul className="mt-2 space-y-1 text-xs">
              {result.details.map((detail, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-blue-800 dark:text-blue-200"
                >
                  {detail.status === 'migrated' && (
                    <Check size={14} className="text-green-600" />
                  )}
                  {detail.status === 'skipped' && (
                    <span className="text-gray-500">⊘</span>
                  )}
                  {detail.status === 'error' && (
                    <AlertCircle size={14} className="text-red-600" />
                  )}
                  <span>{detail.projectName}</span>
                  {detail.message && (
                    <span className="text-gray-500">({detail.message})</span>
                  )}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}

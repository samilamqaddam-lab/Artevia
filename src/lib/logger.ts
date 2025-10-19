/**
 * Logger intelligent pour Artevia
 *
 * - Logs désactivés en production (sauf errors/warnings)
 * - Timestamps automatiques
 * - Support pour intégration future avec Sentry
 * - Type-safe et facile à utiliser
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

class Logger {
  /**
   * Méthode interne de logging avec formatage
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(level: LogLevel, ...args: any[]): void {
    // Ne pas logger pendant les tests
    if (isTest) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        // Debug uniquement en développement
        if (isDevelopment) {
          console.debug(prefix, ...args);
        }
        break;

      case 'info':
        // Info uniquement en développement
        if (isDevelopment) {
          console.info(prefix, ...args);
        }
        break;

      case 'warn':
        // Warnings toujours loggés
        console.warn(prefix, ...args);
        break;

      case 'error':
        // Errors toujours loggés
        console.error(prefix, ...args);

        // TODO: Envoyer à Sentry en production
        // if (!isDevelopment && args[0] instanceof Error) {
        //   Sentry.captureException(args[0]);
        // }
        break;
    }
  }

  /**
   * Logs de debug - uniquement en développement
   * Utilisé pour le debugging, informations de développement
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(...args: any[]): void {
    this.log('debug', ...args);
  }

  /**
   * Logs d'information - uniquement en développement
   * Utilisé pour tracer le flow de l'application
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(...args: any[]): void {
    this.log('info', ...args);
  }

  /**
   * Warnings - toujours loggés
   * Utilisé pour des situations anormales mais non-bloquantes
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(...args: any[]): void {
    this.log('warn', ...args);
  }

  /**
   * Erreurs - toujours loggées
   * Utilisé pour des erreurs qui nécessitent attention
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...args: any[]): void {
    this.log('error', ...args);
  }

  /**
   * Log conditionnel - utile pour debugging spécifique
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debugIf(condition: boolean, ...args: any[]): void {
    if (condition) {
      this.debug(...args);
    }
  }

  /**
   * Log avec grouping - utile pour tracer des opérations complexes
   */
  group(label: string): void {
    if (isDevelopment) {
      console.group(label);
    }
  }

  /**
   * Fin du group
   */
  groupEnd(): void {
    if (isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Mesure de performance
   */
  time(label: string): void {
    if (isDevelopment) {
      console.time(label);
    }
  }

  /**
   * Fin de mesure de performance
   */
  timeEnd(label: string): void {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
}

/**
 * Instance singleton du logger
 * Utiliser cette instance partout dans l'application
 *
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger';
 *
 * logger.debug('User data:', userData);
 * logger.info('Operation completed');
 * logger.warn('Deprecated feature used');
 * logger.error('Failed to fetch data', error);
 * ```
 */
export const logger = new Logger();

/**
 * Helper pour logger les erreurs avec contexte
 */
export function logError(error: unknown, context?: string): void {
  if (context) {
    logger.error(`[${context}]`, error);
  } else {
    logger.error(error);
  }
}

/**
 * Helper pour logger les performance timing
 */
export function logPerformance(label: string, fn: () => void | Promise<void>): void {
  logger.time(label);
  const result = fn();

  if (result instanceof Promise) {
    result.finally(() => logger.timeEnd(label));
  } else {
    logger.timeEnd(label);
  }
}

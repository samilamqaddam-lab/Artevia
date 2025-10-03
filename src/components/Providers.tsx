'use client';

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport} from '@/components/ui/Toast';
import {registerServiceWorker} from '@/lib/pwa/register-sw';
import {generateId, isRTL} from '@/lib/utils';
import type {Locale} from '@/i18n/settings';
import {SessionContextProvider} from '@supabase/auth-helpers-react';
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs';
import type {Database} from '@/lib/supabase/types';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type AppToast = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
};

interface ToastContextValue {
  pushToast: (toast: Omit<AppToast, 'id'>) => void;
}

const AppToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within Providers');
  }
  return context;
}

export function useToast() {
  const context = useContext(AppToastContext);
  if (!context) {
    throw new Error('useToast must be used within Providers');
  }
  return context;
}

export function Providers({children, locale}: {children: React.ReactNode; locale: Locale}) {
  const tPwa = useTranslations('pwa');
  const [offline, setOffline] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>());

  useEffect(() => {
    const loadTheme = () => {
      if (typeof window === 'undefined') return;
      const stored = window.localStorage.getItem('artevia-theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.dataset.theme = theme;
    window.localStorage.setItem('artevia-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  const themeValue = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme
    }),
    [theme]
  );

  const pushToast = useCallback((toast: Omit<AppToast, 'id'>) => {
    setToasts((previous) => [...previous, {id: generateId(), duration: 4500, ...toast}]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    registerServiceWorker();
    setOffline(!navigator.onLine);
  }, []);

  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    const handleSwUpdate = () => setUpdateAvailable(true);
    document.addEventListener('artevia-sw-update', handleSwUpdate as EventListener);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('artevia-sw-update', handleSwUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    const dir = isRTL(locale) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    document.body.dataset.direction = dir;
  }, [locale]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <AppToastContext.Provider value={{pushToast}}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <ToastProvider swipeDirection="right">
            {children}
            <ToastViewport />
            <Toast
              open={offline}
              duration={4000}
          onOpenChange={(open) => {
            if (!open && navigator.onLine) {
              setOffline(false);
            }
          }}
        >
          <ToastTitle>{tPwa('offline')}</ToastTitle>
          <ToastDescription>{tPwa('offline')}</ToastDescription>
        </Toast>
        <Toast
          open={updateAvailable}
          duration={6000}
          onOpenChange={(open) => {
            if (!open) {
              setUpdateAvailable(false);
            }
          }}
        >
          <ToastTitle>{tPwa('update')}</ToastTitle>
          <ToastDescription>{tPwa('update')}</ToastDescription>
        </Toast>
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                duration={toast.duration}
                open
            onOpenChange={(open) => {
              if (!open) {
                removeToast(toast.id);
              }
            }}
          >
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
              </Toast>
            ))}
          </ToastProvider>
        </SessionContextProvider>
      </AppToastContext.Provider>
    </ThemeContext.Provider>
  );
}

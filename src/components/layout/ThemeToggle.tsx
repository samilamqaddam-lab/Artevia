'use client';

import {Moon, Sun} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {useTheme} from '@/components/Providers';

export function ThemeToggle() {
  const {theme, toggleTheme} = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {theme === 'dark' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </Button>
  );
}

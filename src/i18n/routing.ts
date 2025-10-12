import {defineRouting} from 'next-intl/routing';
import {locales, defaultLocale} from './settings';

export const routing = defineRouting({
  locales,
  defaultLocale
});

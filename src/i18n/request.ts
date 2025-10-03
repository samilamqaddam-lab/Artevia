import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, locales} from './settings';

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

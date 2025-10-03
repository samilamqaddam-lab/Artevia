import {formatPrice, isRTL} from '@/lib/utils';

describe('utils', () => {
  it('formats price in MAD for fr locale', () => {
    expect(formatPrice(199, 'fr')).toContain('MAD');
  });

  it('detects RTL locales', () => {
    expect(isRTL('ar')).toBe(true);
    expect(isRTL('fr')).toBe(false);
  });
});

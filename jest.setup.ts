import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverMock {
    observe() {
      return null;
    }
    unobserve() {
      return null;
    }
    disconnect() {
      return null;
    }
    takeRecords() {
      return [];
    }
  }
  (window as unknown as Record<string, unknown>).IntersectionObserver = IntersectionObserverMock as unknown;
  (window as unknown as Record<string, unknown>).IntersectionObserverEntry = class {};
}

import { describe, it, expect, vi } from 'vitest';
import { registerServiceWorker } from './pwaRegister';

describe('pwaRegister', () => {
  it('does not throw when serviceWorker API is evaluated', () => {
    expect(() => registerServiceWorker()).not.toThrow();
  });

  it('handles registration gracefully when navigator.serviceWorker is supported', () => {
    const registerMock = vi.fn().mockResolvedValue({ scope: '/' });
    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: { register: registerMock },
      configurable: true,
      writable: true,
    });

    expect(() => registerServiceWorker()).not.toThrow();
  });
});

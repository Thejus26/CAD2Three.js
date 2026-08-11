import { describe, it, expect } from 'vitest';
import { CacheService } from './cacheService';

describe('IndexedDB Model Cache Service', () => {
  it('computes consistent SHA-256 hashes for ArrayBuffers', async () => {
    const service = new CacheService();
    const data = new Uint8Array([1, 2, 3, 4, 5]).buffer;

    const hash1 = await service.computeHash(data);
    const hash2 = await service.computeHash(data);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });
});

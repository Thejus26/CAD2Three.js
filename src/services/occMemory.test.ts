import { describe, it, expect, vi } from 'vitest';
import { OCCMemoryManager } from './occMemory';

describe('OCCMemoryManager', () => {
  it('tracks disposable native handles', () => {
    const memory = new OCCMemoryManager();
    const mockHandle = { delete: vi.fn() };

    const tracked = memory.track(mockHandle);
    expect(tracked).toBe(mockHandle);
    expect(memory.trackedCount).toBe(1);
  });

  it('disposes a single handle explicitly', () => {
    const memory = new OCCMemoryManager();
    const mockHandle = { delete: vi.fn() };

    memory.track(mockHandle);
    memory.disposeHandle(mockHandle);

    expect(mockHandle.delete).toHaveBeenCalledTimes(1);
    expect(memory.trackedCount).toBe(0);
  });

  it('disposes all tracked handles on disposeAll', () => {
    const memory = new OCCMemoryManager();
    const h1 = { delete: vi.fn() };
    const h2 = { deleteLater: vi.fn() };

    memory.track(h1);
    memory.track(h2);

    expect(memory.trackedCount).toBe(2);

    memory.disposeAll();

    expect(h1.delete).toHaveBeenCalledTimes(1);
    expect(h2.deleteLater).toHaveBeenCalledTimes(1);
    expect(memory.trackedCount).toBe(0);
  });
});

export interface DisposableHandle {
  delete?: () => void;
  deleteLater?: () => void;
}

export class OCCMemoryManager {
  private handles: Set<DisposableHandle> = new Set();

  /**
   * Tracks an OpenCascade C++ Object Handle for later cleanup
   */
  track<T extends DisposableHandle>(handle: T): T {
    if (handle && (typeof handle.delete === 'function' || typeof handle.deleteLater === 'function')) {
      this.handles.add(handle);
    }
    return handle;
  }

  /**
   * Immediately disposes a single tracked C++ handle
   */
  disposeHandle(handle: DisposableHandle): void {
    if (!handle) return;
    try {
      if (typeof handle.delete === 'function') {
        handle.delete();
      } else if (typeof handle.deleteLater === 'function') {
        handle.deleteLater();
      }
    } catch {
      // Ignore double deletion errors gracefully
    } finally {
      this.handles.delete(handle);
    }
  }

  /**
   * Disposes all registered C++ handles and clears tracking set
   */
  disposeAll(): void {
    for (const handle of this.handles) {
      try {
        if (typeof handle.delete === 'function') {
          handle.delete();
        } else if (typeof handle.deleteLater === 'function') {
          handle.deleteLater();
        }
      } catch {
        // Ignore errors during batch cleanup
      }
    }
    this.handles.clear();
  }

  get trackedCount(): number {
    return this.handles.size;
  }
}

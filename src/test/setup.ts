import '@testing-library/jest-dom';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

class WorkerMock {
  onmessage: ((e: MessageEvent) => void) | null = null;
  postMessage(_data: unknown) {}
  terminate() {}
}

globalThis.Worker = WorkerMock as unknown as typeof Worker;

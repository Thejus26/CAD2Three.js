import { describe, it, expect } from 'vitest';
import * as Comlink from 'comlink';
import type { CADWorkerAPI, CADParseResult } from './cadWorker.worker';

describe('CADWorker Communication & Transferrable Buffers', () => {
  it('exposes RPC methods and processes ArrayBuffer transfer correctly', async () => {
    // Mock worker channel for Vitest environment
    const { port1, port2 } = new MessageChannel();

    // Instantiate service on port2
    class CADWorkerMock implements CADWorkerAPI {
      async ping() {
        return 'pong';
      }
      async parseCADFile(fileBuffer: ArrayBuffer, _fileName: string): Promise<CADParseResult> {
        return {
          success: true,
          byteLength: fileBuffer.byteLength,
          format: 'stl',
          meshes: [],
        };
      }
    }

    Comlink.expose(new CADWorkerMock(), port2);

    // Wrap port1 with Comlink client
    const workerAPI = Comlink.wrap<CADWorkerAPI>(port1);

    const pingResponse = await workerAPI.ping();
    expect(pingResponse).toBe('pong');

    const sampleBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    const result = await workerAPI.parseCADFile(
      Comlink.transfer(sampleBuffer, [sampleBuffer]),
      'sample.stl'
    );

    expect(result.success).toBe(true);
    expect(result.byteLength).toBe(5);

    port1.close();
    port2.close();
  });
});

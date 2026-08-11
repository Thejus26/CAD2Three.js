import { describe, it, expect } from 'vitest';
import * as Comlink from 'comlink';
import type { BIMWorkerAPI, BIMParseResult } from './bimWorker.worker';

describe('BIMWorker Communication & IFC Parsing', () => {
  it('exposes RPC methods and processes IFC file buffers', async () => {
    const { port1, port2 } = new MessageChannel();

    class BIMWorkerMock implements BIMWorkerAPI {
      async ping() {
        return 'bim-pong';
      }
      async parseIFCFile(fileBuffer: ArrayBuffer, fileName: string): Promise<BIMParseResult> {
        return {
          success: true,
          byteLength: fileBuffer.byteLength,
          elementCount: 1,
          meshes: [
            {
              expressID: 10,
              type: 'Wall',
              name: fileName,
              positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]),
              normals: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]),
              indices: new Uint32Array([0, 1, 2]),
            },
          ],
        };
      }
    }

    Comlink.expose(new BIMWorkerMock(), port2);
    const workerAPI = Comlink.wrap<BIMWorkerAPI>(port1);

    const ping = await workerAPI.ping();
    expect(ping).toBe('bim-pong');

    const sampleBuffer = new Uint8Array([73, 70, 67]).buffer; // 'IFC'
    const result = await workerAPI.parseIFCFile(
      Comlink.transfer(sampleBuffer, [sampleBuffer]),
      'building.ifc'
    );

    expect(result.success).toBe(true);
    expect(result.elementCount).toBe(1);
    expect(result.meshes[0].type).toBe('Wall');

    port1.close();
    port2.close();
  });
});

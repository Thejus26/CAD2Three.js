import * as Comlink from 'comlink';

export interface CADWorkerAPI {
  ping(): Promise<string>;
  parseCADFile(fileBuffer: ArrayBuffer, fileName: string): Promise<{ success: boolean; byteLength: number }>;
}

class CADWorkerService {
  async ping(): Promise<string> {
    return 'pong';
  }

  async parseCADFile(fileBuffer: ArrayBuffer, _fileName: string): Promise<{ success: boolean; byteLength: number }> {
    // SharedArrayBuffer / Transferrable ArrayBuffer handler placeholder
    return {
      success: true,
      byteLength: fileBuffer.byteLength
    };
  }
}

Comlink.expose(new CADWorkerService());

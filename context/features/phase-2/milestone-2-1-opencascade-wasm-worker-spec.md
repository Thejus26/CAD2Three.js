# Milestone 2.1: OpenCascade.js WASM Module & Worker Integration

## Overview
Set up OpenCascade.js WebAssembly build and establish off-thread Web Worker architecture for heavy CAD file parsing.

## Sub-tasks

### 2.1.1: OpenCascade WASM Build & Asset Configuration
- [ ] Configure custom `opencascade.js` WASM package containing STEP, IGES, BRep, and StlAPI modules.
- [ ] Configure Vite server response headers for `SharedArrayBuffer` support (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`).

### 2.1.2: Web Worker Off-Thread Architecture
- [ ] Implement `cadWorker.worker.ts` for off-thread CAD processing.
- [ ] Implement `comlink` or ArrayBuffer transferrable messaging protocol between main UI thread and CAD worker.

## Testing Process
- Mock Web Worker messaging in `src/workers/cadWorker.test.ts` to test worker initialization, message serialization, and transferrable ArrayBuffer handling.
- Verify COOP/COEP header configuration via dev server integration test.
- Run `npm run test:run` to confirm worker messaging tests pass.

## Acceptance Criteria
- [ ] `npm run test:run` passes unit tests for CAD worker message passing and memory transfer protocols.
- [ ] OpenCascade WASM loads cleanly inside Web Worker without blocking main UI thread.
- [ ] SharedArrayBuffer / transferrable buffers transfer file byte data instantly.

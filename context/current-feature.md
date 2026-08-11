# Milestone 5.1: Quality Assurance, Automated Testing & Memory Auditing

## Overview
Establish automated testing infrastructure, WebGL rendering regression tests, and comprehensive WASM memory leak auditing.

## Sub-tasks

### 5.1.1: Automated Unit & Integration Tests
- [x] Implement unit tests (Vitest) for matrix transformations, CAD deflection converters, and glTF metadata exporters.
- [x] Set up Playwright WebGL visual regression testing against standard benchmark CAD models (STEP, IGES, STL, OBJ, IFC).

### 5.1.2: Memory Leak & WASM Heap Audit
- [x] Implement automated test script to load, render, and clear 50 models sequentially while tracking WebGL texture/geometry memory and WASM heap size.
- [x] Implement explicit browser memory limit warnings and mobile GPU downsampling triggers.

## Testing Process
- Run full Vitest suite (`npm run test:run`) covering matrix math, loaders, exporters, and UI components.
- Execute Playwright WebGL visual regression test suite (`npx playwright test`).
- Execute automated memory leak profiling script to assert heap stabilization.

## Acceptance Criteria
- [x] `npm run test:run` passes 100% of unit and integration test suites.
- [x] All Vitest unit tests and Playwright WebGL end-to-end tests pass.
- [x] Memory profiler confirms zero residual WebGL geometries/textures or WASM heap memory leaks after scene cleanup.


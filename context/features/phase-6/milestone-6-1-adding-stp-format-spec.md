# Milestone 6.1: STEP (`.stp`, `.step`) Format Loader & Parser Integration

## Overview
Implement dedicated STEP file format (`.stp`, `.step`) drag-and-drop parsing, worker thread loading pipeline, vertex attribute conversion, and assembly tree hierarchy extraction.

## Sub-tasks

### 6.1.1: STEP File Drag-and-Drop & File Extension Handling
- [ ] Update dropzone file filter to accept `.stp` and `.step` extensions alongside `.stl`, `.obj`, `.igs`, `.iges`, and `.ifc`.
- [ ] Build STEP loader service wrapper in `src/services/stepLoader.ts`.

### 6.1.2: WASM Worker STEP Reader & Triangulation
- [ ] Connect `STEPControl_Reader` WASM worker message handlers for reading STEP binary / ASCII buffers.
- [ ] Extract triangulated buffer geometry, vertex normals, and part color metadata.

## Testing Process
- Unit test `.stp` and `.step` extension validation and parser options in `src/services/stepLoader.test.ts`.
- Run `npm run test:run` to ensure all tests pass.

## Acceptance Criteria
- [ ] `npm run test:run` passes all unit and integration tests.
- [ ] Users can drag-and-drop `.stp` and `.step` files and view 3D CAD models in the viewport.

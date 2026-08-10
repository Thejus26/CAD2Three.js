# Current Feature: Milestone 1.3 Drag-and-Drop Uploader & Polyhedral Mesh Loaders

## Overview
Implement client-side drag-and-drop file uploader and integrate Three.js native loaders for polyhedral mesh formats (STL and OBJ).

## Active Sub-tasks
- [ ] Build drag-and-drop overlay zone with format validation (`.stl`, `.obj`).
- [ ] Create floating loading modal displaying progress percentage and status text.
- [ ] Add file upload error handling and user notification toasts.
- [ ] Implement `STLLoaderService` for parsing binary and ASCII STL files into Three.js `BufferGeometry`.
- [ ] Implement `OBJLoaderService` for parsing OBJ files with optional MTL material files.
- [ ] Create auto-bounding camera focus helper (`fitCameraToSelection`) to center and frame loaded meshes.

## Testing Process
- Test drag-and-drop dropzone format validation logic and file type rejection in `src/components/uploader/Dropzone.test.tsx`.
- Unit test `STLLoaderService` and `OBJLoaderService` geometry parsing with mock ArrayBuffers in `src/services/loaders.test.tsx`.
- Run `npm run test:run` to execute loader and uploader tests.

## Acceptance Criteria
- [ ] `npm run test:run` passes unit tests for STL/OBJ parsing logic and dropzone file validations.
- [ ] User can drag and drop `.stl` or `.obj` files into the browser window.
- [ ] Progress bar updates accurately during parsing.
- [ ] Loaded models render centered in the viewport with automatically adjusted camera bounds.

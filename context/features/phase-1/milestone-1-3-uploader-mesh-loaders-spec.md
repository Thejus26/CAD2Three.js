# Milestone 1.3: Drag-and-Drop Uploader & Polyhedral Mesh Loaders

## Overview
Implement client-side drag-and-drop file uploader and integrate Three.js native loaders for polyhedral mesh formats (STL and OBJ).

## Sub-tasks

### 1.3.1: File Import UI & Droptarget
- [ ] Build drag-and-drop overlay zone with format validation (`.stl`, `.obj`).
- [ ] Create floating loading modal displaying progress percentage and status text.
- [ ] Add file upload error handling and user notification toasts.

### 1.3.2: STL & OBJ Loader Integration
- [ ] Implement `STLLoaderService` for parsing binary and ASCII STL files into Three.js `BufferGeometry`.
- [ ] Implement `OBJLoaderService` for parsing OBJ files with optional MTL material files.
- [ ] Create auto-bounding camera focus helper (`fitCameraToSelection`) to center and frame loaded meshes.

## Acceptance Criteria
- [ ] User can drag and drop `.stl` or `.obj` files into the browser window.
- [ ] Progress bar updates accurately during parsing.
- [ ] Loaded models render centered in the viewport with automatically adjusted camera bounds.

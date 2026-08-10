# Milestone 1.2: WebGL Viewport & Navigation Core

## Overview
Develop the interactive 3D WebGL viewport canvas with responsive sizing, studio lighting, shadow receiving ground grid, and camera controls.

## Sub-tasks

### 1.2.1: Build Base Viewport Component
- [ ] Implement responsive full-screen Canvas container component.
- [ ] Set up default lighting setup (Ambient light, Directional Key & Fill lights, Studio HDRI map).
- [ ] Add ground plane grid helper with fading grid lines (`Grid`) and shadow reception.

### 1.2.2: Camera & Interaction Controls
- [ ] Implement `OrbitControls` with smooth damping, zoom boundaries, and pan constraints.
- [ ] Build 3D Orientation ViewCube / Axis Gizmo in the top-right corner.
- [ ] Create camera preset toolbar (Isometric, Front, Top, Right, Left, Back views).

## Testing Process
- Unit test camera preset calculation functions and view toolbar interactions in `src/components/viewport/CameraControls.test.tsx`.
- Test Canvas layout and resize event handler triggers in `src/components/viewport/ViewportCanvas.test.tsx`.
- Run `npm run test:run` to verify test suite completion.

## Acceptance Criteria
- [ ] `npm run test:run` passes unit tests for camera presets and viewport layout components.
- [ ] Viewport resizes dynamically when browser window dimensions change.
- [ ] Camera controls rotate, pan, and zoom smoothly at 60 FPS.
- [ ] Clicking preset buttons animates camera smoothly to target angle.

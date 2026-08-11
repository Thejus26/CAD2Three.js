# Milestone 4.2: 3D Precision Tools (Measurement & Clipping)

## Overview
Implement 3D CAD measurement tools (distance, angles, bounding dimensions) and dynamic cross-section clipping planes.

## Sub-tasks

### 4.2.1: Interactive Measurement Tool
- [x] Implement Raycasting vertex/edge snapping helper.
- [x] Build Point-to-Point distance measurement tool with 3D line overlays and HTML annotation labels.
- [x] Implement 3-point angle measurement tool.

### 4.2.2: Dynamic Sectioning / Clipping Planes
- [x] Implement X, Y, Z axis clipping planes using WebGL local clipping planes.
- [x] Build interactive 3D transform gizmo handles for sliding and rotating clipping planes.
- [x] Render solid stencil caps over cut geometry faces.

## Testing Process
- Unit test 3D distance and angle calculation math helpers in `src/utils/measurementMath.test.ts`.
- Test clipping plane normal and constant offset calculation handlers in `src/utils/clippingPlanes.test.ts`.
- Run `npm run test:run` to execute 3D tool math unit tests.

## Acceptance Criteria
- [x] `npm run test:run` passes unit tests for measurement math and clipping plane transformations.
- [x] Distance measurements snap accurately to mesh vertices with < 0.01mm tolerance.
- [x] Cross-sectioning clips the model smoothly in real-time with solid stencil caps.


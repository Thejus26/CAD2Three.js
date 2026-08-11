# Milestone 6.3 Specification: Automatic Screen Auto-Scale (Phase 6)

## 1. Overview & Purpose
The **Automatic Screen Auto-Scale** feature automatically calculates the 3D bounding box of any loaded CAD model and dynamically framing/positioning the perspective camera so that the entire model fits comfortably within the current browser window/canvas viewport. It automatically recalculates camera distances whenever models are loaded or when the browser window is resized.

## 2. User Stories
- **As a User Loading a CAD Model**, I want the camera to automatically frame the newly loaded model upon import so that I do not need to manually locate or search for the model in 3D space.
- **As a User Resizing the Browser Window**, I want the viewport canvas and camera aspect ratio to automatically recalculate bounds so that the model stays perfectly centered without clipping or stretching.
- **As a User Inspecting Large / Small Assemblies**, I want a dedicated `Fit to Screen` / `Zoom to Fit` UI toolbar button and double-click shortcut to re-center and auto-scale the camera instantly.

## 3. Functional Requirements
- **FR-1 (Automatic Import Framing):** Upon parsing and importing any model (STL, OBJ, STEP, IGES, IFC), automatically calculate `THREE.Box3` bounding box and re-frame camera position.
- **FR-2 (Fit to Screen Action):** Provide a `Zoom to Fit` / `Reset View` button on the viewport control toolbar.
- **FR-3 (Double-Click Auto-Scale):** Double-clicking empty space in the 3D canvas triggers camera auto-scaling.
- **FR-4 (Window Resize Observer):** Attach a `ResizeObserver` listener to the canvas container to automatically update renderer size (`renderer.setSize`) and camera aspect ratio (`camera.aspect`).
- **FR-5 (FOV-Based Distance Calculation):** Compute camera distance using bounding box diagonal and Field of View (FOV) formula: `distance = (maxDimension / 2) / Math.tan(fov / 2) * offsetFactor`.

## 4. Non-Functional Requirements
- **NFR-1 (Smooth Camera Transition):** Auto-scaling must animate smoothly over 300ms using camera interpolation/tweening rather than snapping jarringly.
- **NFR-2 (Zero Aspect Distortion):** Rendered geometry aspect ratio must remain 1:1 regardless of window width/height adjustments.

## 5. Edge Cases & Handling
- **EC-1 (Models with Extreme Dimensions / Aspect Ratios):** Models that are extremely tall (e.g., towers) or wide (e.g., pipelines) calculate `maxDimension` across all 3 axes (`Math.max(size.x, size.y, size.z)`) to guarantee zero clipping on both portrait and landscape viewports.
- **EC-2 (Empty / Zero-Volume Geometries):** If a geometry bounding box has zero volume (`size.length() === 0` or empty mesh), fallback to default bounding sphere radius of `1.0` unit to prevent `NaN` or `Infinity` camera position errors.
- **EC-3 (Window Minimized / 0px Canvas Size):** When canvas dimensions shrink to 0px (e.g. tab backgrounded), pause aspect ratio updates to avoid division-by-zero errors.
- **EC-4 (Off-Center Origin Models):** For models positioned far away from the global origin `(0, 0, 0)`, center OrbitControls target directly on the model bounding box centroid `center = box.getCenter()`.

## 6. Acceptance Criteria
- [ ] `npm run test:run` passes unit tests for auto-scale distance and aspect ratio math in `src/utils/autoScaleMath.test.ts`.
- [ ] Loading any model automatically scales and centers the model in the viewport.
- [ ] Clicking the `Zoom to Fit` toolbar button re-frames the active model.
- [ ] Resizing the browser window updates canvas size and camera aspect ratio without stretching or distortion.
- [ ] Models positioned far from origin are correctly centered.

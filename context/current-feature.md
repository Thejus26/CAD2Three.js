# Milestone 6.2 Specification: Interactive Zoom Controls (Phase 6)

## 1. Overview & Purpose
The **Interactive Zoom Controls** feature provides smooth, precise, and responsive zooming capabilities for CAD models rendered in the 3D WebGL viewport. Users can zoom in to inspect fine mechanical details or zoom out to view the entire assembly using mouse wheel scrolling, touch pinch gestures, keyboard shortcuts, or dedicated UI zoom toolbar buttons.

## 2. User Stories
- **As a CAD Engineer / Reviewer**, I want to zoom into specific regions of a CAD model using my mouse scroll wheel or pinch gesture so that I can inspect micro-geometry, surface features, and edge alignments.
- **As a User without a Mouse**, I want to click Zoom In / Zoom Out toolbar buttons or use keyboard shortcuts (`+` / `-`) so that I can adjust camera distance effortlessly.
- **As a User**, I want defined minimum and maximum zoom limits so that the camera never clips through geometry or drifts infinitely into empty space.

## 3. Functional Requirements
- **FR-1 (Mouse Wheel Zoom):** Scrolling the mouse wheel up zooms in towards the cursor position; scrolling down zooms out.
- **FR-2 (Touch Pinch Zoom):** Two-finger pinch-in zooms out; pinch-out zooms in on touch-enabled mobile and tablet screens.
- **FR-3 (UI Toolbar Buttons):** Provide explicit `Zoom In` (`+`) and `Zoom Out` (`-`) buttons on the viewport toolbar.
- **FR-4 (Keyboard Shortcuts):** Pressing `+` or `=` zooms in by 10%; pressing `-` or `_` zooms out by 10%.
- **FR-5 (Zoom Speed / Damping):** Maintain smooth camera movement using OrbitControls damping factor (`dampingFactor: 0.05`).
- **FR-6 (Minimum / Maximum Distance Boundaries):** Enforce camera distance boundaries (`minDistance: 0.1` units, `maxDistance: 500.0` units).

## 4. Non-Functional Requirements
- **NFR-1 (Performance):** Zoom interactions must render smoothly at 60 FPS without dropping frames or introducing stutter.
- **NFR-2 (Responsiveness):** Camera zoom updates must respond in under 16ms to user inputs.

## 5. Edge Cases & Handling
- **EC-1 (Minimum Zoom Limit Reached):** When camera distance reaches `minDistance` (0.1 units), further zoom-in attempts are safely clamped to prevent camera clipping and matrix inversion errors.
- **EC-2 (Maximum Zoom Limit Reached):** When camera distance reaches `maxDistance` (500 units), further zoom-out attempts are clamped to prevent the model from disappearing.
- **EC-3 (Empty / No Loaded Model):** Zooming operates relative to the origin `(0, 0, 0)` without throwing `NaN` or `undefined` camera matrix exceptions.
- **EC-4 (Rapid / Extreme Scroll Wheels):** High-precision trackpads and fast scroll wheels are smoothed via inertia damping to avoid sudden camera jumps.

## 6. Acceptance Criteria
- [ ] `npm run test:run` passes unit tests for zoom distance clamping and zoom factor calculation helpers in `src/components/viewport/zoomControls.test.ts`.
- [ ] Mouse wheel scrolling smoothly adjusts camera distance towards mouse cursor.
- [ ] Clicking `Zoom In` and `Zoom Out` UI buttons updates camera position predictably.
- [ ] Camera distance is strictly clamped between `0.1` and `500.0` units.
- [ ] Keyboard shortcuts `+` and `-` trigger smooth camera zoom steps.

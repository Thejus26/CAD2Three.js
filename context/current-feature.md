# Bugfix 6.3.1 Specification: Fix Autoscale & Zoom Camera Binding (Phase 6)

## 1. Overview & Purpose
The **Automatic Screen Auto-Scale** (Milestone 6.3) and **Interactive Zoom Controls** (Milestone 6.2) features are implemented but non-functional due to disconnected React refs between `App.tsx` and `ViewportCanvas.tsx`. The camera and OrbitControls instances created inside the `<Canvas>` are unreachable from the parent component, causing `fitCameraToSelection` to silently skip on every model load. This bugfix reconnects the ref plumbing and addresses several secondary scaling issues discovered during root-cause analysis.

## 2. Root Cause Analysis

### Primary Bug — Disconnected Camera & Controls Refs
| Ref | Declared in | Connected to JSX? | Impact |
|---|---|---|---|
| `cameraRef` (`App.tsx:57`) | `App.tsx` | ❌ Never attached | Always `null` |
| `controlsRef` (`App.tsx:58`) | `App.tsx` | ❌ Never attached | Always `null` |

`ViewportCanvas.tsx` creates its **own** internal `controlsRef` at line 17, which is properly attached to `<OrbitControls ref={controlsRef}>` — but this ref is never exposed to `App.tsx`.

**Result:** The guard on `App.tsx:138` always short-circuits:
```typescript
if (meshRef.current && cameraRef.current && controlsRef.current) {
  fitCameraToSelection(cameraRef.current, controlsRef.current, meshRef.current);
}
```
→ `fitCameraToSelection` **never runs**. Models render at the default camera position `[5, 5, 5]` regardless of their actual dimensions.

### Secondary Issues
1. **Hardcoded camera preset positions** (`cameraPresetConstants.ts`): All presets use fixed distance `8` — clicking a preset after autoscale jumps the camera inside large models or far from small ones.
2. **Missing `near` clipping plane adjustment** (`loaders.ts:90-94`): `far` is dynamically updated but `near` is left at the Three.js default (`0.1`), causing z-fighting on large CAD models where `far/near > 100,000`.
3. **Static grid `fadeDistance`** (`ViewportCanvas.tsx:100`): Hardcoded `fadeDistance={30}` makes the ground grid invisible for models that autoscale to distances > 30 units.

## 3. Affected Files

| File | Path | Change Type |
|---|---|---|
| `ViewportCanvas.tsx` | `src/components/viewport/ViewportCanvas.tsx` | Expose camera & controls refs via callback props |
| `App.tsx` | `src/App.tsx` | Consume exposed refs; remove orphaned `cameraRef`/`controlsRef` declarations |
| `loaders.ts` | `src/services/loaders.ts` | Add dynamic `near` plane calculation |
| `cameraPresetConstants.ts` | `src/components/viewport/cameraPresetConstants.ts` | Convert presets from absolute positions to unit direction vectors |
| `autoScaleMath.test.ts` | `src/utils/autoScaleMath.test.ts` | Add regression test for ref connectivity scenario |
| `zoomControls.test.ts` | `src/components/viewport/zoomControls.test.ts` | Validate zoom after autoscale positioning |

## 4. Functional Requirements

- **FR-1 (Ref Connectivity):** `ViewportCanvas` must expose its internal OrbitControls ref to the parent via a callback prop (`onControlsReady`) or `React.forwardRef`, so `App.tsx` can call `fitCameraToSelection` with the actual camera and controls instances.
- **FR-2 (Auto-Scale on Load):** After any model is parsed and mounted, `fitCameraToSelection` must execute and reposition the camera to frame the model's bounding box within the viewport.
- **FR-3 (Zoom to Fit):** The `Zoom to Fit` toolbar button and double-click shortcut must invoke `fitCameraToSelection` using the connected refs.
- **FR-4 (Dynamic Presets):** Camera preset buttons (ISO, FRONT, TOP, etc.) must position the camera at a distance proportional to the current model's autoscale distance, not a hardcoded value.
- **FR-5 (Near Plane Adjustment):** `fitCameraToSelection` must set `camera.near` proportionally to avoid z-fighting (e.g. `near = distance * 0.001`, clamped to `[0.01, 10]`).
- **FR-6 (Dynamic Grid Fade):** The ground grid `fadeDistance` should scale relative to the autoscale distance so it remains visible as spatial reference.

## 5. Edge Cases & Handling
- **EC-1 (Ref Not Yet Available):** If `onControlsReady` fires before the mesh is loaded, `fitCameraToSelection` must be deferred until both refs and mesh are available (use a `useEffect` dependency guard).
- **EC-2 (Multiple Rapid Loads):** Loading a new file before the previous autoscale completes must cancel the stale framing and re-frame to the new model.
- **EC-3 (Preset Click Before Any Model Loaded):** Preset buttons must still work with fallback positions when no autoscale distance has been computed.
- **EC-4 (OrthographicCamera Fallback):** If the camera is orthographic, `near` plane logic must not set invalid values.

## 6. Implementation Plan

### Task 1: Expose Refs from `ViewportCanvas`
Add a callback prop `onControlsReady(controls: OrbitControlsImpl)` to `ViewportCanvas`. When the internal `<OrbitControls>` mounts, invoke the callback. The camera is accessible via `controls.object`.

### Task 2: Rewire `App.tsx` Ref Consumption
- Remove the orphaned `cameraRef` and `controlsRef` declarations.
- Store the controls instance from the callback in a ref.
- Derive the camera from `controls.object`.
- Update `handleZoomToFit` to use the connected refs.

### Task 3: Dynamic Camera Presets
- Change `PRESET_POSITIONS` from absolute `[x, y, z]` tuples to unit direction vectors.
- In `handleSelectPreset`, multiply the direction by the current autoscale distance (or a fallback of `8`).

### Task 4: Near Plane & Grid Fixes
- In `fitCameraToSelection`, add: `perspCam.near = Math.max(0.01, Math.min(10, distance * 0.001))`.
- Pass autoscale distance to `ViewportCanvas` as a prop to drive `fadeDistance`.

### Task 5: Tests
- Add integration-style unit test verifying that `fitCameraToSelection` receives non-null camera/controls after `onControlsReady` fires.
- Add regression test that the camera position changes after loading a model (not stuck at `[5, 5, 5]`).

## 7. Acceptance Criteria
- [ ] `npm run test:run` passes all existing + new unit tests.
- [ ] Loading any STL/OBJ/STEP model automatically frames it in the viewport (camera is NOT at `[5, 5, 5]`).
- [ ] Clicking `Zoom to Fit` re-frames the active model.
- [ ] Double-clicking the viewport background re-frames the active model.
- [ ] Camera preset buttons position the camera at a distance proportional to the loaded model's size.
- [ ] No z-fighting artifacts visible on models with bounding box diagonal > 1000 units.
- [ ] Ground grid remains visible and correctly scaled for models of all sizes.
- [ ] `cameraRef` and `controlsRef` in `App.tsx` are no longer orphaned/null.

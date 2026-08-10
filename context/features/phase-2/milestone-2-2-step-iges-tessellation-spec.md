# Milestone 2.2: STEP & IGES Parsing & B-Rep Tessellation Engine

## Overview
Develop the OpenCascade WASM parsing pipeline for STEP and IGES files, converting B-Rep CAD geometry into Three.js triangulated meshes while retaining assembly hierarchy and color data.

## Sub-tasks

### 2.2.1: STEP / IGES Reader Module
- [ ] Bind `STEPControl_Reader` and `IGESControl_Reader` in the OpenCascade worker wrapper.
- [ ] Traverse CAD shape tree topology (Extract Compounds, Sub-shapes, and Part labels).

### 2.2.2: B-Rep Mesh Generator
- [ ] Implement `BRepMesh_IncrementalMesh` tessellation algorithm.
- [ ] Add linear and angular deflection quality controls (`Deflection: 0.001mm` to `1.0mm`).
- [ ] Extract vertex buffers (positions, normals, triangle indices) and CAD RGB colors (`XCAFDoc_ColorTool`).

### 2.2.3: Native WASM Memory Cleanup
- [ ] Implement garbage collection cleanup logic to call native C++ `.delete()` on OpenCascade C++ handles after mesh extraction to prevent heap memory exhaustion.

## Acceptance Criteria
- [ ] STEP (`.stp`, `.step`) and IGES (`.igs`, `.iges`) files parse and tessellate without UI freeze.
- [ ] Assembly tree hierarchy and original CAD colors display accurately in Three.js viewport.
- [ ] Zero native C++ heap memory leaks detected after processing multiple models.

# CAD2Three.js — Detailed Development Roadmap & Step-by-Step Task Breakdown

**Version:** 1.0.0  
**Status:** Active Execution Roadmap  

---

## Phase 1: MVP Setup & Polyhedral Mesh Pipeline (Weeks 1–3)

### Milestone 1.1: Environment & Project Foundation
- [ ] **Task 1.1.1: Initialize Repository & Tooling**
  - [ ] Initialize React 18 + Vite + TypeScript project structure.
  - [ ] Configure ESLint, Prettier, and TypeScript strict mode (`tsconfig.json`).
  - [ ] Set up TailwindCSS or CSS Modules design system.
- [ ] **Task 1.1.2: Install Core WebGL & 3D Dependencies**
  - [ ] Install `three`, `@types/three`, `@react-three/fiber`, and `@react-three/drei`.
  - [ ] Configure Vite build plugins for Web Workers (`vite-plugin-top-level-await`, static asset handling).

### Milestone 1.2: WebGL Viewport & Navigation Core
- [ ] **Task 1.2.1: Build Base Viewport Component**
  - [ ] Implement canvas container with auto-resizing capabilities.
  - [ ] Set up default lighting (ambient light, directional key/fill lights, studio environment map).
  - [ ] Add infinite ground grid (`Grid` helper) and shadow receiver ground plane.
- [ ] **Task 1.2.2: Camera & Interaction Controls**
  - [ ] Implement `OrbitControls` with smooth damping, zoom limits, and rotate caps.
  - [ ] Add Viewport Axis Gizmo (ViewCube / Orientation Indicator).
  - [ ] Create camera preset toolbar (Isometric, Front, Top, Right views).

### Milestone 1.3: Drag-and-Drop Uploader & Polyhedral Mesh Loaders
- [ ] **Task 1.3.1: File Import UI & Droptarget**
  - [ ] Build drag-and-drop zone with format validation (`.stl`, `.obj`).
  - [ ] Create floating loading modal with progress indicator.
- [ ] **Task 1.3.2: STL & OBJ Loader Integration**
  - [ ] Create `STLLoaderService` to parse binary and ASCII STL files into `BufferGeometry`.
  - [ ] Create `OBJLoaderService` to parse wavefront OBJ files with materials (`MTLLoader`).
  - [ ] Implement auto-centering and camera auto-bounding fit (`fitCameraToSelection`).

---

## Phase 2: STEP & IGES CAD Conversion via OpenCascade WASM (Weeks 4–7)

### Milestone 2.1: OpenCascade.js WASM Module Integration
- [ ] **Task 2.1.1: OpenCascade WASM Build & Asset Configuration**
  - [ ] Obtain / compile custom light build of `opencascade.js` containing STEP, IGES, BRep, and StlAPI modules.
  - [ ] Configure Vite static server headers for `SharedArrayBuffer` (`COOP`/`COEP` headers).
- [ ] **Task 2.1.2: Web Worker Off-Thread Architecture**
  - [ ] Build `cadWorker.worker.ts` for off-thread file parsing and tessellation.
  - [ ] Implement `comlink` or custom messaging protocol for transferrable ArrayBuffers.

### Milestone 2.2: STEP & IGES Parsing & B-Rep Tessellation Engine
- [ ] **Task 2.2.1: STEP / IGES Reader Module**
  - [ ] Implement `STEPControl_Reader` and `IGESControl_Reader` bindings in C++/WASM layer.
  - [ ] Extract assembly tree topology (Shapes, Compounds, Sub-shapes).
- [ ] **Task 2.2.2: B-Rep Mesh Generator**
  - [ ] Implement `BRepMesh_IncrementalMesh` tessellator.
  - [ ] Add linear and angular deflection controls (`Deflection: 0.001mm` to `1.0mm`).
  - [ ] Extract triangle indices, vertex positions, normals, and CAD RGB color attributes (`XCAFDoc_ColorTool`).
- [ ] **Task 2.2.3: Native WASM Memory Cleanup**
  - [ ] Build memory garbage collection wrapper to call `.delete()` on C++ OpenCascade handles after geometry extraction to avoid WASM heap leaks.

---

## Phase 3: Advanced Formats (IFC) & Mesh Optimization Engine (Weeks 8–10)

### Milestone 3.1: Architectural BIM (IFC) Integration
- [ ] **Task 3.1.1: Web-IFC WASM Reader Integration**
  - [ ] Integrate `web-ifc` WASM module in a Web Worker.
  - [ ] Parse IFC geometry into Three.js geometries while preserving ExpressIDs and element categories (Walls, Slabs, Beams, Windows).

### Milestone 3.2: Mesh Compression & glTF/GLB Exporter Pipeline
- [ ] **Task 3.2.1: glTF 2.0 / GLB Serialization**
  - [ ] Integrate `GLTFExporter` from Three.js.
  - [ ] Build exporter service with support for binary `.glb` and embed JSON `.gltf`.
- [ ] **Task 3.2.2: Mesh Simplification & Compression**
  - [ ] Integrate `Draco3D` compressor for vertex/normal buffer quantization.
  - [ ] Integrate `gltf-transform` / `meshoptimizer` for mesh decimation (LOD) and draw call reduction (`InstancedMesh` for repeated hardware/screws).
- [ ] **Task 3.2.3: Local Caching Infrastructure**
  - [ ] Implement `IndexedDB` storage service (via `idb-keyval` or `Dexie.js`) to cache converted GLB buffers indexed by SHA-256 hash.

---

## Phase 4: Interactive Inspection Tools & UI Polish (Weeks 11–13)

### Milestone 4.1: Assembly Tree & Component Inspector UI
- [ ] **Task 4.1.1: Assembly Hierarchy Tree View**
  - [ ] Build recursive tree component reflecting CAD assembly structure.
  - [ ] Add node search bar, node visibility toggles (hide/show part), and focus/isolate actions.
- [ ] **Task 4.1.2: Component Properties & Material Inspector**
  - [ ] Display volume, surface area, bounding box dimensions, and polygon count per component.
  - [ ] Allow live material overrides (Color, Roughness, Metalness, Opacity/X-Ray mode).

### Milestone 4.2: 3D Precision Tools
- [ ] **Task 4.2.1: Interactive Measurement Tool**
  - [ ] Implement Raycasting vertex snapping for 3D measurement points.
  - [ ] Build Point-to-Point distance line rendering with dynamic 3D HTML labels.
- [ ] **Task 4.2.2: Dynamic Sectioning / Clipping Planes**
  - [ ] Implement X, Y, Z clipping planes with interactive transform gizmos.
  - [ ] Add stencil cap rendering for solid cross-section fills.

---

## Phase 5: Testing, Hardening & Production Release (Weeks 14–15)

### Milestone 5.1: Quality Assurance & Performance Auditing
- [ ] **Task 5.1.1: Automated Unit & Integration Tests**
  - [ ] Write unit tests (Vitest) for matrix transforms and glTF export functions.
  - [ ] Set up Playwright WebGL visual regression testing against standard sample CAD models.
- [ ] **Task 5.1.2: Memory Leak & WASM Audit**
  - [ ] Run memory profiler to verify zero WebGL texture/geometry leaks when opening and closing 20 models sequentially.
  - [ ] Test WASM memory boundary limits and verify UI warning triggers.

### Milestone 5.2: Production Build & Deployment
- [ ] **Task 5.2.1: CI/CD Pipeline**
  - [ ] Set up GitHub Actions for linting, testing, and Vercel/Cloudflare edge deployment.
- [ ] **Task 5.2.2: PWA & Offline Support**
  - [ ] Configure Service Worker for caching WASM binaries and offline viewer functionality.

# CAD2Three.js — Project Overview

## 1. Executive Summary & Purpose
**CAD2Three.js** is a high-performance web application designed to convert, optimize, and render 3D CAD models (STEP, IGES, STL, OBJ, IFC) directly in modern web browsers using Three.js and WebAssembly.

## 2. Core Objectives
* **Import & Parsing:** Parse mesh and B-Rep CAD geometry on the client side using WASM (`opencascade.js`, `web-ifc`) and native Three.js loaders.
* **Tessellation & Conversion:** Convert CAD geometries into optimized glTF 2.0 / GLB files.
* **Real-time WebGL Viewport:** Interactive 3D rendering at 60 FPS with pan, zoom, rotate, component isolation, measurements, and sectioning.
* **Privacy & Zero Cloud Cost:** Process files <150MB entirely in-browser without sending sensitive CAD IP to external servers.

## 3. Tech Stack Architecture
* **Frontend:** React 18, Vite, TypeScript
* **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`
* **CAD WASM Processing:** `opencascade.js` (STEP/IGES), `web-ifc` (BIM/IFC), `STLLoader`, `OBJLoader`
* **Optimization:** `gltf-transform`, `Draco3D`, `meshoptimizer`

## 4. Key Milestones & Timeline (~15 Weeks / 580 Hours)
1. **Phase 1 (MVP - 3 Wks):** Polyhedral Mesh Loader (STL/OBJ) + Viewport Controls.
2. **Phase 2 (CAD Core - 4 Wks):** STEP/IGES WASM worker integration & B-Rep tessellation.
3. **Phase 3 (BIM & Optimization - 3 Wks):** IFC parsing & Draco GLB compression.
4. **Phase 4 (Inspection Tools - 3 Wks):** Distance/angle measurements & cross-sectioning.
5. **Phase 5 (Hardening - 2 Wks):** WASM memory leak auditing & Playwright end-to-end tests.

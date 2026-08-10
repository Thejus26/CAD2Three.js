# Milestone 3.1: Architectural BIM (IFC) Integration

## Overview
Integrate `web-ifc` WebAssembly engine for parsing architectural and structural IFC files into Three.js geometries.

## Sub-tasks

### 3.1.1: Web-IFC WASM Reader Integration
- [ ] Set up `web-ifc` WASM module inside a dedicated BIM Web Worker.
- [ ] Parse IFC entity geometry while extracting ExpressIDs, element classifications (Walls, Doors, Slabs, Beams), and material properties.

## Acceptance Criteria
- [ ] Architectural `.ifc` files parse and render in WebGL with correct spatial orientation.
- [ ] Structural IFC hierarchy and element metadata are preserved.

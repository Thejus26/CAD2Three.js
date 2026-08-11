# Milestone 3.1: Architectural BIM (IFC) Integration

## Overview
Integrate `web-ifc` WebAssembly engine for parsing architectural and structural IFC files into Three.js geometries.

## Sub-tasks

### 3.1.1: Web-IFC WASM Reader Integration
- [ ] Set up `web-ifc` WASM module inside a dedicated BIM Web Worker.
- [ ] Parse IFC entity geometry while extracting ExpressIDs, element classifications (Walls, Doors, Slabs, Beams), and material properties.

## Testing Process
- Test IFC entity classification filter logic and ExpressID property lookup functions in `src/services/ifcParser.test.ts`.
- Run `npm run test:run` to execute IFC metadata parser tests.

## Acceptance Criteria
- [ ] `npm run test:run` passes unit tests for IFC metadata property parsing and element classification.
- [ ] Architectural `.ifc` files parse and render in WebGL with correct spatial orientation.
- [ ] Structural IFC hierarchy and element metadata are preserved.

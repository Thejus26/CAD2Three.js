# AGENTS.md — AI Agent Guidance & Project Context

## Project Overview
**CAD2Three.js** is a web-based 3D CAD converter and interactive viewer. It converts formats like STEP, IGES, STL, OBJ, and IFC into web-ready glTF/GLB models using Three.js and WebAssembly.

## Guidelines for AI Agents Working on This Codebase
1. **Context References:**
   * High-level project goals and architecture: [project-overview.md](file:///C:/Users/ENERGY%20SAVER/Documents/Learning/CAD2Three.js/context/project-overview.md)
   * Feature tracking & active sprint tasks: [current-feature.md](file:///C:/Users/ENERGY%20SAVER/Documents/Learning/CAD2Three.js/context/current-feature.md)
   * Code formatting & conventions: [coding-standards.md](file:///C:/Users/ENERGY%20SAVER/Documents/Learning/CAD2Three.js/context/coding-standards.md)
   * Human-AI interaction guidelines: [ai-human-interaction.md](file:///C:/Users/ENERGY%20SAVER/Documents/Learning/CAD2Three.js/context/ai-human-interaction.md)

2. **Core Architectural Principles:**
   * **Off-Thread Processing:** Heavy parsing and CAD WASM tessellation must always run inside Web Workers to ensure UI responsiveness.
   * **Memory Management:** Explicitly dispose of Three.js objects (`geometry.dispose()`, `material.dispose()`) and invoke native OpenCascade C++ object deletion after mesh creation.
   * **Clean Separations:** Separate UI component logic from WebGL renderer states and worker messaging channels.

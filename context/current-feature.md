# Milestone 4.1: Assembly Tree & Component Inspector UI

## Overview
Develop the interactive assembly tree component hierarchy navigator, part isolate/hide actions, and physical component properties inspector.

## Sub-tasks

### 4.1.1: Assembly Hierarchy Tree View
- [x] Build recursive tree view component reflecting CAD assembly structure.
- [x] Implement search/filter bar for assembly components.
- [x] Add visibility toggles (eye icons), isolate mode, and node selection sync with viewport.

### 4.1.2: Component Properties & Material Inspector
- [x] Compute and display volume, surface area, bounding box dimensions, and polygon count per selected part.
- [x] Build material inspector panel allowing live color overrides, metalness/roughness adjustments, and opacity/X-Ray toggles.

## Testing Process
- Test assembly tree search filter algorithm and node selection state sync in `src/components/assembly/AssemblyTree.test.tsx`.
- Unit test geometric volume, surface area, and bounding box calculation utility functions in `src/utils/meshProperties.test.ts`.
- Run `npm run test:run` to execute assembly inspector tests.

## Acceptance Criteria
- [x] `npm run test:run` passes unit tests for tree filter algorithms and geometric mesh calculations.
- [x] Clicking a node in the assembly tree highlights the corresponding 3D mesh in the viewport (and vice-versa).
- [x] Isolate mode dims or hides all unselected components smoothly.

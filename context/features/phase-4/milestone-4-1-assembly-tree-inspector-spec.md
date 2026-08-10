# Milestone 4.1: Assembly Tree & Component Inspector UI

## Overview
Develop the interactive assembly tree component hierarchy navigator, part isolate/hide actions, and physical component properties inspector.

## Sub-tasks

### 4.1.1: Assembly Hierarchy Tree View
- [ ] Build recursive tree view component reflecting CAD assembly structure.
- [ ] Implement search/filter bar for assembly components.
- [ ] Add visibility toggles (eye icons), isolate mode, and node selection sync with viewport.

### 4.1.2: Component Properties & Material Inspector
- [ ] Compute and display volume, surface area, bounding box dimensions, and polygon count per selected part.
- [ ] Build material inspector panel allowing live color overrides, metalness/roughness adjustments, and opacity/X-Ray toggles.

## Acceptance Criteria
- [ ] Clicking a node in the assembly tree highlights the corresponding 3D mesh in the viewport (and vice-versa).
- [ ] Isolate mode dims or hides all unselected components smoothly.

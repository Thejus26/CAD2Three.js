# CAD2Three.js 🚀

**CAD2Three.js** is a high-performance web-based 3D CAD converter and interactive inspector. It converts CAD formats (`STEP`, `IGES`, `STL`, `OBJ`, `IFC`) into web-ready 3D models using **Three.js**, **React**, and **WebAssembly (OpenCascade / web-ifc)**—all executing client-side inside Web Workers to ensure zero cloud cost and total privacy.

---

## 🌟 Key Features

- **Multi-Format Support**: Drag-and-drop support for `.stl`, `.obj`, `.step` (`.stp`), `.igs` (`.iges`), and `.ifc` files.
- **Off-Thread WASM Parsing**: Heavy B-Rep CAD geometry parsing and tessellation runs inside dedicated Web Workers to keep the UI running at a smooth 60 FPS.
- **Interactive 3D Viewport**:
  - Full Orbit Camera controls (Pan, Rotate, Smooth Zoom, ISO & Preset Orthographic view angles).
  - Bounding-box-based **Auto-Scale** and **Zoom-to-Fit** framing.
  - Interactive **Orientation Gizmo (ViewCube)** and grid helper.
- **Assembly Inspector & Tree**: Dynamic part hierarchy expansion, component selection, visibility toggling, and part isolation mode.
- **Precision 3D Measurement Tools**: Real-time vertex-snapping distance and angle calculation.
- **Dynamic Cross-Sectioning / Sectioning**: Multi-axis plane clipping (X, Y, Z) with custom offsets and normal negations.
- **Material & Mesh Inspector**: Modify object color, roughness, metalness, opacity, and wireframe state, with live surface area and volume metrics calculations.
- **PWA & Offline Support**: Progressive Web Application setup with offline caching.

---

## 🛠️ Tech Stack Architecture

- **Core & Framework**: React 18, TypeScript, Vite
- **3D Rendering**: Three.js, `@react-three/fiber`, `@react-three/drei`, `three-stdlib`
- **WASM CAD Engines**: OpenCascade WASM (`opencascade.js`), `web-ifc`
- **Testing & Tooling**: Vitest, Playwright, Oxlint, ESLint

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/Thejus26/CAD2Three.js.git
cd CAD2Three.js

# Install dependencies
npm install
```

### Development Server

Run the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Build Commands

```bash
# Run unit and integration tests with Vitest
npm run test:run

# Run Vitest in watch mode
npm run test

# Run End-to-End tests with Playwright
npx playwright test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```text
CAD2Three.js/
├── context/               # Architecture docs & feature specifications
├── src/
│   ├── components/
│   │   ├── assembly/      # Assembly tree, inspector panel, material controls
│   │   ├── uploader/      # Dropzone & loading modals
│   │   └── viewport/      # Canvas, camera controls, orientation gizmos, precision tools
│   ├── services/          # STEP, STL, OBJ, IFC loaders & GLTF export
│   ├── utils/             # Matrix math, mesh properties, clipping planes, measurement & auto-scale math
│   ├── workers/           # Web Workers for off-thread CAD & BIM WASM processing
│   ├── App.tsx            # Main application coordinator
│   └── main.tsx           # React entry point
└── vitest.config.ts       # Test configuration
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

# Milestone 1.1: Environment & Project Foundation

## Overview
Set up the core React 18, Vite, TypeScript, and 3D rendering dependency framework for CAD2Three.js.

## Sub-tasks

### 1.1.1: Initialize Repository & Tooling
- [ ] Create Vite project with React and TypeScript (`vite create`).
- [ ] Configure `tsconfig.json` with strict mode, alias paths (`@/*` to `src/*`).
- [ ] Set up ESLint and Prettier for strict code standards.
- [ ] Set up CSS styling framework (Vanilla CSS Modules / TailwindCSS).

### 1.1.2: Install Core WebGL & 3D Dependencies
- [ ] Install Three.js core & type definitions (`three`, `@types/three`).
- [ ] Install React Three Fiber & Drei (`@react-three/fiber`, `@react-three/drei`).
- [ ] Configure Vite build plugins for Web Workers (`vite-plugin-top-level-await`, static asset worker handling).

### 1.1.3: Configure Test Suite & Runner
- [ ] Configure Vitest and React Testing Library (`vitest`, `@testing-library/react`, `jsdom`).
- [ ] Add `npm run test` and `npm run test:run` scripts.

## Testing Process
- Run `npm run test:run` to execute Vitest unit/integration tests.
- Verify environment setup and root App rendering via `src/App.test.tsx`.

## Acceptance Criteria
- [ ] `npm run test:run` executes and passes all test suites.
- [ ] `npm run dev` builds cleanly without warnings or errors.
- [ ] Vite successfully bundles Web Worker imports.

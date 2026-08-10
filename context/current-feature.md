# Current Feature context: testing-setup

## Overview
Infrastructure setup for automated Vitest testing, React Testing Library, and testing processes added to feature spec workflows.

## Active Sub-tasks
- [x] Configure Vitest and React Testing Library (`vitest`, `@testing-library/react`, `jsdom`).
- [x] Add `npm run test` and `npm run test:run` scripts.
- [x] Integrate `npm run test:run` as Step 2 in `/feature-complete` skill.
- [x] Update all feature spec files with Testing Process and Acceptance Criteria.
- [x] Update `/feature-start` skill to sync `context/current-feature.md` with active milestone spec.

## Acceptance Criteria
- [x] `npm run test:run` executes and passes all test suites.
- [x] `npm run build` succeeds without TypeScript/Vite errors.

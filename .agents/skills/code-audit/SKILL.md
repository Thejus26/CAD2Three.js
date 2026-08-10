---
name: code-audit
description: Audits the CAD2Three.js codebase by running ESLint, TypeScript compiler checks, npm audit, and Vitest/Playwright test suites.
---

# Skill: `code-audit`

## Configuration Variables
```yaml
linter_cmd: "npx eslint . --ext .js,.jsx,.ts,.tsx"
tsc_cmd: "npx tsc --noEmit"
security_cmd: "npm audit --json"
test_cmd: "npm test"
e2e_cmd: "npx playwright test"
report_output_file: "./audit-reports/cad2three-audit-report.md"
```

## Description
This skill performs a complete code audit tailored specifically for **CAD2Three.js** (React 18, Vite, TypeScript, Three.js, `@react-three/fiber`, WebAssembly workers).

---

## Step-by-Step Execution Instructions

### Step 1: TypeScript Type Checking (`tsc`)
1. Run strict TypeScript compiler verification:
   ```bash
   npx tsc --noEmit
   ```
2. Record type check errors (e.g. missing `@types/three` props, WASM worker interface mismatches).

### Step 2: Static Code Analysis (ESLint)
1. Run ESLint across TypeScript and React source files:
   ```bash
   npx eslint src/ --ext .ts,.tsx
   ```
2. Record linter errors, unhandled promise rejections in Web Workers, or unused imports.

### Step 3: Security & Dependency Scan (`npm audit`)
1. Scan Node module dependencies for known vulnerabilities:
   ```bash
   npm audit --json
   ```
2. Parse critical, high, medium, and low security advisories.

### Step 4: Test Suite & WebGL Benchmark Execution
1. Run Vitest unit test suite (math, matrix transformations, glTF exporters):
   ```bash
   npx vitest run
   ```
2. Run Playwright WebGL visual regression suite (if configured):
   ```bash
   npx playwright test
   ```

### Step 5: Report Synthesis & Summary Generation
Synthesize findings into an audit report:

```markdown
# 🔍 CAD2Three.js Code Audit Report

**Tech Stack:** React 18 | Vite | TypeScript | Three.js | WebAssembly (OpenCascade.js / web-ifc)

## Executive Summary
- **TypeScript Compiler (`tsc`):** <PASS/FAIL> (<TYPE_ERRORS> errors)
- **ESLint Analysis:** <PASS/FAIL> (<LINT_ERRORS> issues)
- **Security Audit (`npm audit`):** <PASS/FAIL> (<CRITICAL_COUNT> critical, <HIGH_COUNT> high)
- **Unit & WebGL Tests:** <PASS/FAIL> (<PASSED_TESTS>/<TOTAL_TESTS> passed)

## CAD & WebGL Specific Audit Checklist
- [ ] **Off-Thread Processing:** All OpenCascade WASM & web-ifc parsing calls run inside Web Workers.
- [ ] **Memory Leak Safeguards:** Three.js objects (`geometry.dispose()`, `material.dispose()`) and native OpenCascade C++ handles are explicitly freed.
- [ ] **SharedArrayBuffer Headers:** Vite dev server and production configs emit COOP/COEP headers.

## Action Items & Fix Recommendations
1. `<Detailed issue breakdown with file line links>`
```

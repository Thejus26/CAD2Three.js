---
name: feature-start
description: Initializes a new feature branch from the base branch, checking working tree status and confirming branch creation for CAD2Three.js.
---

# Skill: `feature-start`

## Configuration Variables
```yaml
base_branch_name: "main"
branch_prefix: "feature/"
strict_uncommitted_check: false
project_type: "React-Vite-TypeScript"
```

## Description
This skill automates starting a new development feature branch tailored for the CAD2Three.js repository (React 18, Vite, TypeScript, Three.js, WebAssembly).

---

## Step-by-Step Execution Instructions

### Step 1: Input Validation & Solicitation
1. Check if a `step-name` was provided by the user in the prompt (e.g., `step-loader`, `view-cube`, `wasm-worker`).
2. If no `step-name` was provided, prompt the user:
   > "Please provide a feature step name (e.g., `step-loader`, `view-cube`, `wasm-worker`)."
3. Sanitize the provided name:
   - Convert uppercase letters to lowercase.
   - Replace spaces and underscores with hyphens (`-`).
   - Strip invalid Git branch characters (`~`, `^`, `:`, `?`, `*`, `[`, `\`, `..`, `@{`).

### Step 2: Working Tree Status Verification
1. Run the following command:
   ```bash
   git status --porcelain
   ```
2. If output is non-empty:
   - If `strict_uncommitted_check` is `true`:
     - Display a warning listing uncommitted files and **ABORT** execution.
   - If `strict_uncommitted_check` is `false`:
     - Warn the user:
       > "⚠️ **Warning:** You have uncommitted changes in your CAD2Three.js working tree. Proceeding with branch creation."

### Step 3: Base Branch Verification
1. Check the active branch:
   ```bash
   git branch --show-current
   ```
2. If not on `base_branch_name` (`main`), inform the user that the new branch will branch off the current HEAD.

### Step 4: Branch Creation
1. Construct target branch: `feature/<step-name>`.
2. Execute branch creation and checkout:
   ```bash
   git checkout -b feature/<step-name>
   ```

### Step 5: Sync Current Feature Context
1. Locate the corresponding feature specification markdown file in `context/features/` matching the requested `<step-name>` or referenced spec file (e.g. `context/features/phase-1/milestone-1-1-environment-foundation-spec.md`).
2. Overwrite `context/current-feature.md` with the content of the target milestone spec file so AI agents and developer tools have active context on sub-tasks, testing process, and acceptance criteria.

### Step 6: Confirmation & Output
1. Confirm active branch:
   ```bash
   git branch --show-current
   ```
2. Output a clear success message:
   > "✅ **CAD2Three.js Feature Branch Created:** Switched to `feature/<step-name>`. Updated `context/current-feature.md` with milestone specification! Ready to work on React / Three.js / WASM modules!"

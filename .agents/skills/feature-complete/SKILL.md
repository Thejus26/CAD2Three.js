---
name: feature-complete
description: Stages, commits, merges a CAD2Three.js feature branch into main, pushes to remote, and cleans up local/remote feature branches safely.
---

# Skill: `feature-complete`

## Configuration Variables
```yaml
main_branch_name: "main"
remote_name: "origin"
commit_prefix: "feat(cad2three):"
build_verification_cmd: "npm run build"
```

## Description
This skill safely finalizes a CAD2Three.js feature branch: it verifies TypeScript/Vite builds pass, commits all changes, merges into main, pushes to remote, and cleans up feature branches.

---

## Step-by-Step Execution Instructions

### Step 1: Branch Verification & Sanity Check
1. Retrieve current branch:
   ```bash
   git branch --show-current
   ```
2. Ensure current branch starts with `feature/`:
   - If branch is `main` or does NOT start with `feature/`:
     - **ABORT** with error:
       > "❌ **Error:** `feature-complete` must be executed from a `feature/*` branch."

3. Extract `<step-name>` from `feature/<step-name>`.

### Step 2: Build Verification (CAD2Three.js Stack)
1. Run local Vite/TypeScript production build verification before committing:
   ```bash
   npm run build
   ```
2. If build fails due to TypeScript lints or bundle errors, **ABORT** and report build errors to the user.

### Step 3: Stage & Commit Feature Changes
1. Stage all changes:
   ```bash
   git add -A
   ```
2. Commit with conventional commit message:
   ```bash
   git commit -m "feat(cad2three): Completed feature/<step-name>"
   ```
3. Verify working tree is completely clean:
   ```bash
   git status --porcelain
   ```

### Step 4: Checkout Main & Update Remote
1. Switch to `main`:
   ```bash
   git checkout main
   ```
2. Pull latest upstream changes:
   ```bash
   git pull origin main
   ```

### Step 5: Merge Feature Branch & Handle Conflicts
1. Merge feature branch into main:
   ```bash
   git merge feature/<step-name> --no-ff -m "Merge feature/<step-name> into main"
   ```
2. **Conflict Handling:**
   - If merge conflicts occur:
     ```bash
     git merge --abort
     git checkout feature/<step-name>
     ```
     - **ABORT** and instruct user to resolve merge conflicts manually.

### Step 6: Push to Remote & Cleanup
1. Push `main` to remote:
   ```bash
   git push origin main
   ```
2. Delete feature branches:
   ```bash
   git branch -d feature/<step-name>
   git push origin --delete feature/<step-name>
   ```

### Step 7: Confirmation
Output summary report:
> "🎉 **CAD2Three.js Feature Completed & Deployed to Main!**"
> - Built & Verified TypeScript bundle
> - Merged `feature/<step-name>` into `main`
> - Pushed `main` to `origin`
> - Cleaned up local & remote `feature/<step-name>`

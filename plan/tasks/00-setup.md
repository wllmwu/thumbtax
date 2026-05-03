# Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install dependencies, configure tooling, and put down the directory skeleton so the rest of the plans can run unblocked.

**Architecture:** Bare Vite + React 19 + TypeScript app already exists under `thumbtax-webapp/`. This plan adds Vitest, jsdom, React Testing Library, Zustand, React Router, React Aria Components, React Flow, SheetJS, and uuid; configures the test runner to support jsdom + DOM matchers; ensures the `#src/*` path alias resolves at test time; and replaces the placeholder `App.tsx` with an empty scaffold the UI plan will fill in.

**Tech Stack:** TypeScript, React 19, Vite 8, Vitest, jsdom, @testing-library/react, Zustand 5, React Router 7, React Aria Components, React Flow, SheetJS (`xlsx`), `uuid`.

---

## File Structure

- `thumbtax-webapp/package.json` — add dependencies and `test` script.
- `thumbtax-webapp/vite.config.ts` — add Vitest configuration (jsdom env, setup file, css handling, alias parity).
- `thumbtax-webapp/vitest.setup.ts` — registers `@testing-library/jest-dom` matchers and `cleanup` after each test.
- `thumbtax-webapp/tsconfig.app.json` — add `vitest/globals` and DOM testing types.
- `thumbtax-webapp/src/App.tsx` — replace template with empty placeholder (will be filled by the UI plan).
- `thumbtax-webapp/src/App.test.tsx` — sanity test that the app renders.
- `thumbtax-webapp/src/index.css` — leave as-is (global styles only).
- Delete `thumbtax-webapp/src/App.css` and `thumbtax-webapp/src/assets/` (template artifacts).

---

### Task 1: Install runtime and dev dependencies

**Files:**
- Modify: `thumbtax-webapp/package.json`

- [ ] **Step 1: Install runtime dependencies**

Run from `thumbtax-webapp/`:

```bash
npm install zustand@^5 react-router@^7 react-aria-components@^1 reactflow@^11 xlsx@^0.20
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install --save-dev vitest@^3 jsdom@^26 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14 @types/uuid
```

- [ ] **Step 3: Add `test` script to `package.json`**

In the `"scripts"` block, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Commit**

```bash
git add thumbtax-webapp/package.json thumbtax-webapp/package-lock.json
git commit -m "Add Zustand, Router, React Aria, React Flow, SheetJS, Vitest"
```

---

### Task 2: Configure Vitest

**Files:**
- Create: `thumbtax-webapp/vitest.setup.ts`
- Modify: `thumbtax-webapp/vite.config.ts`
- Modify: `thumbtax-webapp/tsconfig.app.json`

- [ ] **Step 1: Create the setup file**

`thumbtax-webapp/vitest.setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 2: Configure Vite for tests**

Replace `thumbtax-webapp/vite.config.ts` with:

```typescript
/// <reference types="vitest/config" />
import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
});
```

- [ ] **Step 3: Make `tsconfig.app.json` aware of Vitest globals**

In `thumbtax-webapp/tsconfig.app.json`, change `"types": ["vite/client"]` to:

```json
"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
```

- [ ] **Step 4: Verify**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add thumbtax-webapp/vitest.setup.ts thumbtax-webapp/vite.config.ts thumbtax-webapp/tsconfig.app.json
git commit -m "Configure Vitest with jsdom and Testing Library"
```

---

### Task 3: Replace template `App.tsx` with empty scaffold

**Files:**
- Modify: `thumbtax-webapp/src/App.tsx`
- Create: `thumbtax-webapp/src/App.test.tsx`
- Delete: `thumbtax-webapp/src/App.css`, `thumbtax-webapp/src/assets/` (and any reference in `index.css`)
- Modify: `thumbtax-webapp/src/index.css` if it imports `App.css`

- [ ] **Step 1: Write the failing test**

`thumbtax-webapp/src/App.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";

import App from "#src/App";

describe("App", () => {
  it("renders the application root", () => {
    render(<App />);
    screen.getByTestId("app-root");
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

```bash
cd thumbtax-webapp && npm test -- App.test
```

Expected: FAIL — element with `data-testid="app-root"` not found.

- [ ] **Step 3: Replace `App.tsx`**

`thumbtax-webapp/src/App.tsx`:

```typescript
function App() {
  return <div data-testid="app-root" />;
}

export default App;
```

- [ ] **Step 4: Remove template artifacts**

```bash
rm -rf thumbtax-webapp/src/App.css thumbtax-webapp/src/assets
```

If `thumbtax-webapp/src/index.css` references `App.css` or `./assets/`, remove those lines.

- [ ] **Step 5: Run test, verify it passes**

```bash
cd thumbtax-webapp && npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A thumbtax-webapp/src
git commit -m "Reset App.tsx to empty scaffold"
```

---

### Task 4: Lint and typecheck baseline

- [ ] **Step 1: Run typecheck and lint**

```bash
cd thumbtax-webapp && npm run typecheck && npm run lint
```

Expected: both pass with no errors.

- [ ] **Step 2: If lint reports issues, autofix and re-run**

```bash
cd thumbtax-webapp && npm run fixlint && npm run lint
```

- [ ] **Step 3: Commit any autofix changes (if any)**

```bash
git add -A && git diff --cached --quiet || git commit -m "Apply lint autofixes"
```

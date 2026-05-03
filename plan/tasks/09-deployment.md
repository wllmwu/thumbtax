# Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Thumbtax to GitHub Pages on every push to `main` whose checks pass.

**Architecture:** A single GitHub Actions workflow runs install, typecheck, lint, test, and Vite build, then uploads the `dist/` directory and deploys to GitHub Pages using the official `actions/deploy-pages` action. The Vite config already uses `base: "./"` (set in `00-setup.md`) so relative asset paths work under any GitHub Pages path. Depends on every previous plan.

**Tech Stack:** GitHub Actions, GitHub Pages.

---

## File Structure

- `.github/workflows/ci.yml` — runs typecheck, lint, test on push and PR.
- `.github/workflows/deploy.yml` — builds and deploys to GitHub Pages on push to `main`.
- `thumbtax-webapp/public/.nojekyll` — empty marker file so GitHub Pages doesn't run Jekyll on the build output.

---

### Task 1: CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: thumbtax-webapp
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: thumbtax-webapp/package-lock.json
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
```

- [ ] **Step 2: Push and verify the workflow runs**

```bash
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push
```

Then in GitHub, open the Actions tab and confirm the run is green.

---

### Task 2: GitHub Pages deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `thumbtax-webapp/public/.nojekyll`

- [ ] **Step 1: Add `.nojekyll`**

```bash
touch thumbtax-webapp/public/.nojekyll
```

- [ ] **Step 2: Write the deploy workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: thumbtax-webapp
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: thumbtax-webapp/package-lock.json
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: thumbtax-webapp/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Enable Pages in repo settings**

In the GitHub repo: Settings → Pages → "Build and deployment" → Source = "GitHub Actions". (Manual one-time step; no automation possible here.)

- [ ] **Step 4: Commit and push**

```bash
git add .github/workflows/deploy.yml thumbtax-webapp/public/.nojekyll
git commit -m "Add GitHub Pages deploy workflow"
git push
```

- [ ] **Step 5: Verify**

Watch the Actions tab. After the deploy job finishes, open the URL printed in its summary and confirm the app loads, the form list renders, and `npm run dev` parity holds in production.

---

### Task 3: README

**Files:**
- Modify: `README.md` (root) and/or `thumbtax-webapp/README.md`

- [ ] **Step 1: Brief README addition**

Add a short section describing how to run the app locally:

```markdown
## Local development

```bash
cd thumbtax-webapp
npm install
npm run dev
```

Run the test suite with `npm test`. Production builds with `npm run build`.

The deployed app is hosted at https://<owner>.github.io/<repo>/.
```

- [ ] **Step 2: Commit**

```bash
git add README.md thumbtax-webapp/README.md
git commit -m "Document local development workflow"
```

# `webapp` package

This package contains the Thumbtax frontend web app.

## Main dependencies

The app is a Vite + React + TypeScript project.
Its main dependencies include:

- `common` package
- `forms` package
- Markdoc: for rendering serialized Markdoc exported from `forms`
- React Aria: for primitive UI components
- React Router: for client-side routing
- Zod: for deserializing persisted state
- Zustand: for central state management

## Modules

- `webapp/src/`
  - `common/`: Type definitions consumed by multiple other modules
  - `engine/`: Core algorithm that computes new state
  - `persistence/`: Handles saving/loading state to/from various formats
  - `state/`: Central state manager
  - `test/`: Test utilities
  - `ui/`: Presentation layer, including almost all React code
  - `App.tsx`: Global providers and routing configuration
  - `index.css`: Global stylesheet
  - `main.tsx`: React entry point
- `webapp/index.html`: Main HTML file

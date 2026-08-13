# `ui` module

This module contains all of the application's presentation logic (React components).
Since there are a lot of components, it's further organized into submodules.

Styles are defined using CSS modules in `*.module.css` files colocated with the corresponding `*.tsx` React files.

- `webapp/src/ui/`
  - `content/`: Small components used to render Markdoc and other text content
  - `control-bar/`: Control bar on the main page
  - `formatting/`: Data formatting helpers
  - `forms/`: Components involved in displaying and interacting with form instances
  - `library-styles/`: Global stylesheets for applying styles to library CSS classes
  - `navigation/`: Navigation menu
  - `pages/`: Layout wrapper and page components
  - `primitives/`: Primitive UI elements such as buttons and input fields. Most are wrappers around React Aria components that set project styles and/or shrink the interfaces.
  - `table-of-contents/`: Table of contents component
  - `types/`: UI-specific types
  - `utils/`: UI-specific utility functions

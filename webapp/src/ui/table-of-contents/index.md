# `table-of-contents` module

Provides the collapsible table-of-contents sidebar shared by pages that link to their own headings.

- `webapp/src/ui/table-of-contents/`
  - `tableOfContentsHeading.ts`: The `TableOfContentsHeading` type a page builds a list of, to describe the headings it wants linked
  - `TableOfContents.tsx`: A plain list of links built from a `TableOfContentsHeading[]`
  - `PageWithTableOfContents.tsx`: Layout wrapper that positions a page's content next to a collapsible `TableOfContents` sidebar

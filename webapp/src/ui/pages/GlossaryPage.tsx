import React from "react";

import { glossary } from "@thumbtax/forms";

import { ProseContent } from "#src/ui/content/ProseContent";
import { PageWithTableOfContents } from "#src/ui/table-of-contents/PageWithTableOfContents";

import type { TableOfContentsHeading } from "#src/ui/table-of-contents/tableOfContentsHeading";

export function GlossaryPage(): React.ReactNode {
  const entries = Object.entries(glossary);
  const headings: TableOfContentsHeading[] = entries.map(([term, entry]) => ({
    id: term,
    label: entry.name,
  }));

  return (
    <PageWithTableOfContents headings={headings}>
      <h1>Glossary</h1>
      <dl>
        {entries.map(([term, entry]) => (
          <div key={term}>
            <dt id={term}>{entry.name}</dt>
            <dd>
              <ProseContent nodes={entry.definition} />
            </dd>
          </div>
        ))}
      </dl>
    </PageWithTableOfContents>
  );
}

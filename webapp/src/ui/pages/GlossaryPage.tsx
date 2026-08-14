import React from "react";

import { glossary } from "@thumbtax/forms";

import { ProseContent } from "#src/ui/content/ProseContent";
import { Page } from "#src/ui/pages/Page";

import type { TableOfContentsHeading } from "#src/ui/table-of-contents/types/tableOfContentsHeading";

export function GlossaryPage(): React.ReactNode {
  const entries = React.useMemo(() => Object.entries(glossary), []);
  const headings = React.useMemo<TableOfContentsHeading[]>(
    () =>
      entries.map(([term, entry]) => ({
        id: term,
        label: entry.name,
      })),
    [entries],
  );

  return (
    <Page headings={headings} header={<h1>Glossary</h1>}>
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
    </Page>
  );
}

import React from "react";

import { glossary } from "@thumbtax/forms";

import { ProseContent } from "#src/ui/content/ProseContent";

export function GlossaryPage(): React.ReactNode {
  return (
    <div>
      <h1>Glossary</h1>
      <dl>
        {Object.entries(glossary).map(([term, entry]) => (
          <div key={term}>
            <dt id={term}>{entry.name}</dt>
            <dd>
              <ProseContent nodes={entry.definition} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

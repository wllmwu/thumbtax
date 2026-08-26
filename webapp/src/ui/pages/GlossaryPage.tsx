import React from "react";

import { glossary } from "@thumbtax/forms";

import { ProseContent } from "#src/ui/content/ProseContent";
import { Page } from "#src/ui/pages/Page";
import { useTargetedId } from "#src/ui/utils/useTargetedId";
import styles from "#src/ui/pages/GlossaryPage.module.css";

import type { TableOfContentsHeading } from "#src/ui/types/tableOfContentsHeading";

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

  const targetedId = useTargetedId();

  return (
    <Page headings={headings} header={<h1>Glossary</h1>}>
      <dl>
        {entries.map(([term, entry]) => (
          <div key={term}>
            <dt
              id={term}
              className={targetedId === term ? styles.targeted : undefined}
            >
              {entry.name}
            </dt>
            <dd>
              <ProseContent nodes={entry.definition} />
              {entry.learnMore && (
                <p>
                  <span className={styles.learnMore}>Learn more:</span>{" "}
                  {<ProseContent nodes={entry.learnMore} />}
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Page>
  );
}

import React from "react";

import { glossary } from "@thumbtax/forms";
import { Popover, PreviewTrigger } from "react-aria-components";

import { ProseContent } from "#src/ui/content/ProseContent";
import { Link } from "#src/ui/primitives/Link";
import styles from "#src/ui/content/GlossaryLink.module.css";

import type { GlossaryTerm } from "@thumbtax/forms";

type Props = {
  children: React.ReactNode;
  term: GlossaryTerm;
};

const GlossaryLinkContext = React.createContext(false);

export function GlossaryLink({ children, term }: Props): React.ReactNode {
  const isInsidePreview = React.useContext(GlossaryLinkContext);

  const link = <Link href={`/glossary#${term}`}>{children}</Link>;

  if (isInsidePreview) {
    return link;
  }
  return (
    <PreviewTrigger closeDelay={0} delay={0}>
      {link}
      <Popover offset={4} placement="top start">
        <GlossaryLinkContext.Provider value={true}>
          <div>
            <div className={styles.name}>{glossary[term].name}</div>
            <div>
              <ProseContent nodes={glossary[term].definition} />
            </div>
          </div>
        </GlossaryLinkContext.Provider>
      </Popover>
    </PreviewTrigger>
  );
}

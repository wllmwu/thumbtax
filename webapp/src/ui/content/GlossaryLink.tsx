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

export function GlossaryLink({ children, term }: Props): React.ReactNode {
  return (
    <PreviewTrigger closeDelay={0} delay={0}>
      <Link href={`/glossary#${term}`}>{children}</Link>
      <Popover offset={4} placement="top start">
        <div>
          <div className={styles.name}>{glossary[term].name}</div>
          <div>
            <ProseContent nodes={glossary[term].definition} />
          </div>
        </div>
      </Popover>
    </PreviewTrigger>
  );
}

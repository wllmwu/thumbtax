import React from "react";

import { renderers } from "@markdoc/markdoc";
import { glossary } from "@thumbtax/glossary";

function GlossaryDefinition({
  children,
  term,
}: {
  children: React.ReactNode;
  term: string;
}): React.ReactNode {
  return (
    <div>
      {term}
      <br />
      {children}
    </div>
  );
}

export function GlossaryPage(): React.ReactNode {
  return React.useMemo(() => {
    return renderers.react(glossary, React, {
      components: { GlossaryDefinition },
    });
  }, []);
}

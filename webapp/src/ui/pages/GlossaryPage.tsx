import React from "react";

import { renderers } from "@markdoc/markdoc";
import { glossary } from "@thumbtax/glossary";

export function GlossaryPage(): React.ReactNode {
  return React.useMemo(() => {
    return renderers.react(glossary, React);
  }, []);
}

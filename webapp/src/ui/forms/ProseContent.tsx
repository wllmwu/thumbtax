import React from "react";

import { renderers } from "@markdoc/markdoc";

import { FormLink } from "#src/ui/forms/FormLink";

import type { RenderableTreeNodes } from "@markdoc/markdoc";

type Props = {
  nodes: RenderableTreeNodes | undefined;
};

export function ProseContent({ nodes }: Props): React.ReactNode {
  return React.useMemo(() => {
    if (!nodes) {
      return null;
    }
    return renderers.react(nodes, React, { components: { FormLink } });
  }, [nodes]);
}

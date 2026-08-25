import type { RenderableTreeNodes } from "@markdoc/markdoc";

export type GlossaryEntry = {
  name: string;
  definition: RenderableTreeNodes;
  learnMore?: RenderableTreeNodes;
};

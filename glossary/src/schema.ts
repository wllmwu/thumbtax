import { GLOSSARY_TERMS } from "./types/glossaryTerm";

import type { Config } from "@markdoc/markdoc";

export const config: Config = {
  tags: {
    definition: {
      attributes: {
        term: {
          type: "String",
          errorLevel: "error",
          matches: [...GLOSSARY_TERMS],
          required: true,
        },
      },
      render: "GlossaryDefinition",
    },
  },
};

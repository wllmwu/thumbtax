import { GLOSSARY_TERMS } from "./types/glossaryTerm";

import type { Config } from "@markdoc/markdoc";

export const config: Config = {
  tags: {
    definition: {
      render: "dd",
    },
    entry: {
      attributes: {
        id: {
          type: "String",
          errorLevel: "error",
          matches: [...GLOSSARY_TERMS],
          required: true,
        },
      },
      render: "div",
    },
    glossary: {
      children: ["tag"],
      render: "dl",
    },
    term: {
      render: "dt",
    },
  },
};

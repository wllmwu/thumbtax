import { FORM_CLASSES } from "@thumbtax/common";

import { GLOSSARY_TERMS } from "../types/glossaryTerm";

import type { Schema } from "@markdoc/markdoc";

export const formLinkTag: Schema = {
  attributes: {
    formClass: {
      type: "String",
      required: true,
      matches: [...FORM_CLASSES],
      errorLevel: "error",
    },
  },
  render: "FormLink",
};

export const glossaryLinkTag: Schema = {
  attributes: {
    term: {
      type: "String",
      required: true,
      matches: [...GLOSSARY_TERMS],
      errorLevel: "error",
    },
  },
  render: "GlossaryLink",
};

import type { FormCategory } from "./formCategory";
import type { ValueProvider } from "./valueProvider";
import type { RenderableTreeNodes } from "@markdoc/markdoc";
import type { BoxFormat, BoxIdentifier, FormClass } from "@thumbtax/common";

type LineIndex = string;
type ColumnIndex = string;

export type FormSpecification = {
  class: FormClass;
  irsPageUrl: string;
  category: FormCategory;
  maxInstances: number | null;
  title: string;
  subtitle?: string;
  instructions?: RenderableTreeNodes;
  commentary?: RenderableTreeNodes;
  sections: Array<FormSection<false> | FormSection<true>>;
};

export type FormSection<MultiColumns extends boolean> = {
  heading?: string;
  subtitle?: string;
  instructions?: RenderableTreeNodes;
  commentary?: RenderableTreeNodes;
  lines: Array<FormLine<MultiColumns>>;
} & (MultiColumns extends true
  ? {
      columns: Array<{
        index: ColumnIndex;
        instructions?: RenderableTreeNodes;
      }>;
    }
  : {
      columns?: never;
    });

export type FormLine<MultiColumns extends boolean> = {
  index: LineIndex;
  virtual?: boolean;
  instructions?: RenderableTreeNodes;
  commentary?: RenderableTreeNodes;
} & (MultiColumns extends true
  ? {
      boxes: Array<FormBox<MultiColumns>>;
    }
  : {
      box: FormBox<MultiColumns>;
    });

export type FormBox<MultiColumns extends boolean> = {
  identifier: BoxIdentifier;
  value: ValueProvider;
  format?: BoxFormat;
} & (MultiColumns extends true
  ? {
      column: ColumnIndex;
    }
  : {
      column?: never;
    });

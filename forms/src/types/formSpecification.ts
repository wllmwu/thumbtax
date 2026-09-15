import type { FormCategory } from "./formCategory";
import type { ValueProvider } from "./valueProvider";
import type { RenderableTreeNodes } from "@markdoc/markdoc";
import type { BoxFormat, BoxIdentifier, FormClass } from "@thumbtax/common";

type LineIndex = string;
type ColumnIndex = string;

export type FormSpecification<InputKey extends string = string> = {
  class: FormClass;
  irsPageUrl: string;
  category: FormCategory;
  maxInstances: number | null;
  title: string;
  subtitle?: string;
  instructions?: RenderableTreeNodes;
  commentary?: RenderableTreeNodes;
  sections: Array<FormSection<false, InputKey> | FormSection<true, InputKey>>;
};

export type FormSection<
  MultiColumns extends boolean,
  InputKey extends string = string,
> = {
  heading?: string;
  subtitle?: string;
  instructions?: RenderableTreeNodes;
  commentary?: RenderableTreeNodes;
  lines: Array<FormLine<MultiColumns, InputKey>>;
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

export type FormLine<
  MultiColumns extends boolean,
  InputKey extends string = string,
> = {
  index: LineIndex;
  virtual?: boolean;
  instructions?: RenderableTreeNodes;
  commentary?: RenderableTreeNodes;
} & (MultiColumns extends true
  ? {
      boxes: Array<FormBox<MultiColumns, InputKey>>;
    }
  : {
      box: FormBox<MultiColumns, InputKey>;
    });

export type FormBox<
  MultiColumns extends boolean,
  InputKey extends string = string,
> = {
  identifier: BoxIdentifier;
  value: ValueProvider<InputKey>;
  format?: BoxFormat;
} & (MultiColumns extends true
  ? {
      column: ColumnIndex;
    }
  : {
      column?: never;
    });

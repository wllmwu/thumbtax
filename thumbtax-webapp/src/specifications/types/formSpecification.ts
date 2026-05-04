import type { BoxFormat } from "#src/common/types/boxFormat";
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FormClass } from "#src/common/types/formClass";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

type LineIndex = string;
type ColumnIndex = string;

export type FormSpecification = {
  class: FormClass;
  title: string;
  subtitle?: string;
  description?: string;
  irsPageUrl: string;
  category: "income" | "taxes";
  maxInstances: number | null;
  sections: Array<FormSection<false | true>>;
};

export type FormSection<MultiColumns extends boolean> = {
  heading?: string;
  lines: Array<FormLine<MultiColumns>>;
} & (MultiColumns extends true
  ? {
      columns: Array<{
        index: ColumnIndex;
        description?: string;
      }>;
    }
  : object);

export type FormLine<MultiColumns extends boolean> = {
  index: LineIndex;
  description?: string;
  boxes: Array<FormBox<MultiColumns>>;
};

export type FormBox<MultiColumns extends boolean> = {
  identifier: BoxIdentifier;
  value: ValueProvider;
  format?: BoxFormat;
  helpText?: string;
} & (MultiColumns extends true
  ? {
      column: ColumnIndex;
    }
  : object);

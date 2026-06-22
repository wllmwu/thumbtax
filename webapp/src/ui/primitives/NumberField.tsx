import React from "react";

import { NumberFormatter, NumberParser } from "@internationalized/number";
import { useLocale } from "react-aria-components";

import { useFormatBoxValue } from "#src/ui/formatting/useFormatBoxValue";
import { TextField } from "#src/ui/primitives/TextField";

import type { BoxFormat } from "@thumbtax/common";
import type { FieldProps } from "#src/ui/types/fieldProps";
import type { InputProps } from "#src/ui/types/inputProps";

type Props = FieldProps<number> &
  InputProps & {
    format: BoxFormat;
  };

export function NumberField({ format, value, onChange, ...props }: Props) {
  const { locale } = useLocale();

  const formatBoxValue = useFormatBoxValue({ format });

  const { textParser, textFormatter } = React.useMemo(() => {
    const maximumFractionDigits = format === "financial" ? 2 : undefined;
    const options: Intl.NumberFormatOptions = {
      style: "decimal",
      maximumFractionDigits,
      useGrouping: false,
    };
    return {
      textParser: new NumberParser(locale, options),
      textFormatter: new NumberFormatter(locale, options),
    };
  }, [format, locale]);

  const [textValue, setTextValue] = React.useState(() => formatBoxValue(value));

  const onFocus = React.useCallback(
    () => setTextValue(textFormatter.format(value)),
    [textFormatter, value],
  );

  const onChangeText = React.useCallback(
    (newText: string) => {
      if (textParser.isValidPartialNumber(newText)) {
        setTextValue(newText);
      }
    },
    [textParser],
  );

  const onBlur = React.useCallback(() => {
    const newValue = textParser.parse(textValue);
    if (!Number.isNaN(newValue)) {
      const roundedNewValue = textParser.parse(textFormatter.format(newValue));
      setTextValue(formatBoxValue(roundedNewValue));
      onChange(roundedNewValue);
    }
  }, [formatBoxValue, onChange, textFormatter, textParser, textValue]);

  return (
    <TextField
      {...props}
      inputMode="decimal"
      value={textValue}
      onChange={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

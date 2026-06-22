import React from "react";

import { NumberFormatter } from "@internationalized/number";
import { absurd } from "@thumbtax/common";
import { useLocale } from "react-aria-components";

import type { BoxFormat } from "@thumbtax/common";

type Props = {
  format: BoxFormat;
};

type FormatBoxValueFn = (value: number) => string;

export function useFormatBoxValue({ format }: Props): FormatBoxValueFn {
  const { locale } = useLocale();

  const formatter = React.useMemo(() => {
    switch (format) {
      case "financial":
        return new NumberFormatter(locale, {
          style: "currency",
          currency: "USD",
          currencySign: "accounting",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      case "percentage":
        return new NumberFormatter(locale, {
          style: "percent",
          maximumFractionDigits: 2,
        });
      case "checkbox":
      case "plain":
      case "yes_no":
        return new NumberFormatter(locale, {
          style: "decimal",
        });
      default:
        absurd(format);
    }
  }, [format, locale]);

  return React.useCallback(
    (value) => {
      switch (format) {
        case "financial":
          return formatter
            .formatToParts(value)
            .filter((part) => part.type !== "currency")
            .map((part) => part.value)
            .join("")
            .trim();
        case "checkbox":
        case "percentage":
        case "plain":
        case "yes_no":
          return formatter.format(value);
        default:
          absurd(format);
      }
    },
    [format, formatter],
  );
}

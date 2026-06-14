import { renderHook } from "@testing-library/react";
import { I18nProvider } from "react-aria-components";
import { describe, expect, it } from "vitest";

import { useFormatBoxValue } from "#src/ui/formatting/useFormatBoxValue";

import type { BoxFormat } from "#src/common/types/boxFormat";

function renderFormatBoxValue(format: BoxFormat) {
  const { result } = renderHook(() => useFormatBoxValue({ format }), {
    wrapper: ({ children }) => (
      <I18nProvider locale="en-US">{children}</I18nProvider>
    ),
  });

  return result.current;
}

type FormatExpectations = {
  financial: string;
  percentage: string;
  other: string;
};

type FormatCase = {
  input: number;
  positive: FormatExpectations;
  negative: FormatExpectations;
};

const cases: FormatCase[] = [
  {
    input: 0.00001,
    positive: { financial: "0.00", percentage: "0%", other: "0" },
    negative: { financial: "(0.00)", percentage: "-0%", other: "-0" },
  },
  {
    input: 0.0005,
    positive: { financial: "0.00", percentage: "0.05%", other: "0.001" },
    negative: { financial: "(0.00)", percentage: "-0.05%", other: "-0.001" },
  },
  {
    input: 0.005,
    positive: { financial: "0.01", percentage: "0.5%", other: "0.005" },
    negative: { financial: "(0.01)", percentage: "-0.5%", other: "-0.005" },
  },
  {
    input: 0.05,
    positive: { financial: "0.05", percentage: "5%", other: "0.05" },
    negative: { financial: "(0.05)", percentage: "-5%", other: "-0.05" },
  },
  {
    input: 0.1,
    positive: { financial: "0.10", percentage: "10%", other: "0.1" },
    negative: { financial: "(0.10)", percentage: "-10%", other: "-0.1" },
  },
  {
    input: 0.105,
    positive: { financial: "0.11", percentage: "10.5%", other: "0.105" },
    negative: { financial: "(0.11)", percentage: "-10.5%", other: "-0.105" },
  },
  {
    input: 0.23,
    positive: { financial: "0.23", percentage: "23%", other: "0.23" },
    negative: { financial: "(0.23)", percentage: "-23%", other: "-0.23" },
  },
  {
    input: 1,
    positive: { financial: "1.00", percentage: "100%", other: "1" },
    negative: { financial: "(1.00)", percentage: "-100%", other: "-1" },
  },
  {
    input: 1.2345,
    positive: { financial: "1.23", percentage: "123.45%", other: "1.235" },
    negative: { financial: "(1.23)", percentage: "-123.45%", other: "-1.235" },
  },
  {
    input: 123.45,
    positive: { financial: "123.45", percentage: "12,345%", other: "123.45" },
    negative: {
      financial: "(123.45)",
      percentage: "-12,345%",
      other: "-123.45",
    },
  },
  {
    input: 1234.5,
    positive: {
      financial: "1,234.50",
      percentage: "123,450%",
      other: "1,234.5",
    },
    negative: {
      financial: "(1,234.50)",
      percentage: "-123,450%",
      other: "-1,234.5",
    },
  },
  {
    input: 1234567.08912,
    positive: {
      financial: "1,234,567.09",
      percentage: "123,456,708.91%",
      other: "1,234,567.089",
    },
    negative: {
      financial: "(1,234,567.09)",
      percentage: "-123,456,708.91%",
      other: "-1,234,567.089",
    },
  },
];

describe("useFormatBoxValue", () => {
  describe("financial format", () => {
    it("formats +/- zero correctly", () => {
      const formatBoxValue = renderFormatBoxValue("financial");
      expect(formatBoxValue(0)).toEqual("0.00");
      expect(formatBoxValue(-0)).toEqual("(0.00)");
    });

    it("formats positive numbers correctly", () => {
      const formatBoxValue = renderFormatBoxValue("financial");
      for (const { input, positive } of cases) {
        expect(formatBoxValue(input), `input=${input}`).toEqual(
          positive.financial,
        );
      }
    });

    it("formats negative numbers correctly", () => {
      const formatBoxValue = renderFormatBoxValue("financial");
      for (const { input, negative } of cases) {
        expect(formatBoxValue(-input), `input=${input}`).toEqual(
          negative.financial,
        );
      }
    });
  });

  describe("percentage format", () => {
    it("formats +/- zero correctly", () => {
      const formatBoxValue = renderFormatBoxValue("percentage");
      expect(formatBoxValue(0)).toEqual("0%");
      expect(formatBoxValue(-0)).toEqual("-0%");
    });

    it("formats positive numbers correctly", () => {
      const formatBoxValue = renderFormatBoxValue("percentage");
      for (const { input, positive } of cases) {
        expect(formatBoxValue(input), `input=${input}`).toEqual(
          positive.percentage,
        );
      }
    });

    it("formats negative numbers correctly", () => {
      const formatBoxValue = renderFormatBoxValue("percentage");
      for (const { input, negative } of cases) {
        expect(formatBoxValue(-input), `input=${input}`).toEqual(
          negative.percentage,
        );
      }
    });
  });

  describe.each<BoxFormat>(["checkbox", "plain", "yes_no"])(
    "%s format",
    (format) => {
      it("formats +/- zero correctly", () => {
        const formatBoxValue = renderFormatBoxValue(format);
        expect(formatBoxValue(0)).toEqual("0");
        expect(formatBoxValue(-0)).toEqual("-0");
      });

      it("formats positive numbers correctly", () => {
        const formatBoxValue = renderFormatBoxValue(format);
        for (const { input, positive } of cases) {
          expect(formatBoxValue(input), `input=${input}`).toEqual(
            positive.other,
          );
        }
      });

      it("formats negative numbers correctly", () => {
        const formatBoxValue = renderFormatBoxValue(format);
        for (const { input, negative } of cases) {
          expect(formatBoxValue(-input), `input=${input}`).toEqual(
            negative.other,
          );
        }
      });
    },
  );
});

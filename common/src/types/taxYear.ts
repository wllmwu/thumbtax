export const TAX_YEARS = [2025, 2026] as const;

export type TaxYear = (typeof TAX_YEARS)[number];

export const LATEST_TAX_YEAR: TaxYear = TAX_YEARS.reduce<TaxYear>(
  (latest, year) => (year > latest ? year : latest),
  TAX_YEARS[0],
);

export function isTaxYear(year: number): year is TaxYear {
  return TAX_YEARS.some((taxYear) => taxYear === year);
}

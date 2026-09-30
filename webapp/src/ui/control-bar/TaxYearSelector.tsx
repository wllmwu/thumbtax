import React from "react";

import { isTaxYear, TAX_YEARS } from "@thumbtax/common";
import { Dialog, Heading, Modal, Text } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { DialogFooter } from "#src/ui/primitives/DialogFooter";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";

import type { TaxYear } from "@thumbtax/common";

const TAX_YEARS_NEWEST_FIRST = TAX_YEARS.toSorted((a, b) => b - a);

export function TaxYearSelector() {
  const taxYear = useStore((state) => state.applicationState.taxYear);
  const hasForms = useStore(
    (state) => state.applicationState.formClasses.length > 0,
  );
  const setTaxYear = useStore((state) => state.setTaxYear);

  const [pendingTaxYear, setPendingTaxYear] = React.useState<TaxYear | null>(
    null,
  );

  const handleChange = React.useCallback(
    (value: string) => {
      const newTaxYear = Number(value);
      if (!isTaxYear(newTaxYear) || newTaxYear === taxYear) {
        return;
      }
      if (hasForms) {
        setPendingTaxYear(newTaxYear);
      } else {
        setTaxYear(newTaxYear);
      }
    },
    [hasForms, setTaxYear, taxYear],
  );

  return (
    <>
      <SelectField
        label="Tax year"
        value={String(taxYear)}
        onChange={handleChange}
      >
        {TAX_YEARS_NEWEST_FIRST.map((value) => (
          <SelectFieldItem
            key={value}
            id={String(value)}
            textValue={String(value)}
          >
            {value}
          </SelectFieldItem>
        ))}
      </SelectField>
      <Modal
        isOpen={pendingTaxYear !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPendingTaxYear(null);
          }
        }}
      >
        <Dialog role="alertdialog">
          <Heading slot="title">{`Switch to tax year ${pendingTaxYear}?`}</Heading>
          <Text slot="description">
            {`If any tax forms have different inputs between ${taxYear} and ${pendingTaxYear}, the data you entered for those inputs in ${taxYear} might not be present in ${pendingTaxYear}.`}
          </Text>
          <DialogFooter>
            <AriaButton onPress={() => setPendingTaxYear(null)}>
              Cancel
            </AriaButton>
            <AriaButton
              variant="primary"
              onPress={() => {
                if (pendingTaxYear !== null) {
                  setTaxYear(pendingTaxYear);
                }
                setPendingTaxYear(null);
              }}
            >
              {`Switch to ${pendingTaxYear}`}
            </AriaButton>
          </DialogFooter>
        </Dialog>
      </Modal>
    </>
  );
}

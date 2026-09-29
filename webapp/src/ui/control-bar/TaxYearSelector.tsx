import React from "react";

import { TAX_YEARS } from "@thumbtax/common";
import { CheckIcon } from "lucide-react";
import {
  Collection,
  Dialog,
  Heading,
  Label,
  Menu,
  MenuItem,
  type MenuItemProps,
  MenuTrigger,
  Modal,
  Popover,
  Text,
} from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { DialogFooter } from "#src/ui/primitives/DialogFooter";
import { SelectorButton } from "#src/ui/primitives/SelectField";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/control-bar/TaxYearSelector.module.css";

import type { TaxYear } from "@thumbtax/common";

const TAX_YEARS_NEWEST_FIRST = TAX_YEARS.toSorted((a, b) => b - a);

type TaxYearOption = MenuItemProps & { id: TaxYear };

export function TaxYearSelector() {
  const taxYear = useStore((state) => state.applicationState.taxYear);
  const hasForms = useStore(
    (state) => state.applicationState.formClasses.length > 0,
  );
  const setTaxYear = useStore((state) => state.setTaxYear);

  const [pendingTaxYear, setPendingTaxYear] = React.useState<TaxYear | null>(
    null,
  );

  const options = React.useMemo(() => {
    return TAX_YEARS_NEWEST_FIRST.map<TaxYearOption>((value) => ({
      id: value,
      "aria-label": `Set tax year to ${value}`,
      onAction: () => {
        if (value === taxYear) {
          return;
        }
        if (hasForms) {
          setPendingTaxYear(value);
        } else {
          setTaxYear(value);
        }
      },
      className: racn(styles.optionItem),
      children: ({ isSelected }) => (
        <>
          {isSelected && <CheckIcon aria-hidden="true" />}
          {value}
        </>
      ),
    }));
  }, [hasForms, setTaxYear, taxYear]);

  const OptionItem = React.useCallback(
    (props: TaxYearOption) => <MenuItem {...props} />,
    [],
  );

  const selectedKeys = React.useMemo(() => [taxYear], [taxYear]);

  return (
    <>
      <MenuTrigger>
        <Label className={styles.label}>
          Tax year
          <SelectorButton className={styles.button}>{taxYear}</SelectorButton>
        </Label>
        <Popover>
          <Menu
            disallowEmptySelection
            selectedKeys={selectedKeys}
            selectionMode="single"
          >
            <Collection items={options}>{OptionItem}</Collection>
          </Menu>
        </Popover>
      </MenuTrigger>
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
            {`Some inputs may not apply to ${pendingTaxYear}. Those inputs will be hidden and won't be saved. Switching back to ${taxYear} before you leave or reload the page will restore them.`}
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

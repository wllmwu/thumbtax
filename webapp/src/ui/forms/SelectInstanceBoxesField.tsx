import React from "react";

import { CheckIcon } from "lucide-react";
import {
  FieldError,
  type Key,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
} from "react-aria-components";

import { SelectorButton } from "#src/ui/primitives/SelectField";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/forms/SelectInstanceBoxesField.module.css";

import type { SpecificationRegistry, ValueProvider } from "@thumbtax/forms";
import type { BoxAddress } from "#src/common/types/boxAddress";
import type { InstanceRegistry } from "#src/common/types/formInstance";
import type { AccessibleLabelProps } from "#src/ui/types/accessibleLabelProps";

type Props = AccessibleLabelProps & {
  specifications: SpecificationRegistry;
  instanceRegistry: InstanceRegistry;
  boxAddress: BoxAddress;
  valueProvider: Extract<
    ValueProvider,
    { type: "select_instance_boxes_input" }
  >;
  errorMessage?: React.ReactNode;
  selectedAddresses: BoxAddress[];
  onChange: (newAddresses: BoxAddress[]) => void;
};

type OptionItem = {
  id: string;
  formTitle: string;
  instanceLabel: string;
  address: BoxAddress;
  isSelected: boolean;
};

function makeOptionItemId(boxAddress: BoxAddress, optionAddress: BoxAddress) {
  return `${boxAddress.instance}_${boxAddress.box}_option_${optionAddress.instance}_${optionAddress.box}`;
}

export function SelectInstanceBoxesField({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  specifications,
  instanceRegistry,
  boxAddress,
  valueProvider,
  errorMessage,
  selectedAddresses,
  onChange,
}: Props) {
  const selectedKeys = React.useMemo(
    () =>
      selectedAddresses.map((address) => makeOptionItemId(boxAddress, address)),
    [boxAddress, selectedAddresses],
  );

  const options = React.useMemo<OptionItem[]>(() => {
    return valueProvider.options.flatMap((option) => {
      const instances = instanceRegistry[option.form];
      if (!instances) {
        return [];
      }
      return instances.map((optionInstance) => {
        const optionAddress: BoxAddress = {
          instance: optionInstance.id,
          box: option.box,
        };
        const optionId = makeOptionItemId(boxAddress, optionAddress);
        return {
          id: optionId,
          formTitle: specifications[option.form].title,
          instanceLabel: optionInstance.label,
          address: optionAddress,
          isSelected: selectedKeys.includes(optionId),
        };
      });
    });
  }, [
    boxAddress,
    instanceRegistry,
    selectedKeys,
    specifications,
    valueProvider.options,
  ]);

  const renderOptionItem = React.useCallback(
    ({
      id,
      formTitle,
      instanceLabel,
      address: { box },
      isSelected,
    }: OptionItem) => (
      <ListBoxItem id={id} className={racn(styles.optionItem)}>
        {isSelected && <CheckIcon />}
        {`${formTitle} (${instanceLabel}) ${box}`}
      </ListBoxItem>
    ),
    [],
  );

  const handleChange = React.useCallback(
    (newSelectedKeys: Key[]) => {
      const newSelectedAddresses = newSelectedKeys
        .map((key) => options.find(({ id }) => id === key)?.address)
        .filter((a) => a !== undefined);
      onChange(newSelectedAddresses);
    },
    [onChange, options],
  );

  return (
    <Select
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      selectionMode="multiple"
      isInvalid={!!errorMessage}
      value={selectedKeys}
      onChange={handleChange}
    >
      <SelectorButton>{`${selectedKeys.length} of ${options.length} selected`}</SelectorButton>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      <Popover>
        <ListBox items={options}>{renderOptionItem}</ListBox>
      </Popover>
    </Select>
  );
}

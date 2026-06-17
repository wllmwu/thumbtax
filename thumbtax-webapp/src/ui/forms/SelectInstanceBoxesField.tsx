import React from "react";

import {
  Button,
  FieldError,
  type Key,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
} from "react-aria-components";

import type { BoxAddress } from "#src/common/types/boxAddress";
import type { InstanceRegistry } from "#src/common/types/formInstance";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";
import type { ValueProvider } from "#src/specifications/types/valueProvider";
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
        return {
          id: makeOptionItemId(boxAddress, optionAddress),
          formTitle: specifications[option.form].title,
          instanceLabel: optionInstance.label,
          address: optionAddress,
        };
      });
    });
  }, [boxAddress, instanceRegistry, specifications, valueProvider.options]);

  const renderOptionItem = React.useCallback(
    ({ id, formTitle, instanceLabel, address: { box } }: OptionItem) => (
      <ListBoxItem
        id={id}
      >{`${formTitle} (${instanceLabel}) ${box}`}</ListBoxItem>
    ),
    [],
  );

  const selectedKeys = React.useMemo(
    () =>
      selectedAddresses.map((address) => makeOptionItemId(boxAddress, address)),
    [boxAddress, selectedAddresses],
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
      <Button>{`${selectedKeys.length} form(s) selected`}</Button>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      <Popover>
        <ListBox items={options}>{renderOptionItem}</ListBox>
      </Popover>
    </Select>
  );
}

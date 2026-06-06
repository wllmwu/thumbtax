import React from "react";

import {
  Button,
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

type Props = {
  specifications: SpecificationRegistry;
  instanceRegistry: InstanceRegistry;
  boxAddress: BoxAddress;
  valueProvider: Extract<
    ValueProvider,
    { type: "select_instance_boxes_input" }
  >;
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
  specifications,
  instanceRegistry,
  boxAddress,
  valueProvider,
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
      selectionMode="multiple"
      value={selectedKeys}
      onChange={handleChange}
    >
      <Button>{`${selectedKeys.length} form(s) selected`}</Button>
      <Popover>
        <ListBox items={options}>{renderOptionItem}</ListBox>
      </Popover>
    </Select>
  );
}

import React from "react";

import { produce } from "immer";
import { Button, Group } from "react-aria-components";

import { NumberField } from "#src/ui/primitives/NumberField";
import { TextField } from "#src/ui/primitives/TextField";

import type { UserInput } from "#src/common/types/userInput";

type AmountList = Extract<UserInput, { type: "amount_list" }>["value"];

type Props = {
  list: AmountList;
  onChange: (list: AmountList) => void;
};

export function AmountListInput({ list, onChange }: Props) {
  const onChangeLabel = React.useCallback(
    (index: number, newLabel: string) => {
      onChange(
        produce(list, (draft) => {
          draft[index].label = newLabel;
        }),
      );
    },
    [list, onChange],
  );

  const onChangeAmount = React.useCallback(
    (index: number, newAmount: number) => {
      onChange(
        produce(list, (draft) => {
          draft[index].amount = newAmount;
        }),
      );
    },
    [list, onChange],
  );

  const onAddEntry = React.useCallback(() => {
    onChange(
      produce(list, (draft) => {
        draft.push({ label: "", amount: 0 });
      }),
    );
  }, [list, onChange]);

  const onRemoveEntry = React.useCallback(
    (index: number) => {
      onChange(
        produce(list, (draft) => {
          draft.splice(index, 1);
        }),
      );
    },
    [list, onChange],
  );

  return (
    <Group>
      {list.map(({ label, amount }, index) => (
        <div key={index}>
          <TextField
            value={label}
            onChange={(newLabel) => onChangeLabel(index, newLabel)}
          />
          <NumberField
            value={amount}
            onChange={(newAmount) => onChangeAmount(index, newAmount)}
          />
          <Button onPress={() => onRemoveEntry(index)}>Remove</Button>
        </div>
      ))}
      <Button onPress={onAddEntry}>Add</Button>
    </Group>
  );
}

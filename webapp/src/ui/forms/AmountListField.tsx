import React from "react";

import { produce } from "immer";
import { Trash2Icon } from "lucide-react";
import { FieldError, FieldErrorContext, Group } from "react-aria-components";

import { AriaButton } from "#src/ui/primitives/AriaButton";
import { NumberField } from "#src/ui/primitives/NumberField";
import { TextField } from "#src/ui/primitives/TextField";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/forms/AmountListField.module.css";

import type { UserInput } from "#src/common/types/userInput";
import type { AccessibleLabelProps } from "#src/ui/types/accessibleLabelProps";

type AmountList = Extract<UserInput, { type: "amount_list" }>["value"];

const INVALID_VALIDITY_STATE: ValidityState = {
  badInput: false,
  customError: true,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valueMissing: false,
  valid: false,
};

type Props = AccessibleLabelProps & {
  errorMessage?: React.ReactNode;
  list: AmountList;
  onChange: (list: AmountList) => void;
};

export function AmountListField({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  errorMessage,
  list,
  onChange,
}: Props) {
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

  const errorMessageId = React.useId();

  const describedBy = React.useMemo(() => {
    const describedByIds = [
      ariaDescribedBy,
      errorMessage ? errorMessageId : undefined,
    ].filter((id): id is string => id !== undefined);
    return describedByIds.length > 0 ? describedByIds.join(" ") : undefined;
  }, [ariaDescribedBy, errorMessage, errorMessageId]);

  const validation = React.useMemo(() => {
    return errorMessage
      ? {
          isInvalid: true,
          validationErrors: [],
          validationDetails: INVALID_VALIDITY_STATE,
        }
      : null;
  }, [errorMessage]);

  return (
    <FieldErrorContext.Provider value={validation}>
      <Group
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
        className={racn(styles.group)}
        isInvalid={!!errorMessage}
      >
        {list.map(({ label, amount }, index) => (
          <div key={index} className={styles.entry}>
            <TextField
              aria-label="Label"
              onChange={(newLabel) => onChangeLabel(index, newLabel)}
              placeholder="My label"
              value={label}
            />
            <NumberField
              aria-label="Amount"
              format="financial"
              onChange={(newAmount) => onChangeAmount(index, newAmount)}
              value={amount}
            />
            <AriaButton
              aria-label="Delete entry"
              onPress={() => onRemoveEntry(index)}
            >
              <Trash2Icon />
            </AriaButton>
          </div>
        ))}
        <AriaButton onPress={onAddEntry}>Add</AriaButton>
      </Group>
      <FieldError id={errorMessageId}>{errorMessage}</FieldError>
    </FieldErrorContext.Provider>
  );
}

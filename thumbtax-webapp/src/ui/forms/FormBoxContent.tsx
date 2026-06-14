import React from "react";

import { noop } from "lodash";

import { absurd } from "#src/common/utils/absurd";
import { useStore } from "#src/state/useStore";
import { useFormatBoxValue } from "#src/ui/formatting/useFormatBoxValue";
import { AmountListField } from "#src/ui/forms/AmountListField";
import { SelectInstanceBoxesField } from "#src/ui/forms/SelectInstanceBoxesField";
import { CheckboxField } from "#src/ui/primitives/CheckboxField";
import { NumberField } from "#src/ui/primitives/NumberField";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";
import { TextField } from "#src/ui/primitives/TextField";

import type { BoxFormat } from "#src/common/types/boxFormat";
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormBox } from "#src/specifications/types/formSpecification";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

type Props = {
  instance: FormInstance;
  box: FormBox<boolean>;
};

type InputBoxProps = {
  boxIdentifier: BoxIdentifier;
  format?: BoxFormat;
  inputLabel: string;
  instance: FormInstance;
};

function CheckboxInputBox({
  boxIdentifier,
  errorMessage,
  inputLabel,
  instance,
}: InputBoxProps & { errorMessage: React.ReactNode }) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const value = input?.type === "number" && input.value !== 0;

  return (
    <CheckboxField
      aria-label={inputLabel}
      errorMessage={errorMessage}
      value={value}
      onChange={(newValue) =>
        setBoxInput(instance.class, instance.id, boxIdentifier, {
          type: "number",
          value: newValue ? 1 : 0,
        })
      }
    />
  );
}

function ListAmountsInputBox({
  boxIdentifier,
  inputLabel,
  instance,
}: InputBoxProps) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const list = input?.type === "amount_list" ? input.value : [];

  return (
    <AmountListField
      aria-label={inputLabel}
      list={list}
      onChange={(newList) =>
        setBoxInput(instance.class, instance.id, boxIdentifier, {
          type: "amount_list",
          value: newList,
        })
      }
    />
  );
}

function NumberInputBox({
  boxIdentifier,
  errorMessage,
  format,
  inputLabel,
  instance,
  skipped,
}: InputBoxProps & {
  errorMessage: React.ReactNode;
  skipped?: boolean;
}) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const value = input?.type === "number" ? input.value : 0;

  return (
    <NumberField
      aria-label={inputLabel}
      disabled={skipped}
      errorMessage={errorMessage}
      format={format ?? "financial"}
      value={value}
      onChange={(newValue) =>
        setBoxInput(instance.class, instance.id, boxIdentifier, {
          type: "number",
          value: newValue,
        })
      }
    />
  );
}

function OverrideNumberInputBox({
  boxIdentifier,
  errorMessage,
  format,
  formattedValue,
  inputLabel,
  instance,
  value,
}: InputBoxProps & {
  errorMessage: React.ReactNode;
  formattedValue: string;
  value: number;
}) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const isOverridden =
    input?.type === "override" ? input.override !== null : false;

  return (
    <div>
      <CheckboxField
        label={`Override box ${boxIdentifier}`}
        value={isOverridden}
        onChange={(newIsOverridden) =>
          setBoxInput(instance.class, instance.id, boxIdentifier, {
            type: "override",
            override: newIsOverridden ? value : null,
          })
        }
      />
      {isOverridden ? (
        <NumberField
          aria-label={inputLabel}
          errorMessage={errorMessage}
          format={format ?? "financial"}
          value={value}
          onChange={(newValue) =>
            setBoxInput(instance.class, instance.id, boxIdentifier, {
              type: "override",
              override: newValue,
            })
          }
        />
      ) : (
        <TextField
          aria-label={inputLabel}
          readOnly
          errorMessage={errorMessage}
          value={formattedValue}
          onChange={noop}
        />
      )}
    </div>
  );
}

function SelectInstanceBoxesInputBox({
  boxIdentifier,
  boxValue,
  inputLabel,
  instance,
}: InputBoxProps & {
  boxValue: Extract<ValueProvider, { type: "select_instance_boxes_input" }>;
}) {
  const specifications = useStore((state) => state.specifications);
  const instanceRegistry = useStore(
    (state) => state.applicationState.formInstances,
  );
  const setBoxInput = useStore((state) => state.setBoxInput);

  if (!specifications) {
    return null;
  }

  const input = instance.inputs[boxIdentifier];
  const selectedAddresses =
    input?.type === "instance_box_selections" ? input.selected : [];

  return (
    <SelectInstanceBoxesField
      aria-label={inputLabel}
      specifications={specifications}
      instanceRegistry={instanceRegistry}
      boxAddress={{ instance: instance.id, box: boxIdentifier }}
      valueProvider={boxValue}
      selectedAddresses={selectedAddresses}
      onChange={(newSelectedAddresses) =>
        setBoxInput(instance.class, instance.id, boxIdentifier, {
          type: "instance_box_selections",
          selected: newSelectedAddresses,
        })
      }
    />
  );
}

function SelectValueInputBox({
  boxIdentifier,
  boxValue,
  errorMessage,
  inputLabel,
  instance,
}: InputBoxProps & {
  boxValue: Extract<ValueProvider, { type: "select_value_input" }>;
  errorMessage: React.ReactNode;
}) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const selectedIndex = input?.type === "selection" ? input.selectedIndex : 0;
  const options = boxValue.options.map(({ label }, index) => ({
    id: `${instance.id}-${boxIdentifier}-option-${index}`,
    label,
  }));
  const selectedId = options[selectedIndex].id;

  return (
    <SelectField
      aria-label={inputLabel}
      errorMessage={errorMessage}
      value={selectedId}
      onChange={(newSelectedId) => {
        for (const [index, option] of options.entries()) {
          if (option.id === newSelectedId) {
            setBoxInput(instance.class, instance.id, boxIdentifier, {
              type: "selection",
              selectedIndex: index,
            });
          }
        }
      }}
    >
      {options.map(({ id, label }) => (
        <SelectFieldItem key={id} id={id}>
          {label}
        </SelectFieldItem>
      ))}
    </SelectField>
  );
}

export function FormBoxContent({ instance, box }: Props) {
  const resolvedBox = useStore(
    (state) => state.workbook[instance.id][box.identifier],
  );
  const specifications = useStore((state) => state.specifications);

  const formatBoxValue = useFormatBoxValue({
    format: box.format ?? "financial",
  });
  const formattedValue = React.useMemo(
    () => formatBoxValue(resolvedBox.value),
    [formatBoxValue, resolvedBox.value],
  );

  const errorMessage = React.useMemo<React.ReactNode>(() => {
    if (resolvedBox.errors.length === 0) {
      return null;
    }
    const firstError = resolvedBox.errors[0];
    const errorType = firstError.type;
    switch (errorType) {
      case "divide_by_zero":
        return "Divide by zero error";
      case "required_form_missing": {
        const formTitle =
          specifications?.[firstError.form]?.title ?? firstError.form;
        return `Requires ${formTitle}`;
      }
      case "upstream":
        return null;
      default:
        absurd(errorType);
    }
  }, [resolvedBox.errors, specifications]);

  if (!specifications) {
    return null;
  }

  const inputLabel = `${specifications[instance.class].title} (${instance.label}) box ${box.identifier}`;

  const valueType = box.value.type;
  switch (valueType) {
    case "checkbox_input":
      return (
        <CheckboxInputBox
          boxIdentifier={box.identifier}
          inputLabel={inputLabel}
          instance={instance}
          errorMessage={errorMessage}
        />
      );
    case "list_amounts_input":
      return (
        <ListAmountsInputBox
          boxIdentifier={box.identifier}
          inputLabel={inputLabel}
          instance={instance}
        />
      );
    case "number_input":
      return (
        <NumberInputBox
          boxIdentifier={box.identifier}
          errorMessage={errorMessage}
          format={box.format}
          inputLabel={inputLabel}
          instance={instance}
          skipped={resolvedBox.skipped}
        />
      );
    case "override_number_input":
      return (
        <OverrideNumberInputBox
          boxIdentifier={box.identifier}
          errorMessage={errorMessage}
          format={box.format}
          formattedValue={formattedValue}
          inputLabel={inputLabel}
          instance={instance}
          value={resolvedBox.value}
        />
      );
    case "select_instance_boxes_input":
      return (
        <SelectInstanceBoxesInputBox
          boxIdentifier={box.identifier}
          boxValue={box.value}
          inputLabel={inputLabel}
          instance={instance}
        />
      );
    case "select_value_input":
      return (
        <SelectValueInputBox
          boxIdentifier={box.identifier}
          boxValue={box.value}
          errorMessage={errorMessage}
          instance={instance}
          inputLabel={inputLabel}
        />
      );
    case "absolute_value":
    case "box_reference":
    case "comparison":
    case "conditional":
    case "conjunction":
    case "disjunction":
    case "difference":
    case "filing_status_map":
    case "form_instance_count":
    case "logical_negation":
    case "maximum":
    case "minimum":
    case "non_negative_clamp":
    case "non_positive_clamp":
    case "number_constant":
    case "numerical_negation":
    case "piecewise_function":
    case "product":
    case "quotient":
    case "sum":
      return (
        <TextField
          aria-label={inputLabel}
          readOnly
          errorMessage={errorMessage}
          value={formattedValue}
          onChange={noop}
        />
      );
    case "unsupported":
    case "unused":
      return null;
    default:
      absurd(valueType);
  }
}

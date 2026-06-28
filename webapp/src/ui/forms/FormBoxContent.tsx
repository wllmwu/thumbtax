import React from "react";

import { absurd } from "@thumbtax/common";
import { noop } from "lodash";

import { useStore } from "#src/state/useStore";
import { useFormatBoxValue } from "#src/ui/formatting/useFormatBoxValue";
import { AmountListField } from "#src/ui/forms/AmountListField";
import { SelectInstanceBoxesField } from "#src/ui/forms/SelectInstanceBoxesField";
import { CheckboxField } from "#src/ui/primitives/CheckboxField";
import { NumberField } from "#src/ui/primitives/NumberField";
import { RadioGroup, type RadioOption } from "#src/ui/primitives/RadioGroup";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";
import { TextField } from "#src/ui/primitives/TextField";

import type { BoxFormat, BoxIdentifier } from "@thumbtax/common";
import type { FormBox, ValueProvider } from "@thumbtax/forms";
import type { BoxAddress } from "#src/common/types/boxAddress";
import type { FormInstance } from "#src/common/types/formInstance";
import type { Key } from "react-aria-components";

type Props = {
  instance: FormInstance;
  box: FormBox<boolean>;
  "aria-labelledby": string;
  "aria-describedby": string;
};

const YES_NO_RADIO_OPTIONS: Array<RadioOption<"yes" | "no">> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

function ValueDisplay({
  boxFormat,
  errorMessage,
  ariaLabelledBy,
  ariaDescribedBy,
  resolvedValue,
}: {
  boxFormat: BoxFormat;
  errorMessage: React.ReactNode;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  resolvedValue: number;
}) {
  const formatBoxValue = useFormatBoxValue({
    format: boxFormat,
  });
  const formattedValue = React.useMemo(
    () => formatBoxValue(resolvedValue),
    [formatBoxValue, resolvedValue],
  );

  switch (boxFormat) {
    case "checkbox":
      return (
        <CheckboxField
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          readOnly
          value={resolvedValue !== 0}
          onChange={noop}
        />
      );
    case "financial":
    case "percentage":
    case "plain":
      return (
        <TextField
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          readOnly
          errorMessage={errorMessage}
          value={formattedValue}
          onChange={noop}
        />
      );
    case "yes_no":
      return (
        <RadioGroup
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          readOnly
          errorMessage={errorMessage}
          value={resolvedValue === 0 ? "no" : "yes"}
          onChange={noop}
          options={YES_NO_RADIO_OPTIONS}
        />
      );
    default:
      absurd(boxFormat);
  }
}

type InputBoxProps = {
  boxIdentifier: BoxIdentifier;
  errorMessage: React.ReactNode;
  ariaLabelledBy: string;
  ariaDescribedBy: string;
  instance: FormInstance;
};

function CheckboxInputBox({
  boxFormat,
  boxIdentifier,
  errorMessage,
  ariaLabelledBy,
  ariaDescribedBy,
  instance,
}: InputBoxProps & {
  boxFormat: BoxFormat;
}) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const value = input?.type === "number" && input.value !== 0;

  const onChange = React.useCallback(
    (newValue: boolean | "yes" | "no") =>
      setBoxInput(instance.class, instance.id, boxIdentifier, {
        type: "number",
        value: newValue === true || newValue === "yes" ? 1 : 0,
      }),
    [boxIdentifier, instance.class, instance.id, setBoxInput],
  );

  return boxFormat === "yes_no" ? (
    <RadioGroup
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      readOnly
      errorMessage={errorMessage}
      value={value ? "yes" : "no"}
      onChange={onChange}
      options={YES_NO_RADIO_OPTIONS}
    />
  ) : (
    <CheckboxField
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      errorMessage={errorMessage}
      value={value}
      onChange={onChange}
    />
  );
}

function ListAmountsInputBox({
  boxIdentifier,
  errorMessage,
  ariaLabelledBy,
  ariaDescribedBy,
  instance,
}: InputBoxProps) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const list = input?.type === "amount_list" ? input.value : [];

  const onChange = React.useCallback(
    (newList: Array<{ label: string; amount: number }>) =>
      setBoxInput(instance.class, instance.id, boxIdentifier, {
        type: "amount_list",
        value: newList,
      }),
    [boxIdentifier, instance.class, instance.id, setBoxInput],
  );

  return (
    <AmountListField
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      errorMessage={errorMessage}
      list={list}
      onChange={onChange}
    />
  );
}

function NumberInputBox({
  boxFormat,
  boxIdentifier,
  errorMessage,
  ariaLabelledBy,
  ariaDescribedBy,
  instance,
  skipped,
}: InputBoxProps & {
  boxFormat: BoxFormat;
  skipped?: boolean;
}) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const value = input?.type === "number" ? input.value : 0;

  const onChange = React.useCallback(
    (newValue: number) =>
      setBoxInput(instance.class, instance.id, boxIdentifier, {
        type: "number",
        value: newValue,
      }),
    [boxIdentifier, instance.class, instance.id, setBoxInput],
  );

  return (
    <NumberField
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      disabled={skipped}
      errorMessage={errorMessage}
      format={boxFormat}
      value={value}
      onChange={onChange}
    />
  );
}

function OverrideNumberInputBox({
  boxFormat,
  boxIdentifier,
  errorMessage,
  ariaLabelledBy,
  ariaDescribedBy,
  instance,
  value,
}: InputBoxProps & {
  boxFormat: BoxFormat;
  value: number;
}) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const isOverridden =
    input?.type === "override" ? input.override !== null : false;

  const onChangeIsOverridden = React.useCallback(
    (newIsOverridden: boolean) =>
      setBoxInput(instance.class, instance.id, boxIdentifier, {
        type: "override",
        override: newIsOverridden ? value : null,
      }),
    [boxIdentifier, instance.class, instance.id, setBoxInput, value],
  );

  const onChangeOverrideValue = React.useCallback(
    (newValue: number) =>
      setBoxInput(instance.class, instance.id, boxIdentifier, {
        type: "override",
        override: newValue,
      }),
    [boxIdentifier, instance.class, instance.id, setBoxInput],
  );

  const overrideLabelId = React.useId();

  return (
    <div>
      <CheckboxField
        label={<span id={overrideLabelId}>Override</span>}
        aria-labelledby={`${overrideLabelId} ${ariaLabelledBy}`}
        value={isOverridden}
        onChange={onChangeIsOverridden}
      />
      {isOverridden ? (
        <NumberField
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          errorMessage={errorMessage}
          format={boxFormat}
          value={value}
          onChange={onChangeOverrideValue}
        />
      ) : (
        <ValueDisplay
          boxFormat={boxFormat}
          errorMessage={errorMessage}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          resolvedValue={value}
        />
      )}
    </div>
  );
}

function SelectInstanceBoxesInputBox({
  boxIdentifier,
  boxValue,
  errorMessage,
  ariaLabelledBy,
  ariaDescribedBy,
  instance,
}: InputBoxProps & {
  boxValue: Extract<ValueProvider, { type: "select_instance_boxes_input" }>;
}) {
  const specifications = useStore((state) => state.specifications);
  const instanceRegistry = useStore(
    (state) => state.applicationState.formInstances,
  );
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const selectedAddresses =
    input?.type === "instance_box_selections" ? input.selected : [];

  const onChange = React.useCallback(
    (newSelectedAddresses: BoxAddress[]) =>
      setBoxInput(instance.class, instance.id, boxIdentifier, {
        type: "instance_box_selections",
        selected: newSelectedAddresses,
      }),
    [boxIdentifier, instance.class, instance.id, setBoxInput],
  );

  if (!specifications) {
    return null;
  }

  return (
    <SelectInstanceBoxesField
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      errorMessage={errorMessage}
      specifications={specifications}
      instanceRegistry={instanceRegistry}
      boxAddress={{ instance: instance.id, box: boxIdentifier }}
      valueProvider={boxValue}
      selectedAddresses={selectedAddresses}
      onChange={onChange}
    />
  );
}

function SelectValueInputBox({
  boxIdentifier,
  boxValue,
  errorMessage,
  ariaLabelledBy,
  ariaDescribedBy,
  instance,
}: InputBoxProps & {
  boxValue: Extract<ValueProvider, { type: "select_value_input" }>;
}) {
  const setBoxInput = useStore((state) => state.setBoxInput);

  const input = instance.inputs[boxIdentifier];
  const selectedIndex = input?.type === "selection" ? input.selectedIndex : 0;
  const options = boxValue.options.map(({ label }, index) => ({
    id: `${instance.id}-${boxIdentifier}-option-${index}`,
    label,
  }));
  const selectedId = options[selectedIndex].id;

  const onChange = React.useCallback(
    (newSelectedId: Key) => {
      for (const [index, option] of options.entries()) {
        if (option.id === newSelectedId) {
          setBoxInput(instance.class, instance.id, boxIdentifier, {
            type: "selection",
            selectedIndex: index,
          });
        }
      }
    },
    [boxIdentifier, instance.class, instance.id, options, setBoxInput],
  );

  return (
    <SelectField
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      errorMessage={errorMessage}
      value={selectedId}
      onChange={onChange}
    >
      {options.map(({ id, label }) => (
        <SelectFieldItem key={id} id={id}>
          {label}
        </SelectFieldItem>
      ))}
    </SelectField>
  );
}

export function FormBoxContent({
  instance,
  box,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: Props) {
  const resolvedBox = useStore(
    (state) => state.workbook[instance.id][box.identifier],
  );
  const specifications = useStore((state) => state.specifications);

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

  const boxFormat = box.format ?? "financial";

  const valueType = box.value.type;
  switch (valueType) {
    case "checkbox_input":
      return (
        <CheckboxInputBox
          boxFormat={boxFormat}
          boxIdentifier={box.identifier}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          instance={instance}
          errorMessage={errorMessage}
        />
      );
    case "list_amounts_input":
      return (
        <ListAmountsInputBox
          boxIdentifier={box.identifier}
          errorMessage={errorMessage}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          instance={instance}
        />
      );
    case "number_input":
      return (
        <NumberInputBox
          boxFormat={boxFormat}
          boxIdentifier={box.identifier}
          errorMessage={errorMessage}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          instance={instance}
          skipped={resolvedBox.skipped}
        />
      );
    case "override_number_input":
      return (
        <OverrideNumberInputBox
          boxFormat={boxFormat}
          boxIdentifier={box.identifier}
          errorMessage={errorMessage}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          instance={instance}
          value={resolvedBox.value}
        />
      );
    case "select_instance_boxes_input":
      return (
        <SelectInstanceBoxesInputBox
          boxIdentifier={box.identifier}
          boxValue={box.value}
          errorMessage={errorMessage}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          instance={instance}
        />
      );
    case "select_value_input":
      return (
        <SelectValueInputBox
          boxIdentifier={box.identifier}
          boxValue={box.value}
          errorMessage={errorMessage}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          instance={instance}
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
        <ValueDisplay
          boxFormat={boxFormat}
          errorMessage={errorMessage}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          resolvedValue={resolvedBox.value}
        />
      );
    case "unsupported":
    case "unused":
      return null;
    default:
      absurd(valueType);
  }
}

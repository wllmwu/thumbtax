import React from "react";

import { absurd } from "#src/common/utils/absurd";
import { useStore } from "#src/state/useStore";
import { useFormatBoxValue } from "#src/ui/formatting/useFormatBoxValue";
import { AmountListField } from "#src/ui/forms/AmountListField";
import { SelectInstanceBoxesField } from "#src/ui/forms/SelectInstanceBoxesField";
import { CheckboxField } from "#src/ui/primitives/CheckboxField";
import { NumberField } from "#src/ui/primitives/NumberField";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";

import type { FormInstance } from "#src/common/types/formInstance";
import type { FormBox } from "#src/specifications/types/formSpecification";

type Props = {
  instance: FormInstance;
  box: FormBox<boolean>;
};

export function FormBoxContent({ instance, box }: Props) {
  const resolvedBox = useStore(
    (state) => state.workbook[instance.id][box.identifier],
  );
  const specifications = useStore((state) => state.specifications);
  const instanceRegistry = useStore(
    (state) => state.applicationState.formInstances,
  );
  const setBoxInput = useStore((state) => state.setBoxInput);

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
    case "checkbox_input": {
      const input = instance.inputs[box.identifier];
      const value = input?.type === "number" && input.value !== 0;
      return (
        <CheckboxField
          aria-label={inputLabel}
          errorMessage={errorMessage}
          value={value}
          onChange={(newValue) =>
            setBoxInput(instance.class, instance.id, box.identifier, {
              type: "number",
              value: newValue ? 1 : 0,
            })
          }
        />
      );
    }
    case "list_amounts_input": {
      const input = instance.inputs[box.identifier];
      const list = input?.type === "amount_list" ? input.value : [];
      return (
        <AmountListField
          aria-label={inputLabel}
          list={list}
          onChange={(newList) =>
            setBoxInput(instance.class, instance.id, box.identifier, {
              type: "amount_list",
              value: newList,
            })
          }
        />
      );
    }
    case "number_input": {
      const input = instance.inputs[box.identifier];
      const value = input?.type === "number" ? input.value : 0;
      return (
        <NumberField
          aria-label={inputLabel}
          disabled={resolvedBox.skipped}
          errorMessage={errorMessage}
          format={box.format ?? "financial"}
          value={value}
          onChange={(newValue) =>
            setBoxInput(instance.class, instance.id, box.identifier, {
              type: "number",
              value: newValue,
            })
          }
        />
      );
    }
    case "override_number_input": {
      const input = instance.inputs[box.identifier];
      const isOverridden =
        input?.type === "override" ? input.override !== null : false;
      const value = resolvedBox.value;
      return (
        <div>
          <CheckboxField
            label={`Override box ${box.identifier}`}
            value={isOverridden}
            onChange={(newIsOverridden) =>
              setBoxInput(instance.class, instance.id, box.identifier, {
                type: "override",
                override: newIsOverridden ? value : null,
              })
            }
          />
          {isOverridden ? (
            <NumberField
              aria-label={inputLabel}
              errorMessage={errorMessage}
              format={box.format ?? "financial"}
              value={value}
              onChange={(newValue) =>
                setBoxInput(instance.class, instance.id, box.identifier, {
                  type: "override",
                  override: newValue,
                })
              }
            />
          ) : (
            <>
              <span>{value}</span>
              {errorMessage && <span>{errorMessage}</span>}
            </>
          )}
        </div>
      );
    }
    case "select_instance_boxes_input": {
      const input = instance.inputs[box.identifier];
      const selectedAddresses =
        input?.type === "instance_box_selections" ? input.selected : [];
      return (
        <SelectInstanceBoxesField
          aria-label={inputLabel}
          specifications={specifications}
          instanceRegistry={instanceRegistry}
          boxAddress={{ instance: instance.id, box: box.identifier }}
          valueProvider={box.value}
          selectedAddresses={selectedAddresses}
          onChange={(newSelectedAddresses) =>
            setBoxInput(instance.class, instance.id, box.identifier, {
              type: "instance_box_selections",
              selected: newSelectedAddresses,
            })
          }
        />
      );
    }
    case "select_value_input": {
      const input = instance.inputs[box.identifier];
      const selectedIndex =
        input?.type === "selection" ? input.selectedIndex : 0;
      const options = box.value.options.map(({ label }, index) => ({
        id: `${instance.id}-${box.identifier}-option-${index}`,
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
                setBoxInput(instance.class, instance.id, box.identifier, {
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
        <>
          <span>{formattedValue}</span>
          {errorMessage && <span>{errorMessage}</span>}
        </>
      );
    case "unsupported":
    case "unused":
      return null;
    default:
      absurd(valueType);
  }
}

import { absurd } from "#src/common/utils/absurd";
import { useStore } from "#src/state/useStore";
import { AmountListInput } from "#src/ui/forms/AmountListInput";
import { CheckboxInput } from "#src/ui/primitives/CheckboxInput";
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
  const setBoxInput = useStore((state) => state.setBoxInput);

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
        <CheckboxInput
          aria-label={inputLabel}
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
        <AmountListInput
          formTitle={specifications[instance.class].title}
          instanceLabel={instance.label}
          boxIdentifier={box.identifier}
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
          <CheckboxInput
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
              value={value}
              onChange={(newValue) =>
                setBoxInput(instance.class, instance.id, box.identifier, {
                  type: "override",
                  override: newValue,
                })
              }
            />
          ) : (
            <span>{value}</span>
          )}
        </div>
      );
    }
    case "selection_input": {
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
    case "difference":
    case "filing_status_map":
    case "form_instance_count":
    case "logical_negation":
    case "maximum":
    case "minimum":
    case "non_negative_clamp":
    case "number_constant":
    case "numerical_negation":
    case "piecewise_function":
    case "product":
    case "quotient":
    case "sum":
      return resolvedBox.value;
    case "unsupported":
    case "unused":
      return null;
    default:
      absurd(valueType);
  }
}

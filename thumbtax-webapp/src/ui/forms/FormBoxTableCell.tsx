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

export function FormBoxTableCell({ instance, box }: Props) {
  const resolvedBox = useStore(
    (state) => state.workbook[instance.id][box.identifier],
  );
  const setBoxInput = useStore((state) => state.setBoxInput);

  const valueType = box.value.type;
  switch (valueType) {
    case "checkbox_input": {
      const input = instance.inputs[box.identifier];
      const value = input?.type === "number" && input.value !== 0;
      return (
        <td>
          <CheckboxInput
            value={value}
            onChange={(newValue) =>
              setBoxInput(instance.class, instance.id, box.identifier, {
                type: "number",
                value: newValue ? 1 : 0,
              })
            }
          />
        </td>
      );
    }
    case "list_amounts_input": {
      const input = instance.inputs[box.identifier];
      const list = input?.type === "amount_list" ? input.value : [];
      return (
        <td>
          <AmountListInput
            list={list}
            onChange={(newList) =>
              setBoxInput(instance.class, instance.id, box.identifier, {
                type: "amount_list",
                value: newList,
              })
            }
          />
        </td>
      );
    }
    case "number_input": {
      const input = instance.inputs[box.identifier];
      const value = input?.type === "number" ? input.value : 0;
      return (
        <td>
          <NumberField
            value={value}
            onChange={(newValue) =>
              setBoxInput(instance.class, instance.id, box.identifier, {
                type: "number",
                value: newValue,
              })
            }
          />
        </td>
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
        <td>
          <SelectField
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
        </td>
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
    case "non_negative":
    case "number_constant":
    case "numerical_negation":
    case "product":
    case "quotient":
    case "sum":
    case "unsupported":
    case "unused":
      return <td>{resolvedBox.value}</td>;
    default:
      absurd(valueType);
  }
}

import React from "react";

import { Header } from "react-aria-components";

import { absurd } from "#src/common/utils/absurd";
import { useStore } from "#src/state/useStore";
import {
  ComboBoxField,
  ComboBoxFieldItem,
  ComboBoxFieldSection,
} from "#src/ui/primitives/ComboBoxField";

import type { FormSpecification } from "#src/specifications/types/formSpecification";

type FormOption = {
  id: string;
  disabled: boolean;
} & Pick<FormSpecification, "category" | "class" | "subtitle" | "title">;

export function AddFormControl() {
  const specifications = useStore((state) => state.specifications);
  const instances = useStore((state) => state.applicationState.formInstances);
  const addFormInstance = useStore((state) => state.addFormInstance);

  const [inputValue, setInputValue] = React.useState<string | null>(null);

  const options = React.useMemo<FormOption[]>(() => {
    if (!specifications) {
      return [];
    }
    return Object.values(specifications).map(
      ({ class: formClass, category, title, subtitle, maxInstances }) => {
        const numInstances = instances[formClass]?.length ?? 0;
        return {
          id: formClass,
          disabled: maxInstances !== null && numInstances >= maxInstances,
          category,
          class: formClass,
          subtitle,
          title,
        };
      },
    );
  }, [instances, specifications]);

  const { incomeSection, taxesSection } = React.useMemo(() => {
    return options.reduce<{
      incomeSection: FormOption[];
      taxesSection: FormOption[];
    }>(
      (acc, curr) => {
        const category = curr.category;
        switch (category) {
          case "income":
            acc.incomeSection.push(curr);
            break;
          case "taxes":
            acc.taxesSection.push(curr);
            break;
          default:
            absurd(category);
        }
        return acc;
      },
      { incomeSection: [], taxesSection: [] },
    );
  }, [options]);

  return (
    <ComboBoxField
      label="Add a form"
      placeholder="Select a form"
      value={inputValue}
      onChange={setInputValue}
    >
      <ComboBoxFieldSection>
        <Header>Income reporting</Header>
        {incomeSection.map(
          ({ id, disabled, class: formClass, title, subtitle }) => (
            <ComboBoxFieldItem
              key={id}
              id={id}
              textValue={title}
              isDisabled={disabled}
              onAction={() => addFormInstance(formClass)}
            >
              <span>{title}</span>
              <span>{subtitle}</span>
            </ComboBoxFieldItem>
          ),
        )}
      </ComboBoxFieldSection>
      <ComboBoxFieldSection>
        <Header>Tax return</Header>
        {taxesSection.map(
          ({ id, disabled, class: formClass, title, subtitle }) => (
            <ComboBoxFieldItem
              key={id}
              id={id}
              textValue={title}
              isDisabled={disabled}
              onAction={() => addFormInstance(formClass)}
            >
              <span>{title}</span>
              <span>{subtitle}</span>
            </ComboBoxFieldItem>
          ),
        )}
      </ComboBoxFieldSection>
    </ComboBoxField>
  );
}

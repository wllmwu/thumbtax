import React from "react";

import {
  Autocomplete,
  Button,
  Collection,
  Header,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  useFilter,
} from "react-aria-components";

import { absurd } from "#src/common/utils/absurd";
import { useStore } from "#src/state/useStore";
import { SearchField } from "#src/ui/primitives/SearchField";

import type { FormSpecification } from "#src/specifications/types/formSpecification";

type FormOption = {
  id: string;
  disabled: boolean;
} & Pick<FormSpecification, "category" | "class" | "subtitle" | "title">;

export function AddFormMenu() {
  const specifications = useStore((state) => state.specifications);
  const instances = useStore((state) => state.applicationState.formInstances);
  const addFormInstance = useStore((state) => state.addFormInstance);

  const [searchValue, setSearchValue] = React.useState("");

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

  const OptionItem = React.useCallback(
    ({ id, disabled, class: formClass, title, subtitle }: FormOption) => (
      <MenuItem
        id={id}
        aria-label={`Add ${title}`}
        isDisabled={disabled}
        onAction={() => addFormInstance(formClass)}
      >
        <span>{title}</span>
        <span>{subtitle}</span>
      </MenuItem>
    ),
    [addFormInstance],
  );

  const filter = useFilter({ sensitivity: "base" });

  return (
    <MenuTrigger>
      <Button>Add a form…</Button>
      <Popover>
        <Autocomplete filter={filter.contains}>
          <SearchField
            aria-label="Search forms by title"
            placeholder="w-2"
            value={searchValue}
            onChange={setSearchValue}
          />
          <Menu>
            <MenuSection>
              <Header>Income reporting</Header>
              <Collection items={incomeSection}>{OptionItem}</Collection>
            </MenuSection>
            <MenuSection>
              <Header>Tax return</Header>
              <Collection items={taxesSection}>{OptionItem}</Collection>
            </MenuSection>
          </Menu>
        </Autocomplete>
      </Popover>
    </MenuTrigger>
  );
}

import React from "react";

import { absurd } from "@thumbtax/common";
import {
  Autocomplete,
  Collection,
  Header,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  useFilter,
} from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { SearchField } from "#src/ui/primitives/SearchField";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/control-bar/AddFormMenu.module.css";

import type { FormSpecification } from "@thumbtax/forms";

type FormOption = {
  id: string;
  disabled: boolean;
  instanceCount: number;
} & Pick<
  FormSpecification,
  "category" | "class" | "maxInstances" | "subtitle" | "title"
>;

function formatInstanceCount({
  instanceCount,
  maxInstances,
}: {
  instanceCount: number;
  maxInstances: number | null;
}): string {
  if (maxInstances !== null) {
    return `${instanceCount} of ${maxInstances} added`;
  } else {
    return `${instanceCount} added`;
  }
}

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
          instanceCount: numInstances,
          maxInstances,
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
    ({
      id,
      disabled,
      class: formClass,
      instanceCount,
      maxInstances,
      title,
      subtitle,
    }: FormOption) => {
      const titleId = `add-form-${formClass}`;
      return (
        <MenuItem
          id={id}
          aria-labelledby={titleId}
          className={racn(styles.menuItem)}
          textValue={title}
          isDisabled={disabled}
          onAction={() => addFormInstance(formClass)}
        >
          <span>
            <span id={titleId} className={styles.itemTitle}>
              {title}
            </span>{" "}
            <span className={styles.itemCount}>
              ({formatInstanceCount({ instanceCount, maxInstances })})
            </span>
          </span>
          {subtitle && <span>{subtitle}</span>}
        </MenuItem>
      );
    },
    [addFormInstance],
  );

  const filter = useFilter({ sensitivity: "base" });

  return (
    <MenuTrigger>
      <AriaButton>Add a form…</AriaButton>
      <Popover className={racn(styles.popover)} placement="bottom left">
        <Autocomplete filter={filter.contains}>
          <SearchField
            aria-label="Search forms by title"
            className={styles.searchBox}
            placeholder="w-2"
            value={searchValue}
            onChange={setSearchValue}
            autoFocus
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

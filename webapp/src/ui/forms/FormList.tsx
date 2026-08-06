import { MoveDownIcon, MoveUpIcon, Trash2Icon } from "lucide-react";
import { Disclosure, DisclosurePanel } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { FormLink } from "#src/ui/forms/FormLink";
import { FormTable } from "#src/ui/forms/FormTable";
import { ProseContent } from "#src/ui/forms/ProseContent";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { Badge } from "#src/ui/primitives/Badge";
import styles from "#src/ui/forms/FormList.module.css";

import type { FormSpecification } from "@thumbtax/forms";

function FormListItem({
  specification,
  index,
  numFormClasses,
}: {
  specification: FormSpecification;
  index: number;
  numFormClasses: number;
}) {
  const instances = useStore(
    (state) => state.applicationState.formInstances[specification.class],
  );

  const moveFormClass = useStore((state) => state.moveFormClass);
  const removeFormInstance = useStore((state) => state.removeFormInstance);

  if (!instances) {
    return null;
  }

  return (
    <li id={specification.class}>
      <div className={styles.itemHeading}>
        <h2>{specification.title}</h2>
        <FormLink
          aria-label={`link to ${specification.title}`}
          formClass={specification.class}
        >
          #
        </FormLink>
        <Badge>{specification.category}</Badge>
        {specification.maxInstances !== 1 && <Badge>{instances.length}</Badge>}
      </div>
      {specification.subtitle && <div>{specification.subtitle}</div>}
      {specification.instructions && (
        <div>
          <ProseContent nodes={specification.instructions} />
        </div>
      )}
      {specification.commentary && (
        <div>
          <ProseContent nodes={specification.commentary} />
        </div>
      )}
      <Disclosure>
        <div className={styles.itemButtons}>
          <AriaButton slot="trigger">
            Show/hide {specification.title}
          </AriaButton>
          <AriaButton
            aria-label="Move up"
            isDisabled={index <= 0}
            onPress={() => moveFormClass(specification.class, -1)}
          >
            <MoveUpIcon />
          </AriaButton>
          <AriaButton
            aria-label="Move down"
            isDisabled={index >= numFormClasses - 1}
            onPress={() => moveFormClass(specification.class, 1)}
          >
            <MoveDownIcon />
          </AriaButton>
          <AriaButton
            aria-label="Delete"
            onPress={() => {
              for (const { id } of instances) {
                removeFormInstance(specification.class, id);
              }
            }}
          >
            <Trash2Icon />
          </AriaButton>
        </div>
        <DisclosurePanel>
          <FormTable specification={specification} instances={instances} />
        </DisclosurePanel>
      </Disclosure>
    </li>
  );
}

export function FormList() {
  const specifications = useStore((state) => state.specifications);
  const formClasses = useStore((state) => state.applicationState.formClasses);

  if (!specifications) {
    return null;
  }

  return (
    <ul className={styles.formList}>
      {formClasses.map((formClass, index) => (
        <FormListItem
          key={formClass}
          specification={specifications[formClass]}
          index={index}
          numFormClasses={formClasses.length}
        />
      ))}
    </ul>
  );
}

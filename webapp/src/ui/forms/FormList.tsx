import { Trash2Icon } from "lucide-react";
import { Disclosure, DisclosurePanel } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { CommentaryDisplay } from "#src/ui/content/CommentaryDisplay";
import { FormLink } from "#src/ui/content/FormLink";
import { ProseContent } from "#src/ui/content/ProseContent";
import { FormTable } from "#src/ui/forms/FormTable";
import { MoveButton } from "#src/ui/forms/MoveButton";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { Badge } from "#src/ui/primitives/Badge";
import { IconButton } from "#src/ui/primitives/IconButton";
import { racn } from "#src/ui/utils/racn";
import { useTargetedId } from "#src/ui/utils/useTargetedId";
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
  const isExpanded = useStore(
    (state) => state.uiState.formClassExpansion[specification.class] ?? false,
  );

  const moveFormClass = useStore((state) => state.moveFormClass);
  const removeFormInstance = useStore((state) => state.removeFormInstance);
  const setFormClassExpanded = useStore((state) => state.setFormClassExpanded);

  const targetedId = useTargetedId();

  if (!instances) {
    return null;
  }

  return (
    <li
      id={specification.class}
      className={
        targetedId === specification.class ? styles.targeted : undefined
      }
    >
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
      <Disclosure
        isExpanded={isExpanded}
        onExpandedChange={(newIsExpanded) =>
          setFormClassExpanded(specification.class, newIsExpanded)
        }
      >
        <div className={styles.itemButtons}>
          <AriaButton slot="trigger">
            {isExpanded
              ? `Hide ${specification.title}`
              : `Show ${specification.title}`}
          </AriaButton>
          <MoveButton
            axis="block"
            direction="backward"
            isDisabled={index <= 0}
            onPress={() => moveFormClass(specification.class, -1)}
          />
          <MoveButton
            axis="block"
            direction="forward"
            isDisabled={index >= numFormClasses - 1}
            onPress={() => moveFormClass(specification.class, 1)}
          />
          <IconButton
            icon={Trash2Icon}
            label="Delete"
            onPress={() => {
              for (const { id } of instances) {
                removeFormInstance(specification.class, id);
              }
            }}
          />
        </div>
        <DisclosurePanel className={racn(styles.itemDisclosure)}>
          {specification.instructions && (
            <div>
              <ProseContent nodes={specification.instructions} />
            </div>
          )}
          {specification.commentary && (
            <CommentaryDisplay commentary={specification.commentary} />
          )}
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

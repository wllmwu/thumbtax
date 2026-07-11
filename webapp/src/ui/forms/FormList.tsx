import { Button, Disclosure, DisclosurePanel } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { FormLink } from "#src/ui/forms/FormLink";
import { FormTable } from "#src/ui/forms/FormTable";
import { ProseContent } from "#src/ui/forms/ProseContent";
import { Badge } from "#src/ui/primitives/Badge";

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

  const formTitleHeadingId = `${specification.class}-title`;
  const moveUpButtonId = `${specification.class}-move-up`;
  const moveDownButtonId = `${specification.class}-move-down`;
  const deleteButtonId = `${specification.class}-delete`;

  return (
    <li id={specification.class}>
      <span>
        <h2 id={formTitleHeadingId}>
          <FormLink formClass={specification.class}>
            {specification.title}
          </FormLink>
        </h2>
        <Badge>{specification.category}</Badge>
        {specification.maxInstances !== 1 && <Badge>{instances.length}</Badge>}
        <Button
          id={moveUpButtonId}
          aria-labelledby={`${moveUpButtonId} ${formTitleHeadingId}`}
          isDisabled={index <= 0}
          onPress={() => moveFormClass(specification.class, -1)}
        >
          Move up
        </Button>
        <Button
          id={moveDownButtonId}
          aria-labelledby={`${moveDownButtonId} ${formTitleHeadingId}`}
          isDisabled={index >= numFormClasses - 1}
          onPress={() => moveFormClass(specification.class, 1)}
        >
          Move down
        </Button>
        {specification.maxInstances === 1 && (
          <Button
            id={deleteButtonId}
            aria-labelledby={`${deleteButtonId} ${formTitleHeadingId}`}
            onPress={() =>
              removeFormInstance(specification.class, instances[0].id)
            }
          >
            Delete
          </Button>
        )}
      </span>
      {specification.subtitle && <span>{specification.subtitle}</span>}
      {specification.instructions && (
        <span>
          <ProseContent nodes={specification.instructions} />
        </span>
      )}
      {specification.commentary && (
        <span>
          <ProseContent nodes={specification.commentary} />
        </span>
      )}
      <Disclosure>
        <Button slot="trigger">Show/hide {specification.title}</Button>
        <DisclosurePanel>
          <FormTable
            specification={specification}
            instances={instances}
            formTitleHeadingId={formTitleHeadingId}
          />
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
    <ul>
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

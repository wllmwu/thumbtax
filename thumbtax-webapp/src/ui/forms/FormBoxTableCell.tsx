import { useStore } from "#src/state/useStore";

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

  return <td>{resolvedBox.value}</td>;
}

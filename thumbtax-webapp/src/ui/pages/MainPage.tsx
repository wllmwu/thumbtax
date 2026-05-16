import { Button } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { FormTable } from "#src/ui/forms/FormTable";

export function MainPage() {
  const addFormInstance = useStore((state) => state.addFormInstance);

  return (
    <div>
      <div>
        <h1>Thumbtax</h1>
        <h2>Income</h2>
        <FormTable formClass="fW2" />
        <Button onPress={() => addFormInstance("fW2")}>Add</Button>
        <h2>Taxes</h2>
        <FormTable formClass="f1040" />
        <Button onPress={() => addFormInstance("f1040")}>Add</Button>
      </div>
    </div>
  );
}

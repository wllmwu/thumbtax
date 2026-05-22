import { useStore } from "#src/state/useStore";
import { AddFormControl } from "#src/ui/forms/AddFormControl";
import { FormTable } from "#src/ui/forms/FormTable";

export function MainPage() {
  const formClasses = useStore((state) => state.applicationState.formClasses);

  return (
    <main>
      <div>
        <h1>Thumbtax</h1>
        <AddFormControl />
        {formClasses.map((formClass) => (
          <FormTable key={formClass} formClass={formClass} />
        ))}
      </div>
    </main>
  );
}

import { AddFormControl } from "#src/ui/forms/AddFormControl";
import { FormList } from "#src/ui/forms/FormList";

export function MainPage() {
  return (
    <main>
      <div>
        <h1>Thumbtax</h1>
        <AddFormControl />
        <FormList />
      </div>
    </main>
  );
}

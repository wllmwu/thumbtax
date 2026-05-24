import { AddFormMenu } from "#src/ui/control-bar/AddFormMenu";
import { FormList } from "#src/ui/forms/FormList";

export function MainPage() {
  return (
    <main>
      <div>
        <h1>Thumbtax</h1>
        <AddFormMenu />
        <FormList />
      </div>
    </main>
  );
}

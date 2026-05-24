import { ControlBar } from "#src/ui/control-bar/ControlBar";
import { FormList } from "#src/ui/forms/FormList";

export function MainPage() {
  return (
    <main>
      <div>
        <h1>Thumbtax</h1>
        <ControlBar />
        <FormList />
      </div>
    </main>
  );
}

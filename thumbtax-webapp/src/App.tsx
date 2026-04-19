import { TaxFormView } from "#src/components/TaxFormView";
import { Form1040 } from "#src/forms/form1040";
import { FormW2 } from "#src/forms/formW2";

import type { TaxFormRenderView } from "#src/types/taxFormRenderView";

const w2View: TaxFormRenderView = {
  specification: FormW2,
  instances: [{ id: "w2-1", boxValues: {} }],
};

const f1040View: TaxFormRenderView = {
  specification: Form1040,
  instances: [{ id: "f1040-1", boxValues: {} }],
};

function App() {
  return (
    <>
      <TaxFormView view={w2View} />
      <TaxFormView view={f1040View} />
    </>
  );
}

export default App;

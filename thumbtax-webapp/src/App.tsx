import { useEffect, useState } from "react";

import { TaxFormView } from "#src/components/TaxFormView";
import { TaxFormService } from "#src/services/TaxFormService";

import type { TaxFormRenderView } from "#src/types/taxFormRenderView";

const service = new TaxFormService();

function App() {
  const [formViews, setFormViews] = useState<TaxFormRenderView[]>(
    () => service.getFormViews(),
  );

  useEffect(() => {
    return service.subscribe(() => {
      setFormViews(service.getFormViews());
    });
  }, []);

  return (
    <>
      {formViews.map((view) => (
        <TaxFormView
          key={view.specification.class}
          view={view}
          onSetBoxValue={(formId, boxId, value) => service.setBoxValue(formId, boxId, value)}
        />
      ))}
    </>
  );
}

export default App;

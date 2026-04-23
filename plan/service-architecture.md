# Service architecture

This file gives more detailed guidance for the TaxFormService implementation.

## TaxFormService

Interface:

```ts
class TaxFormService {
  constructor() {}

  addForm(formClass: TaxFormClass, userLabel: string | null): void {}

  removeForm(formId: TaxFormInstanceId): void {}

  setBoxValue(
    formId: TaxFormInstanceId,
    boxId: TaxFormBoxIdentifier,
    value: UserInputValue,
  ): void {}

  renderFormViews(): TaxFormRenderView[] {}

  subscribe(callback: () => void): () => void {}
}
```

Additional operations to implement later:

- Set a form instance's user label
- Reorder the forms and form instances
- Set the selected filing status

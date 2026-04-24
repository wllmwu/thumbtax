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

## Domain objects

```ts
class TaxForm {
  public readonly formClass: TaxFormClass;
  public readonly id: TaxFormInstanceId;
  public userLabel: string | null;
}

class TaxFormBox {
  public readonly form: TaxFormInstanceId;
  public readonly identifier: TaxFormBoxIdentifier;
  public valueNode: ValueNodeId;
}

interface BoxValue {
  public get numericalValue(): number;
}

class NumberValue implements BoxValue {
  public value: number;
}

class LabeledListValue implements BoxValue {
  public list: Array<[string, number]>;
}

class ValueNode {
  public readonly id: ValueNodeId;
  public value: BoxValue;
}

interface ValueEdge {
  public readonly sourceNode: ValueNodeId;
  public readonly targetNode: ValueNodeId;

  public getUpdatedValue(sourceValue: BoxValue): BoxValue;
}
```

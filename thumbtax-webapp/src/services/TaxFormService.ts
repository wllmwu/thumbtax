import { Form1040 } from "#src/forms/form1040";
import { FormW2 } from "#src/forms/formW2";

import type { TaxFormRenderView } from "#src/types/taxFormRenderView";
import type {
  TaxFormBoxIdentifier,
  TaxFormClass,
  TaxFormSpecification,
} from "#src/types/taxFormSpecification";
import type { UserInputValue } from "#src/types/userInputValue";

type FormInstance = {
  class: TaxFormClass;
  id: string;
  userLabel?: string;
  userValues: Record<TaxFormBoxIdentifier, UserInputValue>;
};

const CLASS_ORDER: readonly TaxFormClass[] = ["fW2", "f1040"];

export class TaxFormService {
  private instances: FormInstance[];
  private subscribers: Set<() => void>;
  private readonly specs: Map<TaxFormClass, TaxFormSpecification>;
  private counter = 0;

  constructor() {
    this.specs = new Map([
      ["fW2", FormW2],
      ["f1040", Form1040],
    ]);
    this.subscribers = new Set();
    this.instances = [
      { class: "fW2", id: "w2-1", userLabel: undefined, userValues: {} },
      { class: "f1040", id: "f1040-1", userLabel: undefined, userValues: {} },
    ];
  }

  addForm(type: TaxFormClass, userLabel?: string): string {
    const id = this.generateId();
    this.instances.push({ class: type, id, userLabel, userValues: {} });
    this.notify();
    return id;
  }

  removeForm(formId: string): void {
    const index = this.instances.findIndex((i) => i.id === formId);
    if (index === -1) return;
    this.instances.splice(index, 1);
    this.notify();
  }

  setBoxValue(
    formId: string,
    boxId: TaxFormBoxIdentifier,
    value: UserInputValue,
  ): void {
    const instance = this.instances.find((i) => i.id === formId);
    if (instance === undefined) return;
    instance.userValues[boxId] = value;
    this.notify();
  }

  getFormViews(): TaxFormRenderView[] {
    const views: TaxFormRenderView[] = [];
    for (const formClass of CLASS_ORDER) {
      const classInstances = this.instances.filter(
        (i) => i.class === formClass,
      );
      if (classInstances.length === 0) continue;
      const spec = this.specs.get(formClass)!;
      views.push({
        specification: spec,
        instances: classInstances.map((inst) => ({
          id: inst.id,
          userLabel: inst.userLabel,
          boxValues: this.buildBoxValues(inst, spec),
        })),
      });
    }
    return views;
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    for (const cb of this.subscribers) cb();
  }

  private buildBoxValues(
    instance: FormInstance,
    spec: TaxFormSpecification,
  ): Record<TaxFormBoxIdentifier, UserInputValue> {
    const result: Record<TaxFormBoxIdentifier, UserInputValue> = {};
    for (const section of spec.sections) {
      for (const line of section.lines) {
        for (const box of line.boxes) {
          result[box.identifier] =
            instance.userValues[box.identifier] ??
            { type: "number", value: 0 };
        }
      }
    }
    return result;
  }

  private generateId(): string {
    return `form-${++this.counter}`;
  }
}

import { Form1040 } from "#src/forms/form1040";
import { FormW2 } from "#src/forms/formW2";

import type { FilingStatus } from "#src/types/filingStatus";
import type { TaxFormRenderView } from "#src/types/taxFormRenderView";
import type {
  TaxFormBoxIdentifier,
  TaxFormClass,
  TaxFormSpecification,
  ValueProvider,
} from "#src/types/taxFormSpecification";
import type { UserInputValue } from "#src/types/userInputValue";

type FormInstance = {
  class: TaxFormClass;
  id: string;
  userLabel?: string;
  userValues: Record<TaxFormBoxIdentifier, UserInputValue>;
};

// Evaluated numeric values for all boxes across all form instances.
type AllValues = Map<string, Map<TaxFormBoxIdentifier, number>>;

const CLASS_ORDER: readonly TaxFormClass[] = ["fW2", "f1040"];

export class TaxFormService {
  private instances: FormInstance[];
  private subscribers: Set<() => void>;
  private readonly specs: Map<TaxFormClass, TaxFormSpecification>;
  private filingStatus: FilingStatus = "single";
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
    const allValues = this.computeAllValues();
    const views: TaxFormRenderView[] = [];

    for (const formClass of CLASS_ORDER) {
      const classInstances = this.instances.filter((i) => i.class === formClass);
      if (classInstances.length === 0) continue;
      const spec = this.specs.get(formClass)!;
      views.push({
        specification: spec,
        instances: classInstances.map((inst) => ({
          id: inst.id,
          userLabel: inst.userLabel,
          boxValues: this.toBoxValues(allValues.get(inst.id) ?? new Map()),
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

  private toBoxValues(
    values: Map<TaxFormBoxIdentifier, number>,
  ): Record<TaxFormBoxIdentifier, UserInputValue> {
    const result: Record<TaxFormBoxIdentifier, UserInputValue> = {};
    for (const [id, value] of values) {
      result[id] = { type: "number", value };
    }
    return result;
  }

  private computeAllValues(): AllValues {
    const allValues: AllValues = new Map();

    for (const formClass of CLASS_ORDER) {
      const spec = this.specs.get(formClass)!;
      const classInstances = this.instances.filter((i) => i.class === formClass);

      for (const instance of classInstances) {
        const instValues = new Map<TaxFormBoxIdentifier, number>();
        allValues.set(instance.id, instValues);

        for (const section of spec.sections) {
          for (const line of section.lines) {
            for (const box of line.boxes) {
              instValues.set(
                box.identifier,
                this.eval(box.value, box.identifier, instance, spec, instValues, allValues),
              );
            }
          }
        }
      }
    }

    return allValues;
  }

  private eval(
    vp: ValueProvider,
    boxId: TaxFormBoxIdentifier,
    instance: FormInstance,
    spec: TaxFormSpecification,
    current: Map<TaxFormBoxIdentifier, number>,
    all: AllValues,
  ): number {
    const recurse = (sub: ValueProvider) =>
      this.eval(sub, boxId, instance, spec, current, all);

    if (typeof vp === "number") return vp;

    if (typeof vp === "string") {
      // Reference to another box in the same form instance.
      return current.get(vp) ?? 0;
    }

    switch (vp.type) {
      case "number_input":
      case "list_amounts_input": {
        const stored = instance.userValues[boxId];
        if (!stored) return 0;
        if (stored.type === "number") return stored.value;
        return stored.value.reduce((s, [, v]) => s + v, 0);
      }

      case "checkbox_input": {
        const stored = instance.userValues[boxId];
        return stored?.type === "number" ? stored.value : 0;
      }

      case "unused":
      case "unsupported":
      case "box_selection_input":
        return 0;

      case "form_reference": {
        const refInstances = this.instances.filter((i) => i.class === vp.form);
        return refInstances.reduce((sum, inst) => sum + (all.get(inst.id)?.get(vp.box) ?? 0), 0);
      }

      case "sum_range": {
        const isCrossForm = vp.form !== undefined;
        const targetSpec = isCrossForm ? this.specs.get(vp.form!)! : spec;
        const targetInstances = isCrossForm
          ? this.instances.filter((i) => i.class === vp.form)
          : [instance];

        let inRange = false;
        let sum = 0;
        for (const section of targetSpec.sections) {
          for (const line of section.lines) {
            if (line.index === vp.fromLine) inRange = true;
            if (inRange) {
              for (const box of line.boxes) {
                if (vp.column === undefined || box.columnIndex === vp.column) {
                  for (const inst of targetInstances) {
                    const vals = isCrossForm ? all.get(inst.id) : current;
                    sum += vals?.get(box.identifier) ?? 0;
                  }
                }
              }
              if (line.index === vp.toLine) inRange = false;
            }
          }
        }
        return sum;
      }

      case "sum":
        return vp.values.reduce<number>((s, v) => s + recurse(v), 0);

      case "difference":
        return recurse(vp.minuend) - recurse(vp.subtrahend);

      case "product":
        return vp.values.reduce<number>((p, v) => p * recurse(v), 1);

      case "quotient": {
        const divisor = recurse(vp.divisor);
        return divisor !== 0 ? recurse(vp.dividend) / divisor : 0;
      }

      case "minimum":
        return Math.min(...vp.values.map(recurse));

      case "maximum":
        return Math.max(...vp.values.map(recurse));

      case "absolute_value":
        return Math.abs(recurse(vp.value));

      case "non_negative":
        return Math.max(0, recurse(vp.value));

      case "numerical_negation":
        return -recurse(vp.value);

      case "form_presence":
        return this.instances.some((i) => i.class === vp.form) ? 1 : 0;

      case "conditional":
        return recurse(vp.condition) !== 0 ? recurse(vp.trueValue) : recurse(vp.falseValue);

      case "comparison": {
        const val = recurse(vp.value);
        const strict = vp.strict ?? false;
        let result = true;
        if (vp.minimum !== undefined) {
          const min = recurse(vp.minimum);
          result = result && (strict ? val > min : val >= min);
        }
        if (vp.maximum !== undefined) {
          const max = recurse(vp.maximum);
          result = result && (strict ? val < max : val <= max);
        }
        return result ? 1 : 0;
      }

      case "logical_negation":
        return recurse(vp.value) === 0 ? 1 : 0;

      case "filing_status_map": {
        const mapped = vp.values[this.filingStatus] ?? vp.default;
        return mapped !== undefined ? recurse(mapped) : 0;
      }
    }
  }

  private generateId(): string {
    return `form-${++this.counter}`;
  }
}

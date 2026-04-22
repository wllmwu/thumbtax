import { v4 as uuidv4 } from "uuid";

import { BoxValueGraph, makeBoxKey } from "#src/services/BoxValueGraph";
import { FormSpecificationService } from "#src/services/FormSpecificationService";

import type { FormInstance, ServiceState } from "#src/types/serviceState";
import type { TaxFormRenderView } from "#src/types/taxFormRenderView";
import type {
  TaxFormBox,
  TaxFormBoxIdentifier,
  TaxFormClass,
  TaxFormSpecification,
  ValueProvider,
} from "#src/types/taxFormSpecification";
import type { UserInputValue } from "#src/types/userInputValue";

const CLASS_ORDER: readonly TaxFormClass[] = ["fW2", "f1040"];

export class TaxFormService {
  private state: ServiceState = {
    taxYear: 2025,
    filingStatus: "single",
    forms: [],
  };
  private readonly subscribers: Set<() => void> = new Set();
  private readonly specificationService = new FormSpecificationService();
  private readonly boxValues = new BoxValueGraph();

  constructor() {
    for (const formClass of this.specificationService.getAllClasses()) {
      this.boxValues.addNode(`form_presence|${formClass}`, [], () => 0);
    }
  }

  addForm(type: TaxFormClass, userLabel?: string): string {
    const id = uuidv4();
    const instance: FormInstance = {
      class: type,
      id,
      userLabel,
      userValues: {},
    };
    this.state.forms.push(instance);
    const spec = this.specificationService.getSpec(type);
    if (spec !== undefined) {
      this.registerInstanceBoxes(instance, spec);
      this.updateAggregateNodes(type, id, spec, "add");
    }
    this.boxValues.setInputValue(`form_presence|${type}`, 1);
    this.notify();
    return id;
  }

  removeForm(formId: string): void {
    const index = this.state.forms.findIndex((i) => i.id === formId);
    if (index === -1) return;
    const instance = this.state.forms[index];
    this.state.forms.splice(index, 1);
    const spec = this.specificationService.getSpec(instance.class);
    if (spec !== undefined) {
      for (const section of spec.sections) {
        for (const line of section.lines) {
          for (const box of line.boxes) {
            this.boxValues.removeNode(makeBoxKey(formId, box.identifier));
          }
        }
      }
    }
    const classRemaining = this.state.forms.some(
      (i) => i.class === instance.class,
    );
    if (!classRemaining) {
      this.boxValues.setInputValue(`form_presence|${instance.class}`, 0);
    }
    this.notify();
  }

  setBoxValue(
    formId: string,
    boxId: TaxFormBoxIdentifier,
    value: UserInputValue,
  ): void {
    const instance = this.state.forms.find((i) => i.id === formId);
    if (instance === undefined) return;
    instance.userValues[boxId] = value;
    const spec = this.specificationService.getSpec(instance.class);
    if (spec === undefined) {
      this.notify();
      return;
    }
    const box = this.findBox(spec, boxId);
    if (box === undefined) {
      this.notify();
      return;
    }
    const newValue = this.evaluateBox(box.value, boxId, instance);
    this.boxValues.setInputValue(makeBoxKey(formId, boxId), newValue);
    this.notify();
  }

  getFormViews(): TaxFormRenderView[] {
    const views: TaxFormRenderView[] = [];
    for (const formClass of CLASS_ORDER) {
      const classInstances = this.state.forms.filter(
        (i) => i.class === formClass,
      );
      if (classInstances.length === 0) continue;
      const spec = this.specificationService.getSpec(formClass);
      if (spec === undefined) continue;
      views.push({
        specification: spec,
        instances: classInstances.map((inst) => ({
          id: inst.id,
          userLabel: inst.userLabel,
          boxValues: this.toBoxValues(inst.id, spec),
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
    formId: string,
    spec: TaxFormSpecification,
  ): Record<TaxFormBoxIdentifier, UserInputValue> {
    const result: Record<TaxFormBoxIdentifier, UserInputValue> = {};
    for (const section of spec.sections) {
      for (const line of section.lines) {
        for (const box of line.boxes) {
          result[box.identifier] = {
            type: "number",
            value: this.boxValues.getValue(makeBoxKey(formId, box.identifier)),
          };
        }
      }
    }
    return result;
  }

  private registerInstanceBoxes(
    instance: FormInstance,
    spec: TaxFormSpecification,
  ): void {
    for (const section of spec.sections) {
      for (const line of section.lines) {
        for (const box of line.boxes) {
          const boxId = box.identifier;
          const key = makeBoxKey(instance.id, boxId);
          const deps = this.extractDependencies(box.value, instance, spec);
          this.boxValues.addNode(key, deps, () =>
            this.evaluateBox(box.value, boxId, instance),
          );
        }
      }
    }
  }

  private updateAggregateNodes(
    formClass: TaxFormClass,
    instanceId: string,
    spec: TaxFormSpecification,
    action: "add",
  ): void {
    for (const section of spec.sections) {
      for (const line of section.lines) {
        for (const box of line.boxes) {
          const boxId = box.identifier;
          const aggKey = `agg|${formClass}|${boxId}`;
          const instanceBoxKey = makeBoxKey(instanceId, boxId);
          const computeAgg = (): number =>
            this.state.forms
              .filter((i) => i.class === formClass)
              .reduce(
                (sum, inst) =>
                  sum + this.boxValues.getValue(makeBoxKey(inst.id, boxId)),
                0,
              );
          if (action === "add") {
            if (this.boxValues.hasNode(aggKey)) {
              this.boxValues.addDep(aggKey, instanceBoxKey);
            } else {
              this.boxValues.addNode(aggKey, [instanceBoxKey], computeAgg);
            }
          }
        }
      }
    }
  }

  private findBox(
    spec: TaxFormSpecification,
    boxId: TaxFormBoxIdentifier,
  ): TaxFormBox | undefined {
    for (const section of spec.sections) {
      for (const line of section.lines) {
        for (const box of line.boxes) {
          if (box.identifier === boxId) return box;
        }
      }
    }
    return undefined;
  }

  private extractDependencies(
    vp: ValueProvider,
    instance: FormInstance,
    spec: TaxFormSpecification,
  ): string[] {
    const deps = new Set<string>();
    this.collectDependencies(vp, instance, spec, deps);
    return [...deps];
  }

  private collectDependencies(
    vp: ValueProvider,
    instance: FormInstance,
    spec: TaxFormSpecification,
    deps: Set<string>,
  ): void {
    if (typeof vp === "number") return;

    if (typeof vp === "string") {
      deps.add(makeBoxKey(instance.id, vp));
      return;
    }

    const recurse = (sub: ValueProvider) =>
      this.collectDependencies(sub, instance, spec, deps);

    switch (vp.type) {
      case "number_input":
      case "list_amounts_input":
      case "checkbox_input":
      case "unused":
      case "unsupported":
      case "box_selection_input":
        return;

      case "form_reference":
        deps.add(`agg|${vp.form}|${vp.box}`);
        return;

      case "sum_range": {
        if (vp.form !== undefined) {
          const form = vp.form;
          const targetSpec = this.specificationService.getSpec(form);
          if (targetSpec === undefined) return;
          for (const boxId of this.specificationService.getBoxesInRange(
            targetSpec,
            vp.fromLine,
            vp.toLine,
            vp.column,
          )) {
            deps.add(`agg|${form}|${boxId}`);
          }
        } else {
          for (const boxId of this.specificationService.getBoxesInRange(
            spec,
            vp.fromLine,
            vp.toLine,
            vp.column,
          )) {
            deps.add(makeBoxKey(instance.id, boxId));
          }
        }
        return;
      }

      case "form_presence":
        deps.add(`form_presence|${vp.form}`);
        return;

      case "sum":
      case "product":
      case "minimum":
      case "maximum":
        for (const v of vp.values) recurse(v);
        return;

      case "difference":
        recurse(vp.minuend);
        recurse(vp.subtrahend);
        return;

      case "quotient":
        recurse(vp.dividend);
        recurse(vp.divisor);
        return;

      case "absolute_value":
      case "non_negative":
      case "numerical_negation":
      case "logical_negation":
        recurse(vp.value);
        return;

      case "conditional":
        recurse(vp.condition);
        recurse(vp.trueValue);
        recurse(vp.falseValue);
        return;

      case "comparison":
        recurse(vp.value);
        if (vp.minimum !== undefined) recurse(vp.minimum);
        if (vp.maximum !== undefined) recurse(vp.maximum);
        return;

      case "filing_status_map":
        for (const v of Object.values(vp.values)) recurse(v);
        if (vp.default !== undefined) recurse(vp.default);
        return;
    }
  }

  private evaluateBox(
    vp: ValueProvider,
    boxId: TaxFormBoxIdentifier,
    instance: FormInstance,
  ): number {
    const recurse = (sub: ValueProvider) =>
      this.evaluateBox(sub, boxId, instance);

    if (typeof vp === "number") return vp;

    if (typeof vp === "string") {
      return this.boxValues.getValue(makeBoxKey(instance.id, vp));
    }

    const spec = this.specificationService.getSpec(instance.class);

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

      case "form_reference":
        return this.boxValues.getValue(`agg|${vp.form}|${vp.box}`);

      case "sum_range": {
        if (vp.form !== undefined) {
          const form = vp.form;
          const targetSpec = this.specificationService.getSpec(form);
          if (targetSpec === undefined) return 0;
          return this.specificationService
            .getBoxesInRange(targetSpec, vp.fromLine, vp.toLine, vp.column)
            .reduce(
              (sum, boxIdInRange) =>
                sum + this.boxValues.getValue(`agg|${form}|${boxIdInRange}`),
              0,
            );
        }
        if (spec === undefined) return 0;
        return this.specificationService
          .getBoxesInRange(spec, vp.fromLine, vp.toLine, vp.column)
          .reduce(
            (sum, boxIdInRange) =>
              sum +
              this.boxValues.getValue(makeBoxKey(instance.id, boxIdInRange)),
            0,
          );
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
        return this.boxValues.getValue(`form_presence|${vp.form}`);

      case "conditional":
        return recurse(vp.condition) !== 0
          ? recurse(vp.trueValue)
          : recurse(vp.falseValue);

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
        const mapped = vp.values[this.state.filingStatus] ?? vp.default;
        return mapped !== undefined ? recurse(mapped) : 0;
      }
    }
  }
}

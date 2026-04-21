import { Form1040 } from "#src/forms/form1040";
import { FormW2 } from "#src/forms/formW2";

import type {
  TaxFormBoxIdentifier,
  TaxFormClass,
  TaxFormSpecification,
} from "#src/types/taxFormSpecification";

export class FormSpecificationService {
  private readonly specs: Map<TaxFormClass, TaxFormSpecification> = new Map([
    ["fW2", FormW2],
    ["f1040", Form1040],
  ]);

  getSpec(formClass: TaxFormClass): TaxFormSpecification | undefined {
    return this.specs.get(formClass);
  }

  getAllClasses(): TaxFormClass[] {
    return [...this.specs.keys()];
  }

  getBoxesInRange(
    spec: TaxFormSpecification,
    fromLine: string,
    toLine: string,
    column?: string,
  ): TaxFormBoxIdentifier[] {
    const result: TaxFormBoxIdentifier[] = [];
    let inRange = false;
    for (const section of spec.sections) {
      for (const line of section.lines) {
        if (line.index === fromLine) inRange = true;
        if (inRange) {
          for (const box of line.boxes) {
            if (column === undefined || box.columnIndex === column) {
              result.push(box.identifier);
            }
          }
          if (line.index === toLine) inRange = false;
        }
      }
    }
    return result;
  }
}

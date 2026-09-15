import type { FormSpecification } from "../types/formSpecification";
import type { BoxIdentifier } from "@thumbtax/common";

export function assertUniqueInputKeys(specification: FormSpecification): void {
  const boxIdentifiersByInputKey = new Map<string, BoxIdentifier>();
  for (const section of specification.sections) {
    for (const line of section.lines) {
      const boxes = "box" in line ? [line.box] : line.boxes;
      for (const box of boxes) {
        if (!("inputKey" in box.value)) {
          continue;
        }
        const { inputKey } = box.value;
        const existingBoxIdentifier = boxIdentifiersByInputKey.get(inputKey);
        if (existingBoxIdentifier !== undefined) {
          throw new Error(
            `Form "${specification.class}" has duplicate inputKey "${inputKey}" in boxes "${existingBoxIdentifier}" and "${box.identifier}"`,
          );
        }
        boxIdentifiersByInputKey.set(inputKey, box.identifier);
      }
    }
  }
}

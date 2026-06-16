import type { FormClass } from "#src/common/types/formClass";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

function sanitize(value: string): string {
  return value.replace(/\s+/g, "_");
}

export function formTitleId(formClass: FormClass): string {
  return `form-title-${sanitize(formClass)}`;
}

export function instanceGroupLabelId(instanceId: FormInstanceId): string {
  return `instance-group-${sanitize(instanceId)}`;
}

export function lineLabelId(
  instanceId: FormInstanceId,
  sectionIndex: number,
  lineIndex: string,
): string {
  return `line-label-${sanitize(instanceId)}-${sectionIndex}-${sanitize(lineIndex)}`;
}

export function lineDescriptionId(
  instanceId: FormInstanceId,
  sectionIndex: number,
  lineIndex: string,
): string {
  return `line-description-${sanitize(instanceId)}-${sectionIndex}-${sanitize(lineIndex)}`;
}

export function columnLabelId(
  instanceId: FormInstanceId,
  sectionIndex: number,
  columnIndex: string,
): string {
  return `column-label-${sanitize(instanceId)}-${sectionIndex}-${sanitize(columnIndex)}`;
}

export function columnDescriptionId(
  instanceId: FormInstanceId,
  sectionIndex: number,
  columnIndex: string,
): string {
  return `column-description-${sanitize(instanceId)}-${sectionIndex}-${sanitize(columnIndex)}`;
}

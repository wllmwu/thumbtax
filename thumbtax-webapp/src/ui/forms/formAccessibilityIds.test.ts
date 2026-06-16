import { describe, expect, it } from "vitest";

import {
  columnDescriptionId,
  columnLabelId,
  formTitleId,
  instanceGroupLabelId,
  lineDescriptionId,
  lineLabelId,
} from "#src/ui/forms/formAccessibilityIds";

import type { FormClass } from "#src/common/types/formClass";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

const FORM_CLASS: FormClass = "fW2";
const INSTANCE_ID: FormInstanceId = "instance-1";

describe("formAccessibilityIds", () => {
  it("produces distinct ids for the form title and instance group", () => {
    expect(formTitleId(FORM_CLASS)).not.toBe(instanceGroupLabelId(INSTANCE_ID));
  });

  it("produces distinct label and description ids for a line", () => {
    expect(lineLabelId(INSTANCE_ID, 0, "1a")).not.toBe(
      lineDescriptionId(INSTANCE_ID, 0, "1a"),
    );
  });

  it("distinguishes lines by section and index", () => {
    expect(lineLabelId(INSTANCE_ID, 0, "1")).not.toBe(
      lineLabelId(INSTANCE_ID, 1, "1"),
    );
    expect(lineLabelId(INSTANCE_ID, 0, "1")).not.toBe(
      lineLabelId(INSTANCE_ID, 0, "2"),
    );
  });

  it("produces distinct label and description ids for a column", () => {
    expect(columnLabelId(INSTANCE_ID, 0, "(a)")).not.toBe(
      columnDescriptionId(INSTANCE_ID, 0, "(a)"),
    );
  });

  it("sanitizes whitespace so ids contain no spaces", () => {
    const messyInstance: FormInstanceId = "instance with space";
    expect(lineLabelId(messyInstance, 0, "line 1")).not.toMatch(/\s/);
  });
});

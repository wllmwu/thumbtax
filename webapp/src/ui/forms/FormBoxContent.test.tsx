import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
  makeSpecificationsByYearFixture,
} from "#src/test/specificationFixtures";
import { FormBoxContent } from "#src/ui/forms/FormBoxContent";

import type { FormBox } from "@thumbtax/forms";
import type { FormInstance } from "#src/common/types/formInstance";
import type { UserInput } from "#src/common/types/userInput";

const INSTANCE_ID = "w2-1";
const OTHER_INSTANCE_ID = "w2-2";

const NUMBER_BOX: FormBox<false> = makeBoxFixture({
  identifier: "1",
  value: { type: "number_input", inputKey: "wages" },
});
const CHECKBOX_BOX: FormBox<false> = makeBoxFixture({
  identifier: "13",
  format: "checkbox",
  value: { type: "checkbox_input", inputKey: "statutory_employee" },
});
const OVERRIDE_BOX: FormBox<false> = makeBoxFixture({
  identifier: "3",
  value: {
    type: "override_number_input",
    inputKey: "social_security_wages",
    computedValue: { type: "number_constant", value: 1250 },
  },
});
const SELECT_VALUE_BOX: FormBox<false> = makeBoxFixture({
  identifier: "12",
  value: {
    type: "select_value_input",
    inputKey: "plan",
    options: [
      {
        key: "roth",
        label: "Roth",
        value: { type: "number_constant", value: 1 },
      },
      {
        key: "traditional",
        label: "Traditional",
        value: { type: "number_constant", value: 2 },
      },
    ],
  },
});
const SELECT_BOXES_BOX: FormBox<false> = makeBoxFixture({
  identifier: "14",
  value: {
    type: "select_instance_boxes_input",
    inputKey: "sources",
    options: [{ form: "fW2", box: NUMBER_BOX.identifier }],
  },
});

const SPECIFICATIONS_BY_YEAR = makeSpecificationsByYearFixture(
  makeRegistryFixture({
    fW2: makeSpecificationFixture({
      class: "fW2",
      sections: [
        makeSectionFixture({
          lines: [
            NUMBER_BOX,
            CHECKBOX_BOX,
            OVERRIDE_BOX,
            SELECT_VALUE_BOX,
            SELECT_BOXES_BOX,
          ].map((box) => makeLineFixture({ index: box.identifier, box })),
        }),
      ],
    }),
  }),
);

function renderBox(box: FormBox<false>, inputs: Record<string, UserInput>) {
  const instance: FormInstance = {
    id: INSTANCE_ID,
    class: "fW2",
    label: "Employer A",
    inputs,
  };
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    {
      taxYear: 2025,
      filingStatus: "single",
      formClasses: ["fW2"],
      formInstances: {
        fW2: [
          instance,
          {
            id: OTHER_INSTANCE_ID,
            class: "fW2",
            label: "Employer B",
            inputs: { wages: { type: "number", value: 900 } },
          },
        ],
      },
    },
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    SPECIFICATIONS_BY_YEAR,
  );

  return render(
    <>
      <span id="box-label">Box label</span>
      <FormBoxContent
        instance={instance}
        box={box}
        aria-labelledby="box-label"
        aria-describedby={undefined}
      />
    </>,
  );
}

describe("FormBoxContent", () => {
  describe("inputs of the wrong type", () => {
    it("shows a number input as zero", async () => {
      renderBox(NUMBER_BOX, {
        wages: { type: "selection", selectedKey: "4200" },
      });

      expect(await screen.findByRole("textbox")).toHaveValue("0.00");
    });

    it("shows a checkbox input as unchecked", async () => {
      renderBox(CHECKBOX_BOX, {
        statutory_employee: { type: "override", override: 1 },
      });

      expect(await screen.findByRole("checkbox")).not.toBeChecked();
    });

    it("shows an override input as not overridden", async () => {
      renderBox(OVERRIDE_BOX, {
        social_security_wages: { type: "number", value: 700 },
      });

      expect(
        await screen.findByRole("checkbox", { name: /Override/ }),
      ).not.toBeChecked();
      expect(screen.getByRole("textbox")).toHaveValue("1,250.00");
    });
  });

  it("shows no selection for a selection key that isn't an option", async () => {
    renderBox(SELECT_VALUE_BOX, {
      plan: { type: "selection", selectedKey: "hsa" },
    });

    expect(
      await screen.findByRole("button", { name: /Box label/ }),
    ).toHaveTextContent("Select an item");
  });

  it("shows only the selected box addresses that are options", async () => {
    renderBox(SELECT_BOXES_BOX, {
      sources: {
        type: "instance_box_selections",
        selected: [
          { instance: OTHER_INSTANCE_ID, box: NUMBER_BOX.identifier },
          // Instance doesn't exist
          { instance: "w2-deleted", box: NUMBER_BOX.identifier },
          // Box isn't an option
          { instance: OTHER_INSTANCE_ID, box: CHECKBOX_BOX.identifier },
        ],
      },
    });

    expect(
      await screen.findByRole("button", { name: /Box label/ }),
    ).toHaveTextContent("1 of 2 selected");
    expect(screen.getByRole("textbox")).toHaveValue("900.00");
  });
});

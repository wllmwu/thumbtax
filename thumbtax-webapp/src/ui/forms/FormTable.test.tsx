import { render, renderHook, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { makeRegistryFixture } from "#src/specifications/test/fixtures";
import {
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { FormTable } from "#src/ui/forms/FormTable";

import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormSpecification } from "#src/specifications/types/formSpecification";
import type { ApplicationState } from "#src/state/types/applicationState";

const TEST_CLASS: FormClass = "fW2";

const SPECIFICATION: FormSpecification = {
  class: TEST_CLASS,
  title: "Form W-2",
  irsPageUrl: "",
  category: "income",
  maxInstances: null,
  sections: [
    {
      lines: [
        {
          index: "1",
          description: "Wages, salaries, tips",
          box: { identifier: "1", value: { type: "number_input" } },
        },
      ],
    },
  ],
};

const INSTANCE: FormInstance = {
  id: "instance-1",
  class: TEST_CLASS,
  label: "Employer A",
  inputs: {},
};

function initializeStore(
  specification: FormSpecification,
  instances: FormInstance[],
) {
  const applicationState: ApplicationState = {
    filingStatus: "single",
    formClasses: [TEST_CLASS],
    formInstances: { [TEST_CLASS]: instances },
  };
  const registry = makeRegistryFixture({ [TEST_CLASS]: specification });
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    applicationState,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    registry,
  );
}

describe("FormTable", () => {
  beforeEach(() => {
    initializeStore(SPECIFICATION, [INSTANCE]);
  });

  it("names a box input by its line index and describes it by the line description", async () => {
    render(<FormTable specification={SPECIFICATION} instances={[INSTANCE]} />);

    const input = await screen.findByRole("textbox");
    expect(input).toHaveAccessibleName("1");
    expect(input).toHaveAccessibleDescription("Wages, salaries, tips");
  });

  it("wraps each instance in a group labeled by its instance label", async () => {
    render(<FormTable specification={SPECIFICATION} instances={[INSTANCE]} />);

    expect(
      await screen.findByRole("group", { name: "Employer A" }),
    ).toBeInTheDocument();
  });

  it("gives the delete button an instance-contextual name", async () => {
    render(<FormTable specification={SPECIFICATION} instances={[INSTANCE]} />);

    expect(
      await screen.findByRole("button", { name: "Delete Employer A" }),
    ).toBeInTheDocument();
  });

  it("composes a multi-column box name and description from the line and column headers", async () => {
    const multiColumnSpecification: FormSpecification = {
      class: TEST_CLASS,
      title: "Form W-2",
      irsPageUrl: "",
      category: "income",
      maxInstances: null,
      sections: [
        {
          columns: [{ index: "(a)", description: "Federal" }],
          lines: [
            {
              index: "2",
              description: "Tax withheld",
              boxes: [
                {
                  identifier: "2a",
                  column: "(a)",
                  value: { type: "number_input" },
                },
              ],
            },
          ],
        },
      ],
    };
    initializeStore(multiColumnSpecification, [INSTANCE]);

    render(
      <FormTable
        specification={multiColumnSpecification}
        instances={[INSTANCE]}
      />,
    );

    const input = await screen.findByRole("textbox");
    expect(input).toHaveAccessibleName("2 (a)");
    expect(input).toHaveAccessibleDescription("Tax withheld Federal");
  });

  it("names the override checkbox 'Override' plus the line index", async () => {
    const overrideSpecification: FormSpecification = {
      class: TEST_CLASS,
      title: "Form W-2",
      irsPageUrl: "",
      category: "income",
      maxInstances: null,
      sections: [
        {
          lines: [
            {
              index: "3",
              description: "Total tax",
              box: {
                identifier: "3",
                value: {
                  type: "override_number_input",
                  computedValue: { type: "number_constant", value: 0 },
                },
              },
            },
          ],
        },
      ],
    };
    initializeStore(overrideSpecification, [INSTANCE]);

    render(
      <FormTable
        specification={overrideSpecification}
        instances={[INSTANCE]}
      />,
    );

    expect(
      await screen.findByRole("checkbox", { name: "Override 3" }),
    ).toBeInTheDocument();
  });
});

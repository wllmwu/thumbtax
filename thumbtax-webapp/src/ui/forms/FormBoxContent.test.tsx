import { render, renderHook, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { makeRegistryFixture } from "#src/specifications/test/fixtures";
import {
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { FormBoxContent } from "#src/ui/forms/FormBoxContent";

import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormBox } from "#src/specifications/types/formSpecification";
import type { ApplicationState } from "#src/state/types/applicationState";

const TEST_CLASS: FormClass = "fW2";
const INSTANCE_ID = "instance-1";

const INPUT_BOX: FormBox<false> = {
  identifier: "1",
  value: { type: "number_input" },
};

const INSTANCE: FormInstance = {
  id: INSTANCE_ID,
  class: TEST_CLASS,
  label: "Employer A",
  inputs: {},
};

function initializeStore() {
  const applicationState: ApplicationState = {
    filingStatus: "single",
    formClasses: [TEST_CLASS],
    formInstances: { [TEST_CLASS]: [INSTANCE] },
  };
  const registry = makeRegistryFixture({
    [TEST_CLASS]: {
      class: TEST_CLASS,
      title: "Form W-2",
      irsPageUrl: "",
      category: "income",
      maxInstances: null,
      sections: [{ lines: [{ index: "1", box: INPUT_BOX }] }],
    },
  });
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    applicationState,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    registry,
  );
}

describe("FormBoxContent", () => {
  beforeEach(() => {
    initializeStore();
  });

  it("uses the referenced elements for name and description", async () => {
    render(
      <>
        <span id="line-name">1</span>
        <span id="line-desc">Wages, salaries, tips</span>
        <FormBoxContent
          instance={INSTANCE}
          box={INPUT_BOX}
          ariaLabelledBy="line-name"
          ariaDescribedBy="line-desc"
        />
      </>,
    );

    const input = await screen.findByRole("textbox");
    expect(input).toHaveAccessibleName("1");
    expect(input).toHaveAccessibleDescription("Wages, salaries, tips");
  });
});

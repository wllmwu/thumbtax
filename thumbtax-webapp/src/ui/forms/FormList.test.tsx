import { render, renderHook, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { makeRegistryFixture } from "#src/specifications/test/fixtures";
import {
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { FormList } from "#src/ui/forms/FormList";

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
  maxInstances: 1,
  sections: [
    {
      lines: [
        {
          index: "1",
          box: { identifier: "1", value: { type: "number_input" } },
        },
      ],
    },
  ],
};

const INSTANCE: FormInstance = {
  id: "instance-1",
  class: TEST_CLASS,
  label: "Form W-2",
  inputs: {},
};

function initializeStore() {
  const applicationState: ApplicationState = {
    filingStatus: "single",
    formClasses: [TEST_CLASS],
    formInstances: { [TEST_CLASS]: [INSTANCE] },
  };
  const registry = makeRegistryFixture({ [TEST_CLASS]: SPECIFICATION });
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    applicationState,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    registry,
  );
}

describe("FormList", () => {
  beforeEach(() => {
    initializeStore();
  });

  it("names the move buttons with the form title", async () => {
    render(<FormList />);

    expect(
      await screen.findByRole("button", { name: "Move up Form W-2" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Move down Form W-2" }),
    ).toBeInTheDocument();
  });
});

import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { makeRegistryFixture } from "#src/test/specificationFixtures";
import { LoadErrorBanner } from "#src/ui/forms/LoadErrorBanner";

import type { LoadError } from "#src/persistence/types/loadError";

function initializeStore(loadErrors: LoadError[] = []) {
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    DEFAULT_APPLICATION_STATE,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    makeRegistryFixture(),
    loadErrors,
  );
}

function renderLoadErrors() {
  return renderHook(() => useStore((state) => state.loadErrors));
}

beforeEach(() => {
  // jsdom doesn't implement scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn();
  initializeStore();
});

describe("LoadErrorBanner", () => {
  it("renders nothing when there are no load errors", () => {
    render(<LoadErrorBanner />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders a message for each load error", () => {
    initializeStore([
      { type: "invalid_json" },
      { type: "tax_year_mismatch", saved: 2023, current: 2026 },
    ]);

    render(<LoadErrorBanner />);

    expect(screen.getByText("Expected JSON object")).toBeInTheDocument();
    expect(
      screen.getByText("Expected tax year 2026, received 2023"),
    ).toBeInTheDocument();
  });

  it("lists individual validation issues as a nested list", () => {
    initializeStore([
      {
        type: "validation_failed",
        issues: [
          { path: "applicationState.filingStatus", message: "Required" },
          {
            path: "applicationState.formClasses.0",
            message: "Invalid form class",
          },
        ],
      },
    ]);

    render(<LoadErrorBanner />);

    expect(
      screen.getByText("applicationState.filingStatus: Required"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("applicationState.formClasses.0: Invalid form class"),
    ).toBeInTheDocument();
  });

  it("renders as an alert and moves focus into it", () => {
    initializeStore([{ type: "invalid_json" }]);

    render(<LoadErrorBanner />);

    expect(screen.getByRole("alert")).toHaveFocus();
  });

  it("scrolls itself into view when it appears", () => {
    initializeStore([{ type: "invalid_json" }]);

    render(<LoadErrorBanner />);

    expect(screen.getByRole("alert").scrollIntoView).toHaveBeenCalled();
  });

  it("clears all load errors and hides itself when the dismiss button is pressed", async () => {
    initializeStore([
      { type: "invalid_json" },
      { type: "missing_schema_version" },
    ]);
    const user = userEvent.setup();
    const { result: loadErrors } = renderLoadErrors();

    render(<LoadErrorBanner />);
    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(loadErrors.current).toEqual([]);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";

import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { makeRegistryFixture } from "#src/test/specificationFixtures";
import { PageWithTableOfContents } from "#src/ui/table-of-contents/PageWithTableOfContents";

import type { UiState } from "#src/state/types/uiState";

const HEADINGS = [{ id: "fW2", label: "W-2" }];

function initializeStore(uiState: UiState = DEFAULT_UI_STATE) {
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    DEFAULT_APPLICATION_STATE,
    uiState,
    DEFAULT_USER_PREFERENCES,
    makeRegistryFixture(),
  );
}

function renderComponent() {
  return render(
    <MemoryRouter>
      <PageWithTableOfContents headings={HEADINGS}>
        <p>Page content</p>
      </PageWithTableOfContents>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  initializeStore();
});

describe("PageWithTableOfContents", () => {
  it("renders the page content", () => {
    renderComponent();

    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("shows the table of contents expanded by default", () => {
    renderComponent();

    expect(
      screen.getByRole("button", { name: "Hide table of contents" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "W-2" })).toBeInTheDocument();
  });

  it("starts collapsed when the stored state says so", () => {
    initializeStore({ ...DEFAULT_UI_STATE, tableOfContentsExpanded: false });
    renderComponent();

    expect(
      screen.getByRole("button", { name: "Show table of contents" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "W-2" })).not.toBeInTheDocument();
  });

  it("collapses and updates the store when the expanded trigger is pressed", async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() =>
      useStore((state) => state.uiState.tableOfContentsExpanded),
    );
    renderComponent();

    await user.click(
      screen.getByRole("button", { name: "Hide table of contents" }),
    );

    expect(
      await screen.findByRole("button", { name: "Show table of contents" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "W-2" })).not.toBeInTheDocument();
    expect(result.current).toBe(false);
  });

  it("expands and updates the store when the collapsed trigger is pressed", async () => {
    const user = userEvent.setup();
    initializeStore({ ...DEFAULT_UI_STATE, tableOfContentsExpanded: false });
    const { result } = renderHook(() =>
      useStore((state) => state.uiState.tableOfContentsExpanded),
    );
    renderComponent();

    await user.click(
      screen.getByRole("button", { name: "Show table of contents" }),
    );

    expect(
      await screen.findByRole("button", { name: "Hide table of contents" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "W-2" })).toBeInTheDocument();
    expect(result.current).toBe(true);
  });
});

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
import { Page } from "#src/ui/pages/Page";

import type { UiState } from "#src/state/types/uiState";

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
      <Page headings={[{ id: "a", label: "Heading A" }]}>
        <p>Page content</p>
      </Page>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  initializeStore();
});

describe("Page", () => {
  it("renders the page content", async () => {
    renderComponent();

    expect(await screen.findByText("Page content")).toBeInTheDocument();
  });

  it("shows the table of contents expanded", async () => {
    renderComponent();

    expect(
      await screen.findByRole("button", { name: "Hide table of contents" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Heading A" }),
    ).toBeInTheDocument();
  });

  it("shows the table of contents collapsed", async () => {
    initializeStore({ ...DEFAULT_UI_STATE, tableOfContentsExpanded: false });
    renderComponent();

    expect(
      await screen.findByRole("button", { name: "Show table of contents" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("collapses the table of contents when the trigger is pressed", async () => {
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
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(result.current).toBe(false);
  });

  it("expands the table of contents when the trigger is pressed", async () => {
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
    expect(screen.getByRole("link", { name: "Heading A" })).toBeInTheDocument();
    expect(result.current).toBe(true);
  });
});

import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TAX_YEARS } from "@thumbtax/common";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { makeSpecificationsByYearFixture } from "#src/test/specificationFixtures";
import { TaxYearSelector } from "#src/ui/control-bar/TaxYearSelector";

import type { TaxYear } from "@thumbtax/common";
import type { ApplicationState } from "#src/state/types/applicationState";

const STATE_WITH_FORMS: ApplicationState = {
  taxYear: 2026,
  filingStatus: "married_filing_separately",
  formClasses: ["f1099INT"],
  formInstances: {
    f1099INT: [
      {
        id: "int-1",
        class: "f1099INT",
        label: "Credit union",
        inputs: { interest: { type: "number", value: 310 } },
      },
    ],
  },
};

function initializeStore(applicationState: ApplicationState) {
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    applicationState,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    makeSpecificationsByYearFixture(),
  );
}

function initializeEmptyStore(taxYear: TaxYear) {
  initializeStore({
    taxYear,
    filingStatus: "single",
    formClasses: [],
    formInstances: {},
  });
}

function renderStore() {
  return renderHook(() => useStore((state) => state));
}

async function chooseYear(taxYear: TaxYear) {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /Tax year/ }));
  await user.click(
    await screen.findByRole("option", { name: String(taxYear) }),
  );
  return user;
}

describe("TaxYearSelector", () => {
  it("shows the selected year with a visible label", () => {
    initializeEmptyStore(2025);

    render(<TaxYearSelector />);

    expect(screen.getByText("Tax year")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tax year/ })).toHaveTextContent(
      "2025",
    );
  });

  it("lists every supported year newest first, with the selected year marked as selected", async () => {
    initializeEmptyStore(2025);
    const user = userEvent.setup();
    render(<TaxYearSelector />);

    await user.click(screen.getByRole("button", { name: /Tax year/ }));

    const options = await screen.findAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual(
      TAX_YEARS.toSorted((a, b) => b - a).map(String),
    );
    for (const option of options) {
      expect(option).toHaveAttribute(
        "aria-selected",
        option.textContent === "2025" ? "true" : "false",
      );
    }
  });

  it("switches immediately without confirmation when no forms are added", async () => {
    initializeEmptyStore(2026);
    const { result, rerender } = renderStore();
    render(<TaxYearSelector />);

    await chooseYear(2025);

    rerender();
    expect(result.current.applicationState.taxYear).toBe(2025);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tax year/ })).toHaveTextContent(
      "2025",
    );
  });

  it("does nothing when the selected year is chosen", async () => {
    initializeStore(STATE_WITH_FORMS);
    const { result, rerender } = renderStore();
    render(<TaxYearSelector />);

    await chooseYear(2026);

    rerender();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(result.current.applicationState).toBe(STATE_WITH_FORMS);
    expect(result.current.history.past).toEqual([]);
  });

  it("asks for confirmation before switching when forms are added", async () => {
    initializeStore(STATE_WITH_FORMS);
    const { result, rerender } = renderStore();
    render(<TaxYearSelector />);

    await chooseYear(2025);

    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toHaveAccessibleName("Switch to tax year 2025?");
    expect(dialog).toHaveAccessibleDescription(
      "If any tax forms have different inputs between 2026 and 2025, the data you entered for those inputs in 2026 might not be present in 2025.",
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Switch to 2025" }),
    ).toBeInTheDocument();
    rerender();
    expect(result.current.applicationState.taxYear).toBe(2026);
  });

  it("switches the year and keeps all other data when confirmed", async () => {
    initializeStore(STATE_WITH_FORMS);
    const { result, rerender } = renderStore();
    render(<TaxYearSelector />);

    const user = await chooseYear(2025);
    await user.click(
      await screen.findByRole("button", { name: "Switch to 2025" }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    rerender();
    expect(result.current.applicationState).toEqual({
      ...STATE_WITH_FORMS,
      taxYear: 2025,
    });
  });

  it("keeps the year when canceled", async () => {
    initializeStore(STATE_WITH_FORMS);
    const { result, rerender } = renderStore();
    render(<TaxYearSelector />);

    const user = await chooseYear(2025);
    await user.click(await screen.findByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    rerender();
    expect(result.current.applicationState).toBe(STATE_WITH_FORMS);
  });

  it("keeps the year when Escape is pressed", async () => {
    initializeStore(STATE_WITH_FORMS);
    const { result, rerender } = renderStore();
    render(<TaxYearSelector />);

    const user = await chooseYear(2025);
    await screen.findByRole("alertdialog");
    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    rerender();
    expect(result.current.applicationState).toBe(STATE_WITH_FORMS);
  });

  it("traps focus inside the confirmation dialog", async () => {
    initializeStore(STATE_WITH_FORMS);
    render(<TaxYearSelector />);

    const user = await chooseYear(2025);
    const dialog = await screen.findByRole("alertdialog");
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    );

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});

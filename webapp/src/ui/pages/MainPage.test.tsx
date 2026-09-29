import { act, render, renderHook, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { makeSpecificationsByYearFixture } from "#src/test/specificationFixtures";
import { MainPage } from "#src/ui/pages/MainPage";

describe("MainPage", () => {
  it("includes the selected tax year in the heading", () => {
    const { result } = renderHook(() => useStore((state) => state));
    result.current.initialize(
      { ...DEFAULT_APPLICATION_STATE, taxYear: 2025 },
      DEFAULT_UI_STATE,
      DEFAULT_USER_PREFERENCES,
      makeSpecificationsByYearFixture(),
    );

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "2025 tax forms" }),
    ).toBeInTheDocument();

    act(() => {
      result.current.setTaxYear(2026);
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "2026 tax forms" }),
    ).toBeInTheDocument();
  });
});

import React from "react";

import { FILING_STATUSES, isFilingStatus } from "@thumbtax/common";

import { useStore } from "#src/state/useStore";
import { formatFilingStatus } from "#src/ui/formatting/formatFilingStatus";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";

export function FilingStatusSelector() {
  const filingStatus = useStore((state) => state.applicationState.filingStatus);
  const setFilingStatus = useStore((state) => state.setFilingStatus);

  const handleChange = React.useCallback(
    (value: string) => {
      if (isFilingStatus(value)) {
        setFilingStatus(value);
      }
    },
    [setFilingStatus],
  );

  return (
    <SelectField
      label="Filing status"
      value={filingStatus}
      onChange={handleChange}
    >
      {FILING_STATUSES.map((value) => (
        <SelectFieldItem key={value} id={value}>
          {formatFilingStatus(value)}
        </SelectFieldItem>
      ))}
    </SelectField>
  );
}

import React from "react";

import {
  Button,
  Collection,
  Label,
  Menu,
  MenuItem,
  type MenuItemProps,
  MenuTrigger,
  Popover,
} from "react-aria-components";

import { FILING_STATUSES } from "#src/common/types/filingStatus";
import { useStore } from "#src/state/useStore";
import { formatFilingStatus } from "#src/ui/formatters/formatFilingStatus";

export function FilingStatusSelector() {
  const filingStatus = useStore((state) => state.applicationState.filingStatus);
  const setFilingStatus = useStore((state) => state.setFilingStatus);

  const options = React.useMemo(() => {
    return FILING_STATUSES.map<MenuItemProps>((value) => ({
      id: `filing-status-selector-option-${value}`,
      "aria-label": `Set filing status to ${formatFilingStatus(value)}`,
      onAction: () => setFilingStatus(value),
      children: formatFilingStatus(value),
    }));
  }, [setFilingStatus]);

  const OptionItem = React.useCallback(
    (props: MenuItemProps) => <MenuItem {...props} />,
    [],
  );

  return (
    <MenuTrigger>
      <Label>
        Filing status<Button>{formatFilingStatus(filingStatus)}</Button>
      </Label>
      <Popover>
        <Menu>
          <Collection items={options}>{OptionItem}</Collection>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

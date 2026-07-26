import classNames from "classnames";
import { Popover } from "react-aria-components";

import styles from "#src/ui/primitives/AriaPopover.module.css";

import type React from "react";
import type { PopoverProps } from "react-aria-components";

export function AriaPopover({
  className,
  ...props
}: PopoverProps): React.ReactNode {
  return (
    <Popover className={classNames(styles.popover, className)} {...props} />
  );
}

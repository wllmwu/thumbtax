import classNames from "classnames";
import { Button as AriaButton } from "react-aria-components";

import styles from "#src/ui/primitives/Button.module.css";

import type React from "react";
import type { ButtonProps } from "react-aria-components";

type Props = ButtonProps & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  variant = "secondary",
  ...props
}: Props): React.ReactNode {
  return (
    <AriaButton
      className={classNames(styles.button, className)}
      data-variant={variant}
      {...props}
    />
  );
}

import classNames from "classnames";
import { Button } from "react-aria-components";

import styles from "#src/ui/primitives/AriaButton.module.css";

import type React from "react";
import type { ButtonProps } from "react-aria-components";

type Props = ButtonProps & {
  variant?: "primary" | "secondary";
};

export function AriaButton({
  className,
  variant = "secondary",
  ...props
}: Props): React.ReactNode {
  return (
    <Button
      className={classNames(styles.button, className)}
      data-variant={variant}
      {...props}
    />
  );
}

import { Button } from "react-aria-components";

import type React from "react";
import type { ButtonProps } from "react-aria-components";

type Props = ButtonProps & {
  variant?: "primary" | "secondary";
};

export function AriaButton({
  variant = "secondary",
  ...props
}: Props): React.ReactNode {
  return <Button data-variant={variant} {...props} />;
}

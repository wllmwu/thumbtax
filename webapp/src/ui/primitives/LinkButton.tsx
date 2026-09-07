import classNames from "classnames";

import { Link } from "#src/ui/primitives/Link";

import type { AriaButton } from "#src/ui/primitives/AriaButton";
import type React from "react";

type Props = React.ComponentProps<typeof Link> &
  Pick<React.ComponentProps<typeof AriaButton>, "variant">;

export function LinkButton({
  className,
  variant = "secondary",
  ...props
}: Props): React.ReactNode {
  return (
    <Link
      className={classNames("react-aria-Button", className)}
      data-variant={variant}
      {...props}
    />
  );
}

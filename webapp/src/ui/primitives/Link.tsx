import { Link as AriaLink } from "react-aria-components";
import { Link as RouterLink } from "react-router";

import type { LinkProps as AriaLinkProps } from "react-aria-components";

type Props = AriaLinkProps;

export function Link(props: Props): React.ReactNode {
  return (
    <AriaLink
      {...props}
      render={(domProps) =>
        "href" in domProps && !props.isDisabled ? (
          <RouterLink {...domProps} to={domProps.href} />
        ) : (
          <span {...domProps} />
        )
      }
    />
  );
}

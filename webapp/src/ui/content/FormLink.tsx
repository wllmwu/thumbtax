import React from "react";

import { useStore } from "#src/state/useStore";
import { Link } from "#src/ui/primitives/Link";

import type { FormClass } from "@thumbtax/common";

type Props = {
  "aria-label"?: string;
  children: React.ReactNode;
  formClass: FormClass;
};

export function FormLink({
  "aria-label": ariaLabel,
  children,
  formClass,
}: Props): React.ReactNode {
  const allInstances = useStore(
    (state) => state.applicationState.formInstances,
  );

  const classIsPresent = React.useMemo(() => {
    const instances = allInstances[formClass];
    return instances !== undefined && instances.length > 0;
  }, [allInstances, formClass]);

  return (
    <Link
      aria-label={ariaLabel}
      href={`#${formClass}`}
      isDisabled={!classIsPresent}
    >
      {children}
    </Link>
  );
}

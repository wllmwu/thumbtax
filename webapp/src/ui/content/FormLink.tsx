import React from "react";

import { Link } from "react-aria-components";

import { useStore } from "#src/state/useStore";

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
      href={`#${formClass}`}
      aria-label={ariaLabel}
      isDisabled={!classIsPresent}
    >
      {children}
    </Link>
  );
}

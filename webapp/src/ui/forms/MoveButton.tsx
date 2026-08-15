import React from "react";

import { absurd } from "@thumbtax/common";
import {
  MoveDownIcon,
  MoveLeftIcon,
  MoveRightIcon,
  MoveUpIcon,
} from "lucide-react";

import { IconButton } from "#src/ui/primitives/IconButton";

type Props = Omit<React.ComponentProps<typeof IconButton>, "icon" | "label"> & {
  axis: "block" | "inline";
  direction: "backward" | "forward";
};

export function MoveButton({
  axis,
  direction,
  ...props
}: Props): React.ReactNode {
  const { icon, label } = React.useMemo(() => {
    const combined = `${axis}-${direction}` as const;
    switch (combined) {
      case "block-backward":
        return { icon: MoveUpIcon, label: "Move up" };
      case "block-forward":
        return { icon: MoveDownIcon, label: "Move down" };
      case "inline-backward":
        return { icon: MoveLeftIcon, label: "Move left" };
      case "inline-forward":
        return { icon: MoveRightIcon, label: "Move right" };
      default:
        return absurd(combined);
    }
  }, [axis, direction]);

  return <IconButton icon={icon} label={label} {...props} />;
}

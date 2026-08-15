import { OverlayArrow, Tooltip, TooltipTrigger } from "react-aria-components";

import { AriaButton } from "#src/ui/primitives/AriaButton";

import type { LucideIcon } from "lucide-react";
import type React from "react";
import type { ButtonProps, TooltipProps } from "react-aria-components";

type Props = Omit<ButtonProps, "aria-label" | "children"> & {
  icon: LucideIcon;
  label: string;
  tooltipPlacement?: TooltipProps["placement"];
};

export function IconButton({
  icon: Icon,
  label,
  tooltipPlacement,
  ...props
}: Props): React.ReactNode {
  return (
    <TooltipTrigger closeDelay={0} delay={0}>
      <AriaButton {...props} aria-label={label}>
        <Icon />
      </AriaButton>
      <Tooltip placement={tooltipPlacement}>
        <OverlayArrow>
          <svg width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
}

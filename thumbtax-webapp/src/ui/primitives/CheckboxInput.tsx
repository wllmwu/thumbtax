import { Checkbox } from "react-aria-components";

import type { InputProps } from "#src/ui/types/inputProps";

type Props = InputProps<boolean> & {
  "data-testid"?: string;
};

export function CheckboxInput({
  label,
  "aria-label": ariaLabel,
  value,
  onChange,
  "data-testid": dataTestId,
}: Props) {
  return (
    <Checkbox
      aria-label={!label ? ariaLabel : undefined}
      isSelected={value}
      onChange={onChange}
      data-testid={dataTestId}
    >
      {`${value}`}
      {label}
    </Checkbox>
  );
}

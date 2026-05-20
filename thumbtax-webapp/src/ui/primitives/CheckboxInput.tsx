import { Checkbox } from "react-aria-components";

type Props = {
  label?: React.ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
  "data-testid"?: string;
};

export function CheckboxInput({
  label,
  value,
  onChange,
  "data-testid": dataTestId,
}: Props) {
  return (
    <Checkbox isSelected={value} onChange={onChange} data-testid={dataTestId}>
      {`${value}`}
      {label}
    </Checkbox>
  );
}

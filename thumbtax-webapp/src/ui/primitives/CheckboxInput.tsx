import { Checkbox } from "react-aria-components";

type Props = {
  label?: React.ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function CheckboxInput({ label, value, onChange }: Props) {
  return (
    <Checkbox isSelected={value} onChange={onChange}>
      {`${value}`}
      {label}
    </Checkbox>
  );
}

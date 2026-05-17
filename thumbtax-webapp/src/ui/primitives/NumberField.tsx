import {
  FieldError,
  Input,
  Label,
  NumberField as AriaNumberField,
  Text,
} from "react-aria-components";

type Props = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
};

export function NumberField({
  label,
  description,
  errorMessage,
  value,
  onChange,
}: Props) {
  return (
    <AriaNumberField value={value} onChange={onChange}>
      {label && <Label>{label}</Label>}
      <Input />
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaNumberField>
  );
}

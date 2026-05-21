import {
  FieldError,
  Input,
  Label,
  NumberField as AriaNumberField,
  Text,
} from "react-aria-components";

type Props = {
  label?: React.ReactNode;
  "aria-label"?: string;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
};

export function NumberField({
  label,
  "aria-label": ariaLabel,
  description,
  errorMessage,
  value,
  onChange,
}: Props) {
  return (
    <AriaNumberField
      aria-label={!label ? ariaLabel : undefined}
      value={value}
      onChange={onChange}
      isInvalid={!!errorMessage}
    >
      {label && <Label>{label}</Label>}
      <Input />
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaNumberField>
  );
}

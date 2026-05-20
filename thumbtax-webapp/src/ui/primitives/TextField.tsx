import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
} from "react-aria-components";

type Props = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
};

export function TextField({
  label,
  description,
  errorMessage,
  value,
  onChange,
}: Props) {
  return (
    <AriaTextField value={value} onChange={onChange} isInvalid={!!errorMessage}>
      {label && <Label>{label}</Label>}
      <Input />
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaTextField>
  );
}

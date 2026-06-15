import React from "react";

import {
  FieldError,
  Label,
  RadioButton,
  RadioField,
  RadioGroup as AriaRadioGroup,
  Text,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";

export type RadioOption<TValue extends string> = {
  description?: React.ReactNode;
  disabled?: boolean;
  label: React.ReactNode;
  value: TValue;
};

type Props<TValue extends string> = Omit<FieldProps<TValue>, "placeholder"> & {
  options: Array<RadioOption<TValue>>;
};

export function RadioGroup<TValue extends string>({
  label,
  "aria-label": ariaLabel,
  description,
  disabled,
  readOnly,
  errorMessage,
  value: selectedValue,
  onChange,
  options,
}: Props<TValue>) {
  const handleChange = React.useCallback(
    (newValue: string) => {
      const matchedOption = options.find((option) => option.value === newValue);
      if (matchedOption?.value) {
        onChange(matchedOption.value);
      }
    },
    [onChange, options],
  );

  return (
    <AriaRadioGroup
      aria-label={!label ? ariaLabel : undefined}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
      value={selectedValue}
      onChange={handleChange}
    >
      {label && <Label>{label}</Label>}
      <div>
        {options.map((option) => (
          <RadioField isDisabled={option.disabled} value={option.value}>
            <RadioButton>
              {`${option.value === selectedValue}`}
              {option.label}
            </RadioButton>
            {option.description && (
              <Text slot="description">{option.description}</Text>
            )}
          </RadioField>
        ))}
      </div>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaRadioGroup>
  );
}

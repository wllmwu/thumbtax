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

function RadioGroupRender<TValue extends string>(
  {
    label,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    description,
    disabled,
    readOnly,
    errorMessage,
    value: selectedValue,
    onChange,
    name,
    options,
  }: Props<TValue>,
  ref: React.ForwardedRef<React.ComponentRef<typeof AriaRadioGroup>>,
) {
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
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
      value={selectedValue}
      onChange={handleChange}
      name={name}
    >
      {label && <Label>{label}</Label>}
      <div>
        {options.map((option) => (
          <RadioField
            key={option.value}
            isDisabled={option.disabled}
            value={option.value}
          >
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

export const RadioGroup = React.forwardRef(RadioGroupRender) as <
  TValue extends string,
>(
  props: Props<TValue> &
    React.RefAttributes<React.ComponentRef<typeof AriaRadioGroup>>,
) => React.ReactElement | null;

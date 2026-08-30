import React from "react";

import { CalendarDate } from "@internationalized/date";
import { CalendarDaysIcon } from "lucide-react";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarHeading,
  DateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  FieldError,
  Group,
  Label,
  Popover,
  Text,
} from "react-aria-components";
import { Temporal } from "temporal-polyfill";

import { AriaButton } from "#src/ui/primitives/AriaButton";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/primitives/DatePicker.module.css";

import type { FieldProps } from "#src/ui/types/fieldProps";
import type { InputProps } from "#src/ui/types/inputProps";

type Props = Omit<FieldProps<Temporal.PlainDate | null>, "placeholder"> &
  InputProps;

export function DatePicker({
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  autoFocus,
  description,
  disabled,
  errorMessage,
  label,
  onBlur,
  onChange,
  onFocus,
  readOnly,
  value,
}: Props): React.ReactNode {
  const renderDateSegment = React.useCallback<
    React.ComponentProps<typeof DateInput>["children"]
  >((segment) => <DateSegment segment={segment} />, []);
  const renderCalendarCell = React.useCallback<
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    React.ComponentProps<typeof CalendarGrid>["children"] & Function
  >((date) => <CalendarCell date={date} />, []);

  const ariaDateValue = React.useMemo(() => {
    return value && new CalendarDate(value.year, value.month, value.day);
  }, [value]);

  const handleChange = React.useCallback(
    (newValue: CalendarDate | null): void => {
      onChange(
        newValue &&
          new Temporal.PlainDate(newValue.year, newValue.month, newValue.day),
      );
    },
    [onChange],
  );

  return (
    <AriaDatePicker
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      autoFocus={autoFocus}
      isDisabled={disabled}
      isReadOnly={readOnly}
      onBlur={onBlur}
      onChange={handleChange}
      onFocus={onFocus}
      shouldForceLeadingZeros
      value={ariaDateValue}
    >
      {label && <Label>{label}</Label>}
      <Group className={racn(styles.group)}>
        <DateInput>{renderDateSegment}</DateInput>
        <AriaButton>
          <CalendarDaysIcon />
        </AriaButton>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      <Popover>
        <Calendar>
          <div className={styles.monthHeader}>
            <AriaButton slot="previous">Previous</AriaButton>
            <CalendarHeading />
            <AriaButton slot="next">Next</AriaButton>
          </div>
          <CalendarGrid>{renderCalendarCell}</CalendarGrid>
        </Calendar>
      </Popover>
    </AriaDatePicker>
  );
}

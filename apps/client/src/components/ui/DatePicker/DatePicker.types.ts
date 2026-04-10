import type { InputProps } from "../Input";

import { Calendar } from "@repo/ui/components";

export type CalendarProps = React.ComponentProps<typeof Calendar>;

export type Mode = NonNullable<CalendarProps["mode"]>;

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export type DatePickerValue<TMode extends Mode = Mode> =
  | (TMode extends "single" ? Date : TMode extends "multiple" ? Date[] : DateRange)
  | "";

export type DatePickerProps<TMode extends Mode = Mode> = {
  value: DatePickerValue<TMode>;
  onChange: (date: DatePickerValue<TMode>) => void;
  mode?: TMode;
  calendarProps?: Omit<CalendarProps, "required" | "mode">;
} & Omit<InputProps, "value" | "onChange">;

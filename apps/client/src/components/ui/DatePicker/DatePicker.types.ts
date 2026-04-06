import type { Ref } from "react";

import { Calendar } from "@repo/ui/components";

export type CalendarProps = React.ComponentProps<typeof Calendar>;

export type Mode = NonNullable<CalendarProps["mode"]>;

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export type Value<TMode extends Mode = Mode> =
  | (TMode extends "single" ? Date : TMode extends "multiple" ? Date[] : DateRange)
  | "";

export type DatePickerProps<TMode extends Mode = Mode> = {
  value: Value<TMode>;
  onChange: (date: Value<TMode>) => void;
  mode?: TMode;
  required?: boolean;
  ref?: Ref<HTMLInputElement>;
  placeholder?: string;
} & Omit<CalendarProps, "required" | "mode">;

import type { DatePickerProps, DatePickerValue, DateRange, Mode } from "./DatePicker.types";

import { Calendar, Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components";
import { useState } from "react";
import { LuCalendar } from "react-icons/lu";

import Button from "../Button";
import Input from "../Input";
import { formatDate, isValidDate, normalizeValue } from "./DatePicker.utils";

function DatePicker<TMode extends Mode = "single">({
  value: valueProp,
  onChange,
  calendarProps,
  mode = "single" as TMode,
  ...props
}: DatePickerProps<TMode>) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(() => normalizeValue(valueProp));
  const [value, setValue] = useState(() => formatDate(valueProp));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
    const date = new Date(value);
    if (isValidDate(date) && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      onChange?.(date as DatePickerValue<TMode>);
      setMonth(date);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
    props.onKeyDown?.(e);
  };

  const handleCalendarSelect = (date: Date | Date[] | DateRange | undefined) => {
    if (date) {
      onChange?.(date as DatePickerValue<TMode>);
    }
    setValue(formatDate(date));
    setOpen(false);
  };

  return (
    <Input
      {...props}
      value={value}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      addons={{
        end: (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Select date">
                <LuCalendar />

                <span className="sr-only">Select date</span>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                {...calendarProps}
                mode={mode as "single"}
                selected={valueProp === "" ? undefined : (valueProp as Date)}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleCalendarSelect}
                aria-label="Calendar"
              />
            </PopoverContent>
          </Popover>
        ),
      }}
    />
  );
}

export default DatePicker;

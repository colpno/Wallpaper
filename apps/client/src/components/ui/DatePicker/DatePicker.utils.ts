import type { Mode, Value } from "./DatePicker.types";

import { format } from "date-fns";

export const dateFormat = "MM/dd/yyyy";

const isObject = (value: unknown): value is object => typeof value === "object" && value !== null;

export const formatDate = <TMode extends Mode = Mode>(date: Value<TMode> | undefined): string => {
  if (!date) return "";
  if (Array.isArray(date)) {
    return date.map((d) => format(d, dateFormat)).join(", ");
  }
  if (isObject(date) && "from" in date) {
    const from = date.from ? format(date.from, dateFormat) : "";
    const to = date.to ? format(date.to, dateFormat) : "";
    return `${from} - ${to}`;
  }
  return format(date, dateFormat);
};

export const isValidDate = <TMode extends Mode = Mode>(date: Value<TMode> | undefined): boolean => {
  if (!date) return false;
  if (Array.isArray(date)) {
    return date.every((d) => !isNaN(d.getTime()));
  }
  if (isObject(date) && "from" in date) {
    const fromValid = date.from ? !isNaN(date.from.getTime()) : false;
    const toValid = date.to ? !isNaN(date.to.getTime()) : true;
    return fromValid && toValid;
  }
  return !isNaN(date.getTime());
};

export const normalizeValue = <TMode extends Mode = Mode>(
  date: Value<TMode> | undefined
): Date | undefined => {
  if (!date) return undefined;
  if (Array.isArray(date)) {
    return date[0];
  }
  if (isObject(date) && "from" in date) {
    return date.from;
  }
  return date;
};

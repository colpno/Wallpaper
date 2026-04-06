import type { DatePickerProps, Mode } from "./DatePicker.types";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { describe, expect, it, vi } from "vitest";

import DatePicker from "./DatePicker";

const onChange = vi.fn();

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

const renderComponent = <TMode extends Mode>(
  props?: Partial<Omit<DatePickerProps<TMode>, "onChange">>
) => {
  render(<DatePicker value="" {...props} onChange={onChange} />);

  return {
    user: userEvent.setup(),
    input: screen.getByRole("textbox"),
    calendarTrigger: screen.getByRole("button", { expanded: false }),
  };
};

describe("DatePicker", () => {
  it("renders the component", () => {
    const { input, calendarTrigger } = renderComponent();

    expect(input).toBeInTheDocument();
    expect(calendarTrigger).toBeInTheDocument();
  });

  it("displays a single value", async () => {
    const value = new Date("1995-12-25");
    renderComponent({ value });

    expect(screen.getByDisplayValue(format(value, "yyyy-MM-dd"))).toBeInTheDocument();
  });

  it("displays multiple values", async () => {
    const values = [new Date("1995-12-25"), new Date("1990-05-15")];
    renderComponent({ mode: "multiple", value: values });

    expect(
      screen.getByDisplayValue(values.map((date) => format(date, "yyyy-MM-dd")).join(", "))
    ).toBeInTheDocument();
  });

  it("displays a range of values", async () => {
    const values = { from: new Date("1995-12-25"), to: new Date("1990-05-15") };
    renderComponent({ mode: "range", value: values });

    expect(
      screen.getByDisplayValue(`${formatDate(values.from)} - ${formatDate(values.to)}`)
    ).toBeInTheDocument();
  });

  it("displays value", async () => {
    const date = "1990-05-15";
    const { user, input } = renderComponent();

    await user.type(input, date);

    expect(screen.getByDisplayValue(date)).toBeInTheDocument();
  });

  it("calls onChange with the entered value", async () => {
    const date = "1990-05-15";
    const { user, input } = renderComponent();

    await user.type(input, date);

    expect(onChange).toHaveBeenCalledWith(new Date(date));
  });

  it("calls onChange with a selected value", async () => {
    const { user, calendarTrigger } = renderComponent();

    await user.click(calendarTrigger);

    const days = screen.getAllByRole("gridcell");
    const day = days[days.length - 15]!;
    expect(day).toBeDefined();

    await user.click(day.querySelector("button")!);

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it("calls onChange with multiple values", async () => {
    const { user, calendarTrigger } = renderComponent({ mode: "multiple" });

    for (let i = 0; i < 2; i++) {
      await user.click(calendarTrigger);

      const days = screen.getAllByRole("gridcell");
      const day = days[days.length - 20 - i]!;
      expect(day).toBeDefined();

      await user.click(day.querySelector("button")!);
    }

    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([expect.any(Date)]));
  });

  it("calls onChange with a range of values", async () => {
    const { user, calendarTrigger } = renderComponent({ mode: "range" });

    await user.click(calendarTrigger);

    const days = screen.getAllByRole("gridcell");
    const day = days[days.length - 20]!;
    expect(day).toBeDefined();

    await user.click(day.querySelector("button")!);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ from: expect.any(Date) }));
  });
});

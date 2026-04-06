import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import z from "zod";

import Form, { type FormProps } from "../../Form";
import DatePickerField from "./DatePickerField";

const onSubmit = vi.fn();

const renderComponent = (
  props?: Partial<Omit<FormProps<{ dob: Date | string }>, "children" | "onSubmit">>
) => {
  render(
    <Form schema={z.any()} {...props} onSubmit={onSubmit}>
      <DatePickerField name="dob" label="DoB" />
    </Form>
  );

  return {
    user: userEvent.setup(),
    submitBtn: screen.getByRole("button", { name: /submit/i }),
    input: screen.getByRole("textbox"),
    pickerTrigger: screen.getByRole("button", { expanded: false }),
  };
};

describe("DatePickerField", () => {
  it("renders the component", () => {
    const { input, pickerTrigger } = renderComponent();

    expect(input).toBeInTheDocument();
    expect(pickerTrigger).toBeInTheDocument();
  });

  it("displays value", async () => {
    const date = "1990-05-15";
    const { user, input } = renderComponent();

    await user.type(input, date);

    expect(screen.getByDisplayValue(date)).toBeInTheDocument();
  });

  it("displays default value if it is a string", async () => {
    const defaultValue = "2000-01-01";
    renderComponent({
      defaultValues: {
        dob: defaultValue,
      },
    });

    expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();
  });

  it("displays default value if it is a Date object", async () => {
    const defaultValue = new Date("1995-12-25");
    renderComponent({
      defaultValues: {
        dob: defaultValue,
      },
    });

    expect(screen.getByDisplayValue(format(defaultValue, "yyyy-MM-dd"))).toBeInTheDocument();
  });

  it("displays selected value", async () => {
    const { user, pickerTrigger } = renderComponent();

    await user.click(pickerTrigger);

    const days = screen.getAllByRole("gridcell");
    const day = days[days.length - 15]!;
    expect(day).toBeDefined();

    await user.click(day.querySelector("button")!);

    expect(screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/)).toBeInTheDocument();
  });

  it("fails validation", async () => {
    const error = "You must be at least 18 years old";
    const { user, submitBtn, input } = renderComponent({
      schema: z.object({
        dob: z.date(error),
      }),
    });

    await user.type(input, "hello");
    await user.click(submitBtn);

    expect(screen.getByText(new RegExp(error, "i"))).toBeInTheDocument();
  });

  it("submits correct value", async () => {
    const date = "1990-05-15";
    const { user, input, submitBtn } = renderComponent();

    await user.type(input, date);
    await user.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith({ dob: new Date(date) });
  });
});

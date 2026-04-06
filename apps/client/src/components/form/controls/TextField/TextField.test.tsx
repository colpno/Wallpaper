import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import z from "zod";

import Form, { type FormProps } from "../../Form";
import TextField from "./TextField";

const onSubmit = vi.fn();

const renderComponent = (
  props?: Partial<Omit<FormProps<{ name: string }>, "children" | "onSubmit">>
) => {
  render(
    <Form schema={z.any()} {...props} onSubmit={onSubmit}>
      <TextField name="name" label="Name" />
    </Form>
  );

  return {
    user: userEvent.setup(),
    input: screen.getByLabelText("Name"),
    submitBtn: screen.getByRole("button", { name: /submit/i }),
  };
};

describe("TextField", () => {
  it("renders the component", () => {
    const { input } = renderComponent();

    expect(input).toBeInTheDocument();
  });

  it("displays value", async () => {
    const value = "John Doe";
    const { user, input } = renderComponent();

    await user.type(input, value);

    expect(input).toHaveDisplayValue(value);
  });

  it("displays default value", async () => {
    const defaultValue = "default";
    const { input } = renderComponent({
      defaultValues: {
        name: defaultValue,
      },
    });

    expect(input).toHaveDisplayValue(defaultValue);
  });

  it("fails validation", async () => {
    const error = "Name is required";
    const { user, submitBtn } = renderComponent({
      schema: z.object({
        name: z.string().nonempty(error),
      }),
    });

    await user.click(submitBtn);

    expect(screen.getByText(new RegExp(error, "i"))).toBeInTheDocument();
  });

  it("submits correct value", async () => {
    const value = "John Doe";
    const { user, input, submitBtn } = renderComponent();

    await user.type(input, value);
    await user.click(submitBtn);

    expect(input).toHaveDisplayValue(value);
    expect(onSubmit).toHaveBeenCalledWith({ name: value });
  });
});

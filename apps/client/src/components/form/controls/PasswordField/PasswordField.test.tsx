import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import z from "zod";

import Form, { type FormProps } from "../../Form";
import PasswordField from "./PasswordField";

const onSubmit = vi.fn();

const renderComponent = (
  props?: Partial<Omit<FormProps<{ password: string }>, "children" | "onSubmit">>
) => {
  render(
    <Form schema={z.any()} {...props} onSubmit={onSubmit}>
      <PasswordField name="password" label="Name" />
    </Form>
  );

  return {
    user: userEvent.setup(),
    input: screen.getByLabelText("Name"),
    revealBtn: screen.getByRole("button", { name: /reveal password/i }),
    submitBtn: screen.getByRole("button", { name: /submit/i }),
  };
};

describe("PasswordField", () => {
  it("renders the component", () => {
    const { input } = renderComponent();

    expect(input).toBeInTheDocument();
  });

  it("displays value", async () => {
    const value = "JohnDoe";
    const { user, input } = renderComponent();

    await user.type(input, value);

    expect(input).toHaveDisplayValue(value);
  });

  it("displays default value", async () => {
    const defaultValue = "default";
    const { input } = renderComponent({
      defaultValues: {
        password: defaultValue,
      },
    });

    expect(input).toHaveDisplayValue(defaultValue);
  });

  it("reveals value", async () => {
    const value = "default";
    const { user, input, revealBtn } = renderComponent();

    await user.type(input, value);
    await user.click(revealBtn);

    expect(input).toHaveDisplayValue(value);
  });

  it("fails validation", async () => {
    const error = "Password is required";
    const { user, submitBtn } = renderComponent({
      schema: z.object({
        password: z.string().nonempty(error),
      }),
    });

    await user.click(submitBtn);

    expect(screen.getByText(new RegExp(error, "i"))).toBeInTheDocument();
  });

  it("submits correct value", async () => {
    const value = "JohnDoe";
    const { user, input, submitBtn } = renderComponent();

    await user.type(input, value);
    await user.click(submitBtn);

    expect(input).toHaveDisplayValue(value);
    expect(onSubmit).toHaveBeenCalledWith({ password: value });
  });
});

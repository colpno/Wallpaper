import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import z from "zod";

import Form, { type FormProps } from "../../Form";
import TextareaField from "./TextareaField";

const onSubmit = vi.fn();

const sample =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const renderComponent = (
  props?: Partial<Omit<FormProps<{ name: string }>, "children" | "onSubmit">>
) => {
  render(
    <Form schema={z.any()} {...props} onSubmit={onSubmit}>
      <TextareaField name="name" label="Name" />
    </Form>
  );

  return {
    user: userEvent.setup(),
    input: screen.getByLabelText("Name"),
    submitBtn: screen.getByRole("button", { name: /submit/i }),
  };
};

describe("TextareaField", () => {
  it("renders the component", () => {
    const { input } = renderComponent();

    expect(input).toBeInTheDocument();
  });

  it("displays value", async () => {
    const { user, input } = renderComponent();

    await user.type(input, sample);

    expect(input).toHaveDisplayValue(sample);
  });

  it("displays default value", async () => {
    const { input } = renderComponent({
      defaultValues: {
        name: sample,
      },
    });

    expect(input).toHaveDisplayValue(sample);
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
    const { user, input, submitBtn } = renderComponent();

    await user.type(input, sample);
    await user.click(submitBtn);

    expect(input).toHaveDisplayValue(sample);
    expect(onSubmit).toHaveBeenCalledWith({ name: sample });
  });
});

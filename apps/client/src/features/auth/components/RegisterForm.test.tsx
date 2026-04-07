import { TooltipProvider } from "@repo/ui/components";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";

import RegisterForm from "./RegisterForm";

// const onSubmit = vi.fn();

const renderComponent = (props?: React.ComponentProps<typeof RegisterForm>) => {
  const { getByRole, getByLabelText } = render(
    <TooltipProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RegisterForm {...props} />} />
        </Routes>
      </MemoryRouter>
    </TooltipProvider>
  );

  return {
    user: userEvent.setup(),
    submitBtn: getByRole("button", { name: "Submit button" }),
    emailField: getByRole("textbox", { name: "Email field" }),
    passwordField: getByLabelText("Password field"),
    birthdateField: getByRole("textbox", { name: "Birthdate field" }),
  };
};

describe("RegisterForm", () => {
  it("renders correctly", () => {
    const { submitBtn, emailField, passwordField, birthdateField } = renderComponent();

    expect(submitBtn).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(birthdateField).toBeInTheDocument();
  });

  it("submits values correctly", async () => {
    const email = "johndoe@gmail.com";
    const password = "aso#!idj1AH2938";
    const birthdate = "09/12/2000";

    const { user, submitBtn, emailField, passwordField, birthdateField } = renderComponent();

    await user.type(emailField, email);
    await user.type(passwordField, password);
    await user.type(birthdateField, birthdate);
    await user.click(submitBtn);

    expect(emailField).toHaveDisplayValue(email);
    expect(passwordField).toHaveDisplayValue(password);
    expect(birthdateField).toHaveDisplayValue(birthdate);
    // TODO: update onSubmit mock after integrating api
    // expect(onSubmit).toBeCalledWith({
    //   email,
    //   password,
    //   birthdate: new Date(birthdate),
    // });
  });

  it("failed to validate", async () => {
    const { user, submitBtn, emailField, passwordField } = renderComponent();

    await user.type(emailField, "johndoe");
    await user.type(passwordField, "123");
    await user.click(submitBtn);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Password must have at least 6 characters")).toBeInTheDocument();
    expect(screen.getByText("Invalid date")).toBeInTheDocument();
  });
});

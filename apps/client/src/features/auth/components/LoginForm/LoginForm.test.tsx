import type { AuthAPIs } from "@repo/types";
import { TooltipProvider } from "@repo/ui/components";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { type State, store } from "@/app/stores/useStore";
import { ROUTES } from "@/constants/common";
import { queryClient } from "@/test/variables";

import LoginForm from "./LoginForm";

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => ({
  ...((await importOriginal()) as typeof import("react-router")),
  useNavigate: () => mockNavigate,
}));

const mockMutateAsync = vi.fn();
vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...(await importOriginal()),
  useMutation: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));
const renderComponent = (props?: React.ComponentProps<typeof LoginForm>) => {
  const { getByRole, getByLabelText } = render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<LoginForm {...props} />} />
          </Routes>
        </MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  return {
    user: userEvent.setup(),
    submitBtn: getByRole("button", { name: "Submit button" }),
    emailField: getByRole("textbox", { name: "Email field" }),
    passwordField: getByLabelText("Password field"),
  };
};

describe("LoginForm", () => {
  it("renders correctly", () => {
    const { submitBtn, emailField, passwordField } = renderComponent();

    expect(submitBtn).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
  });

  it("submits values correctly", async () => {
    mockMutateAsync.mockResolvedValue({
      _id: "mkijsd6q1nd8vjkwklds9",
      email: "asdsa@gmail.com",
      username: "asd",
      avatarUrl: "http:asdas",
    } satisfies AuthAPIs.Login["response"]);

    const email = "johndoe@gmail.com";
    const password = "aso#!idj1AH2938";

    const { user, submitBtn, emailField, passwordField } = renderComponent();

    await user.type(emailField, email);
    await user.type(passwordField, password);

    expect(emailField).toHaveDisplayValue(email);
    expect(passwordField).toHaveDisplayValue(password);
    expect(store.getState().user).toBe(null);

    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toBeCalledWith({ email, password } satisfies AuthAPIs.Login["body"]);
      expect(mockNavigate).toBeCalledWith(ROUTES.HOME());
      expect(store.getState().user).toEqual({
        id: expect.any(String),
        username: expect.any(String),
        avatarUrl: expect.stringContaining("http"),
        email: expect.stringContaining("@"),
      } satisfies State["user"]);
    });
  });

  it("failed to validate", async () => {
    const { user, submitBtn, emailField, passwordField } = renderComponent();

    await user.type(emailField, "johndoe");
    await user.type(passwordField, "123");
    await user.click(submitBtn);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Password must have at least 6 characters")).toBeInTheDocument();
  });
});

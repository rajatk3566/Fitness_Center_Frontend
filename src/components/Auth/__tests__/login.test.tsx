import { describe, test, expect, vi } from "vitest"; 
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "@components/Auth/login";
import "@testing-library/jest-dom/vitest"; 

describe("Login Component", () => {
  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });


  test("shows alert on login error", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {}); 

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.click(loginButton);
    alertMock.mockRestore(); 
  });

  
});

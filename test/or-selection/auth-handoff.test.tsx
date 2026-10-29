import React from "react";
import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import { catalog } from "./fixtures";
const mockReplace = jest.fn();
const mockDispatch = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));
jest.mock("@/apiHooks.ts/auth/auth.api", () => ({
  useGetMe: () => ({ isLoading: false, isError: true }),
}));
jest.mock("@/redux/store", () => ({ useAppDispatch: () => mockDispatch }));
jest.mock("@/redux/slices/auth.slice", () => ({
  clearAuth: () => ({ type: "clear" }),
  setOrganization: () => ({ type: "set" }),
}));
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  mockReplace.mockReset();
});
test("auth redirect keeps the OR link and versions while clearing unrelated session data", async () => {
  const id = catalog().plans[0].planId;
  window.history.replaceState(
    {},
    "",
    "/create-organization?product=OR&or_pkgId=" +
      id +
      "&or_catalogVersion=1&or_itemVersion=1",
  );
  localStorage.setItem("old-auth", "discard");
  sessionStorage.setItem("old-session", "discard");
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthGuard redirectTo="/register">
        <div>private</div>
      </AuthGuard>
    </QueryClientProvider>,
  );
  await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/register"));
  expect(localStorage.getItem("product")).toBe("OR");
  expect(localStorage.getItem("or_pkgId")).toBe(id);
  expect(localStorage.getItem("or_catalogVersion")).toBe("1");
  expect(localStorage.getItem("or_itemVersion")).toBe("1");
  expect(localStorage.getItem("old-auth")).toBeNull();
  expect(sessionStorage.length).toBe(0);
});
test("storage failure does not prevent redirect to login", async () => {
  window.history.replaceState({}, "", "/create-organization?product=OR");
  const clear = jest
    .spyOn(Storage.prototype, "clear")
    .mockImplementation(() => {
      throw new Error("blocked storage");
    });
  try {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <AuthGuard>
          <div>private</div>
        </AuthGuard>
      </QueryClientProvider>,
    );
    await waitFor(() => expect(mockReplace).toHaveBeenCalled());
  } finally {
    clear.mockRestore();
  }
});

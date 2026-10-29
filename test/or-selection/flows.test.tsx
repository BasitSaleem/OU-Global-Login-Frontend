import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateOrgModal from "@/components/modals/CreateOrgModal";
import AddProductModal from "@/components/modals/AddProductModal";
import { request } from "@/utils/requestFunction";
import { catalog } from "./fixtures";

jest.mock("@/config/or.config", () => ({
  OR_ONBOARDING_ENABLED: true,
}));
// Product access from Owners Universe (Super Admin → Product access).
const mockAccess = {
  available: ["OI", "OP", "OR"],
  isPending: false,
  isError: false,
};
jest.mock("@/apiHooks.ts/productAccess/productAccess.api", () => ({
  useProductAvailability: () => {
    const loaded = !mockAccess.isPending && !mockAccess.isError;
    return {
      ...mockAccess,
      data: loaded ? mockAccess.available : undefined,
      isSuccess: loaded,
      isAvailable: (code: string) => mockAccess.available.includes(code),
    };
  },
}));
jest.mock("@/utils/requestFunction", () => ({
  ...jest.requireActual("@/utils/requestFunction"),
  request: jest.fn(),
}));
jest.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: unknown) => value,
}));
jest.mock("@/hooks/useToast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
const mockAdd = jest.fn();
const mockCreate = jest.fn();
jest.mock("@/apiHooks.ts/organization/organization.api", () => ({
  useCheckSubDomainAvailability: () => ({ data: true, isFetching: false }),
  useGenerateSubdomainSuggestions: () => ({
    data: [],
    isPending: false,
    isFetching: false,
  }),
  useAddProduct: () => ({ mutateAsync: mockAdd, isPending: false }),
  useCreateOrganization: () => ({ mutate: mockCreate, isPending: false }),
}));
jest.mock("@/apiHooks.ts/plans/plans.api", () => ({
  useGetAllPlans: () => ({
    isPending: false,
    data: {
      plans: [
        {
          id: "inventory-plan",
          type: "RETAIL",
          package_name: "BASIC",
          monthly_price: "29",
          free_trial_days: 14,
        },
      ],
    },
  }),
}));
jest.mock("@/apiHooks.ts/opPackages/opPackages.api", () => ({
  useGetOpPackages: () => ({
    isPending: false,
    data: [
      {
        id: "pulse-plan",
        tier: "STARTER",
        name: "Pulse Starter",
        monthly_price: "49",
        trial_days: 14,
      },
    ],
  }),
}));
jest.mock("@/components/pages/CreateOrganization/OpServicesSelector", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/SubdomainSuggestion", () => ({
  SubdomainSuggestion: () => null,
}));
jest.mock("@/components/AvailabilityStatus", () => ({
  AvailabilityStatus: () => null,
}));
jest.mock("@/components/modals/GenericModal", () => {
  const Modal = ({ children, isOpen }: any) =>
    isOpen ? <div>{children}</div> : null;
  Modal.Body = ({ children }: any) => <div>{children}</div>;
  return { Modal };
});
jest.mock("@/components/ui", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Input: ({ label, value, onChange, placeholder, onKeyDown }: any) => (
    <label>
      {label}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
    </label>
  ),
  LoadingSpinner: () => null,
  Dots: () => null,
  Loader: ({ text }: any) => <div>{text}</div>,
}));
const api = jest.mocked(request);
const rollout = jest.requireMock("@/config/or.config");
beforeEach(() => {
  api.mockReset();
  api.mockResolvedValue(catalog());
  mockAdd.mockReset();
  mockCreate.mockReset();
  rollout.OR_ONBOARDING_ENABLED = true;
  mockAccess.available = ["OI", "OP", "OR"];
  mockAccess.isPending = false;
  mockAccess.isError = false;
});
afterEach(cleanup);
function wrap(element: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(<QueryClientProvider client={client}>{element}</QueryClientProvider>);
  return client;
}
const noop = () => {};
const intent = {
  itemId: catalog().plans[0].planId,
  catalogVersion: 1,
  itemVersion: 1,
};
async function createOl(onSubmit = jest.fn(), initial: any = null) {
  const client = wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={onSubmit}
      initialProduct="OR"
      initialOrIntent={initial}
      isDirectFlow
    />,
  );
  await screen.findByRole("button", { name: /Starter.*49.99/ });
  fireEvent.change(screen.getByLabelText("Organization Name"), {
    target: { value: "Lead Company" },
  });
  return { client, onSubmit };
}
test("new organization shows all three OR tiers with exact prices and no unapproved trial", async () => {
  const { onSubmit } = await createOl();
  expect(screen.getAllByText("Select plan")).toHaveLength(3);
  expect(screen.queryByText(/Free Trial/)).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Sub-Domain Name")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Starter.*49.99/ }));
  fireEvent.click(screen.getByRole("button", { name: "Create" }));
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      product: ["OR"],
      packageId: null,
      orSelection: { kind: "subscription", ...intent },
    }),
  );
});
test("stale links require a fresh explicit selection", async () => {
  const { onSubmit } = await createOl(jest.fn(), {
    ...intent,
    catalogVersion: 55,
    itemVersion: 55,
  });
  expect(screen.getByRole("alert")).toHaveTextContent("no longer current");
  expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: /Growth.*99.00/ }));
  fireEvent.click(screen.getByRole("button", { name: "Create" }));
  expect(onSubmit).toHaveBeenCalledTimes(1);
});
test("refreshing a published version invalidates the old selected plan", async () => {
  const { client, onSubmit } = await createOl(jest.fn(), intent);
  expect(screen.getByRole("button", { name: "Create" })).toBeEnabled();
  api.mockResolvedValue(catalog(2));
  await client.invalidateQueries({ queryKey: ["or-catalog-public"] });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Create" })).toBeDisabled(),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("no longer current");
  expect(onSubmit).not.toHaveBeenCalled();
});
test("catalog failure offers retry and blocks submission", async () => {
  api.mockRejectedValueOnce(new Error("offline"));
  wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={jest.fn()}
      initialProduct="OR"
      isDirectFlow
    />,
  );
  await screen.findByRole("alert");
  expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
  api.mockResolvedValue(catalog());
  fireEvent.click(
    screen.getByRole("button", { name: "Refresh Owners Reach plans" }),
  );
  await screen.findByRole("button", { name: /Starter.*49.99/ });
});
test("default activation gate prevents creation without changing the selected product", async () => {
  rollout.OR_ONBOARDING_ENABLED = false;
  const { onSubmit } = await createOl(jest.fn(), intent);
  expect(
    screen.getByText(/activation is not available yet/),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
  expect(onSubmit).not.toHaveBeenCalled();
});
test("add product uses the same catalog and excludes products already owned", async () => {
  wrap(
    <AddProductModal
      isOpen
      orgId="org"
      orgName="Existing Company"
      existingProducts={["OI"]}
      onClose={noop}
    />,
  );
  fireEvent.click(screen.getByText("Owners Reach"));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  await screen.findByRole("button", { name: /Starter.*49.99/ });
  fireEvent.click(screen.getByRole("button", { name: /Starter.*49.99/ }));
  fireEvent.click(screen.getByRole("button", { name: "Create" }));
  expect(mockAdd).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "Existing Company",
      product: ["OR"],
      packageId: null,
      orSelection: { kind: "subscription", ...intent },
    }),
  );
});
test("combined OI OP OR selection retains distinct IDs and configuration", async () => {
  const submitted = jest.fn();
  wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={submitted}
    />,
  );
  fireEvent.change(screen.getByLabelText("Organization Name"), {
    target: { value: "Combined Company" },
  });
  fireEvent.click(screen.getByText("Owners Pulse"));
  fireEvent.click(screen.getByText("Owners Reach"));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.change(screen.getByLabelText("Sub-Domain Name"), {
    target: { value: "combined" },
  });
  fireEvent.click(screen.getByRole("button", { name: /^Owners Pulse/ }));
  fireEvent.click(
    await screen.findByRole("button", { name: /Pulse Starter.*49/ }),
  );
  fireEvent.click(screen.getByRole("button", { name: /^Owners Reach/ }));
  fireEvent.click(
    await screen.findByRole("button", { name: /Starter.*49.99/ }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Create" }));
  expect(submitted).toHaveBeenCalledWith(
    expect.objectContaining({
      product: ["OI", "OP", "OR"],
      subDomainName: "combined",
      opPackageId: "pulse-plan",
      packageId: expect.any(String),
      orSelection: { kind: "subscription", ...intent },
    }),
  );
});
test("OI and OP flows still submit independently", async () => {
  for (const product of ["OI", "OP"]) {
    const submitted = jest.fn();
    wrap(
      <CreateOrgModal
        isOpen
        isLoading={false}
        onClose={noop}
        onSubmit={submitted}
        initialProduct={product}
        initialOpPkgId="pulse-plan"
        isDirectFlow
      />,
    );
    fireEvent.change(screen.getByLabelText("Organization Name"), {
      target: { value: "Existing Product" },
    });
    if (product === "OI")
      fireEvent.change(screen.getByLabelText("Sub-Domain Name"), {
        target: { value: "inventory" },
      });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(submitted).toHaveBeenCalledWith(
      expect.objectContaining({ product: [product], orSelection: undefined }),
    );
    cleanup();
  }
  expect(api).not.toHaveBeenCalled();
});

jest.mock("@/components/HOCs/auth-guard", () => ({
  AuthGuard: ({ children }: any) => <>{children}</>,
}));
jest.mock("@/apiHooks.ts/auth/auth.api", () => ({
  useLogout: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock("@/redux/store", () => ({ useAppDispatch: () => jest.fn() }));
jest.mock("@/redux/slices/auth.slice", () => ({ clearAuth: jest.fn() }));
jest.mock("@/components/ui/ProgressModal", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: { div: ({ children }: any) => <div>{children}</div> },
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

test("first organization page hydrates a saved OR intent before form initialization", async () => {
  const Page = require("@/app/create-organization/page").default;
  localStorage.setItem("product", "OR");
  localStorage.setItem("or_pkgId", intent.itemId);
  localStorage.setItem("or_catalogVersion", "1");
  localStorage.setItem("or_itemVersion", "1");
  try {
    wrap(<Page />);
    await screen.findByRole("button", { name: /Starter.*49.99/ });
    fireEvent.change(screen.getByLabelText("Organization Name"), {
      target: { value: "First OR Company" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        product: ["OR"],
        packageId: null,
        orSelection: { kind: "subscription", ...intent },
      }),
      expect.any(Object),
    );
    expect(screen.queryByLabelText("Sub-Domain Name")).not.toBeInTheDocument();
  } finally {
    localStorage.clear();
  }
});
test("an account without Owners Reach access does not fetch or substitute another product", () => {
  mockAccess.available = ["OI", "OP"];
  const submit = jest.fn();
  wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={submit}
      initialProduct="OR"
      productRequested
      initialOrIntent={intent}
      isDirectFlow
    />,
  );
  expect(
    screen.getByText(/Owners Reach is not available for your account/),
  ).toBeInTheDocument();
  expect(screen.queryByLabelText("Sub-Domain Name")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
  expect(api).not.toHaveBeenCalled();
});
test("create organization hides products the account cannot create and keeps coming-soon cards", () => {
  mockAccess.available = ["OI", "OP"];
  wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={jest.fn()}
    />,
  );
  expect(screen.getByText("Owners Inventory")).toBeInTheDocument();
  expect(screen.getByText("Owners Pulse")).toBeInTheDocument();
  expect(screen.queryByText("Owners Reach")).not.toBeInTheDocument();
  expect(screen.getByText("Owners Marketplace")).toBeInTheDocument();
});
test("a product selected from a link stays visible so it can be removed", () => {
  mockAccess.available = ["OI", "OP"];
  wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={jest.fn()}
      initialProduct="OR"
      productRequested
    />,
  );
  fireEvent.click(screen.getByText("Owners Reach"));
  expect(screen.queryByText("Owners Reach")).not.toBeInTheDocument();
});
test("the default product is unselected when the account cannot create it, also after Reset", async () => {
  mockAccess.available = ["OP"];
  wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={jest.fn()}
    />,
  );
  await waitFor(() =>
    expect(screen.queryByText("Owners Inventory")).not.toBeInTheDocument(),
  );
  fireEvent.change(screen.getByLabelText("Organization Name"), {
    target: { value: "Pulse Company" },
  });
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  fireEvent.click(screen.getByText("Owners Pulse"));
  expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  await waitFor(() =>
    expect(screen.queryByText("Owners Inventory")).not.toBeInTheDocument(),
  );
  expect(screen.getByText("Owners Pulse")).toBeInTheDocument();
});
test("an account with no launched products is told to contact support", () => {
  mockAccess.available = [];
  wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={jest.fn()}
    />,
  );
  expect(
    screen.getByText(/No products are available for your account yet/),
  ).toBeInTheDocument();
  expect(screen.getByText("Owners Marketplace")).toBeInTheDocument();
});
test("products wait for access to load", () => {
  mockAccess.available = [];
  mockAccess.isPending = true;
  wrap(
    <CreateOrgModal
      isOpen
      isLoading={false}
      onClose={noop}
      onSubmit={jest.fn()}
      initialProduct=""
    />,
  );
  expect(screen.getByText("Loading your products…")).toBeInTheDocument();
  expect(screen.queryByText("Owners Inventory")).not.toBeInTheDocument();
});
test("add product hides Owners Reach without access but still offers its restore", () => {
  mockAccess.available = ["OI", "OP"];
  wrap(
    <AddProductModal
      isOpen
      orgId="org"
      orgName="Existing Company"
      existingProducts={["OI"]}
      onClose={noop}
    />,
  );
  expect(screen.getByText("Owners Inventory")).toBeInTheDocument();
  expect(screen.queryByText("Owners Reach")).not.toBeInTheDocument();
  cleanup();
  wrap(
    <AddProductModal
      isOpen
      orgId="org"
      orgName="Existing Company"
      existingProducts={["OI"]}
      removedProducts={[
        {
          id: "removed-or",
          product_name: "OR",
          canRestore: true,
          restoreUntil: "2099-01-01T00:00:00.000Z",
        },
      ]}
      onClose={noop}
    />,
  );
  fireEvent.click(screen.getByText("Owners Reach"));
  expect(screen.getByRole("button", { name: "Restore" })).toBeEnabled();
});

import { renderHook, waitFor } from "@testing-library/react";
import {
  resolveIncomingPackageSelection,
  persistPackageQuery,
  readStoredPackageSelection,
  clearStoredPackageSelection,
} from "@/utils/incomingPackageSelection";
import { useIncomingPackageSelection } from "@/hooks/useIncomingPackageSelection";
import { catalog } from "./fixtures";
let mockQuery = "";
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(mockQuery),
}));
beforeEach(() => {
  localStorage.clear();
  mockQuery = "";
});

test("preserves an OR selection through a login storage round trip without an OI default", () => {
  const plan = catalog().plans[0];
  persistPackageQuery(
    new URLSearchParams(
      `product=OR&or_pkgId=${plan.planId}&or_catalogVersion=1&or_itemVersion=1`,
    ),
  );
  const resolved = resolveIncomingPackageSelection(
    new URLSearchParams(),
    readStoredPackageSelection(),
  );
  expect(resolved.product).toBe("OR");
  expect(resolved.pkgId).toBeNull();
  expect(resolved.orIntent).toEqual({
    itemId: plan.planId,
    catalogVersion: 1,
    itemVersion: 1,
  });
  expect(resolved.hasDirectLink).toBe(true);
});
test("new links do not inherit stale package IDs from another stored intent", () => {
  localStorage.setItem("product", "OR");
  localStorage.setItem("or_pkgId", catalog().plans[0].planId);
  const result = resolveIncomingPackageSelection(
    new URLSearchParams("product=OR"),
    readStoredPackageSelection(),
  );
  expect(result.orIntent).toBeNull();
  expect(result.pkgId).toBeNull();
  persistPackageQuery(new URLSearchParams("product=OP&op_pkgId=pulse"));
  expect(localStorage.getItem("or_pkgId")).toBeNull();
});
test("OR generic package links never become Inventory or yearly subscriptions", () => {
  const value = resolveIncomingPackageSelection(
    new URLSearchParams("product=OR&pkgId=forged&billingCycle=yearly"),
    {},
  );
  expect(value.product).toBe("OR");
  expect(value.pkgId).toBeNull();
  expect(value.billingCycle).toBe("monthly");
  expect(value.orIntent).toEqual({
    itemId: "forged",
    catalogVersion: null,
    itemVersion: null,
  });
});
test("keeps Inventory and Pulse link semantics and rejects unknown product fallback", () => {
  expect(
    resolveIncomingPackageSelection(new URLSearchParams(), {}).product,
  ).toBe("OI");
  expect(
    resolveIncomingPackageSelection(
      new URLSearchParams("product=OI&pkgId=inventory&billingCycle=yearly"),
      {},
    ),
  ).toMatchObject({
    product: "OI",
    pkgId: "inventory",
    billingCycle: "yearly",
  });
  expect(
    resolveIncomingPackageSelection(
      new URLSearchParams("product=OP&op_pkgId=pulse&op_billingCycle=yearly"),
      {},
    ),
  ).toMatchObject({
    product: "OP",
    opPkgId: "pulse",
    opBillingCycle: "yearly",
    pkgId: null,
  });
  expect(
    resolveIncomingPackageSelection(new URLSearchParams("product=UNKNOWN"), {})
      .product,
  ).toBe("");
});
test("marks OI as a default only when nothing asked for a product", () => {
  expect(
    resolveIncomingPackageSelection(new URLSearchParams(), {}),
  ).toMatchObject({ product: "OI", productRequested: false });
  for (const query of ["product=OI", "pkgId=inventory", "op_pkgId=pulse", "or_pkgId=plan"])
    expect(
      resolveIncomingPackageSelection(new URLSearchParams(query), {})
        .productRequested,
    ).toBe(true);
  expect(
    resolveIncomingPackageSelection(new URLSearchParams(), { product: "OP" })
      .productRequested,
  ).toBe(true);
});
test("waits for stored intent before initializing product forms", async () => {
  localStorage.setItem("product", "OR");
  localStorage.setItem("or_pkgId", catalog().plans[0].planId);
  const { result } = renderHook(() => useIncomingPackageSelection());
  await waitFor(() => expect(result.current.isReady).toBe(true));
  expect(result.current.product).toBe("OR");
  expect(result.current.pkgId).toBeNull();
  clearStoredPackageSelection();
  expect(localStorage.length).toBe(0);
});
test("continues safely when browser storage is unavailable", async () => {
  mockQuery = "product=OR&or_pkgId=" + catalog().plans[0].planId;
  const get = jest
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation(() => {
      throw new Error("blocked");
    });
  const set = jest
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("blocked");
    });
  try {
    const { result } = renderHook(() => useIncomingPackageSelection());
    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.product).toBe("OR");
  } finally {
    get.mockRestore();
    set.mockRestore();
  }
});

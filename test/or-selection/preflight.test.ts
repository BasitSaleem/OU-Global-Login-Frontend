import { QueryClient } from "@tanstack/react-query";
import { request } from "@/utils/requestFunction";
import { prepareOrOrganizationSelection } from "@/apiHooks.ts/organization/orOrganizationSelection";
import { catalog } from "./fixtures";
jest.mock("@/config/or.config", () => ({
  OR_ONBOARDING_ENABLED: true,
}));
jest.mock("@/utils/requestFunction", () => ({
  ...jest.requireActual("@/utils/requestFunction"),
  request: jest.fn(),
}));
const rollout = jest.requireMock("@/config/or.config");
const api = jest.mocked(request);
const selection = {
  kind: "subscription" as const,
  itemId: catalog().plans[0].planId,
  catalogVersion: 1,
  itemVersion: 1,
};
beforeEach(() => {
  rollout.OR_ONBOARDING_ENABLED = true;
  api.mockReset();
  api.mockResolvedValue(catalog());
});
const client = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });
test("leaves OI/OP payloads intact and removes unselected OR metadata", async () => {
  const base = {
    name: "Company",
    packageId: "inventory",
    opPackageId: "pulse",
    product: ["OI", "OP"],
  };
  expect(
    await prepareOrOrganizationSelection(
      { ...base, orSelection: selection },
      client(),
    ),
  ).toEqual(base);
  expect(api).not.toHaveBeenCalled();
});
test("revalidates combined selection against current published terms without client amounts", async () => {
  const result = await prepareOrOrganizationSelection(
    {
      name: "Company",
      packageId: "inventory",
      opPackageId: "pulse",
      product: ["OI", "OP", "OR"],
      orSelection: selection,
    },
    client(),
  );
  expect(result.orSelection).toEqual(selection);
  expect(result.packageId).toBe("inventory");
  expect(result.opPackageId).toBe("pulse");
  expect(api).toHaveBeenCalledWith(
    "/or/catalog?currency=USD&cycle=monthly",
    "GET",
  );
  expect(JSON.stringify(result.orSelection)).not.toMatch(
    /price|amount|credits/i,
  );
});
test("refetches and rejects stale prices even if a catalog was cached", async () => {
  const cache = client();
  cache.setQueryData(["or-catalog-public"], catalog());
  api.mockResolvedValue(catalog(2));
  await expect(
    prepareOrOrganizationSelection(
      {
        name: "Company",
        packageId: null,
        product: ["OR"],
        orSelection: selection,
      },
      cache,
    ),
  ).rejects.toMatchObject({
    statusCode: 409,
    response: { code: "STALE_CATALOG" },
  });
});
test("rejects forged IDs and injected prices", async () => {
  for (const value of [
    { ...selection, itemId: "00000000-0000-4000-8000-000000000777" },
    { ...selection, amountMinor: 1 },
  ]) {
    await expect(
      prepareOrOrganizationSelection(
        {
          name: "Company",
          packageId: null,
          product: ["OR"],
          orSelection: value,
        },
        client(),
      ),
    ).rejects.toMatchObject({ statusCode: 409 });
  }
});
test("blocks OR requests when rollout is disabled", async () => {
  rollout.OR_ONBOARDING_ENABLED = false;
  await expect(
    prepareOrOrganizationSelection(
      {
        name: "Company",
        packageId: null,
        product: ["OR"],
        orSelection: selection,
      },
      client(),
    ),
  ).rejects.toThrow("not available");
  expect(api).not.toHaveBeenCalled();
});
test("fails closed when catalog is unavailable or malformed", async () => {
  api.mockRejectedValueOnce(new Error("offline"));
  await expect(
    prepareOrOrganizationSelection(
      {
        name: "Company",
        packageId: null,
        product: ["OR"],
        orSelection: selection,
      },
      client(),
    ),
  ).rejects.toThrow("offline");
  api.mockResolvedValue({ ...catalog(), privateMetadata: "not allowed" });
  await expect(
    prepareOrOrganizationSelection(
      {
        name: "Company",
        packageId: null,
        product: ["OR"],
        orSelection: selection,
      },
      client(),
    ),
  ).rejects.toThrow();
});

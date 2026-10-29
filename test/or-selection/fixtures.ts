import type { OrCatalog } from "@/apiHooks.ts/orCatalog/orCatalog.types";
export function catalog(version = 1): OrCatalog {
  return {
    schemaVersion: "1.0",
    catalogVersion: version,
    effectiveAt: "2026-10-01T00:00:00.000Z",
    plans: (["starter", "growth", "scale"] as const).map((code, index) => ({
      planId: `00000000-0000-4000-8000-${String(version * 10 + index).padStart(12, "0")}`,
      version,
      code,
      displayName: code[0].toUpperCase() + code.slice(1),
      currency: "USD",
      monthlyPriceMinor: [4999, 9900, 19900][index],
      includedCredits: 1000 * (index + 1),
      seats: index + 1,
      concurrentRuns: index + 1,
      trialDays: 14,
      trialCredits: 100,
    })),
    packs: [
      {
        packId: "00000000-0000-4000-8000-000000000099",
        version,
        priceMinor: 3900,
        credits: 1000,
      },
    ],
  };
}

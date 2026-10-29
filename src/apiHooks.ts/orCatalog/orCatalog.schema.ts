import { z } from "zod";

const integer = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const orPlanSelectionSchema = z
  .object({
    kind: z.literal("subscription"),
    itemId: z.string().uuid(),
    itemVersion: integer.min(1),
    catalogVersion: integer.min(1),
  })
  .strict();

export const orCatalogSchema = z
  .object({
    schemaVersion: z.literal("1.0"),
    catalogVersion: integer.min(1),
    effectiveAt: z.string().datetime(),
    plans: z
      .array(
        z
          .object({
            planId: z.string().uuid(),
            version: integer.min(1),
            code: z.enum(["starter", "growth", "scale"]),
            displayName: z.string().min(1),
            currency: z.literal("USD"),
            monthlyPriceMinor: integer,
            // Yearly price for comparison; null when the plan is not sold yearly.
            yearlyPriceMinor: integer.nullable().optional(),
            includedCredits: integer.min(1),
            seats: integer.min(1),
            concurrentRuns: integer.min(1),
            trialDays: integer.min(1),
            trialCredits: integer,
          })
          .strict(),
      )
      .length(3),
    packs: z
      .array(
        z
          .object({
            packId: z.string().uuid(),
            version: integer.min(1),
            priceMinor: integer,
            credits: integer.min(1),
          })
          .strict(),
      )
      .min(1)
      .max(20),
  })
  .strict()
  .superRefine((catalog, ctx) => {
    if (
      new Set(catalog.plans.map((plan) => plan.code)).size !== 3 ||
      new Set(catalog.plans.map((plan) => plan.planId)).size !== 3 ||
      [...catalog.plans, ...catalog.packs].some(
        (item) => item.version !== catalog.catalogVersion,
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid catalog versions or tiers",
      });
    }
  });

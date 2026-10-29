import type { z } from "zod";
import type {
  orCatalogSchema,
  orPlanSelectionSchema,
} from "./orCatalog.schema";

export type OrCatalog = z.infer<typeof orCatalogSchema>;
export type OrPlan = OrCatalog["plans"][number];
export type OrPlanSelection = z.infer<typeof orPlanSelectionSchema>;
export interface OrPlanIntent {
  itemId: string;
  catalogVersion: number | null;
  itemVersion: number | null;
}

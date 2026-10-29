// Build-time rollout controls. Enable only after the corresponding backend rollout.
// OR_SELECTION_ENABLED now only drives the home page tile. Create Organization and
// Add Product follow the account's product access from Owners Universe.
export const OR_SELECTION_ENABLED =
  process.env.NEXT_PUBLIC_OR_SELECTION_ENABLED === "true";
export const OR_ONBOARDING_ENABLED =
  process.env.NEXT_PUBLIC_OR_ONBOARDING_ENABLED === "true";
export const OR_PRODUCT_URL =
  process.env.NEXT_PUBLIC_OR_PRODUCT_URL || "http://localhost:5000";

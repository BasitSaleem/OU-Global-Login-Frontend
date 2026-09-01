/**
 * Client-side feature flags.
 *
 * Flip a flag to true to switch the feature on — no commented-out code, so the
 * work stays compiled, typechecked and reviewable while it waits.
 */

/**
 * Team invite page (/organization-details/[orgId]/team).
 *
 * ON HOLD. The page and its API wiring are finished and working, but the
 * feature is parked until GoHighLevel answer whether `UserCreate` fires for
 * sub-account users — that answer decides whether we build the GHL half of
 * this flow or drop it.
 *
 * While false: the Team tab is hidden from the org sidebar and the route
 * 404s. Flip to true to bring both back.
 *
 * Background: HANDOFF-GHL-WEBHOOK.md at the workspace root.
 */
export const TEAM_INVITE_ENABLED = false;

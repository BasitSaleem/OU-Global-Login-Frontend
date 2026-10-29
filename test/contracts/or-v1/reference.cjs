"use strict";
// Reference semantics for synthetic contract fixtures. Never use as application authorization.
function semanticValid(schema, value) {
  const isTimestamp = (s) =>
    typeof s === "string" &&
    Number.isFinite(Date.parse(s)) &&
    new Date(s).toISOString().slice(0, 19) === s.slice(0, 19);
  const datesValid = (x) => {
    if (!x || typeof x !== "object") return true;
    return Object.entries(x).every(([key, v]) => {
      if (v !== null && /(?:At|Until)$/.test(key) && typeof v === "string")
        return isTimestamp(v);
      return typeof v !== "object" || datesValid(v);
    });
  };
  if (!datesValid(value)) return false;
  if (schema === "Quote")
    return (
      value.estimatedCredits <= value.maxCredits && value.pipeline.status === "published"
    );
  if (schema === "AccessDecision")
    return (
      Date.parse(value.validUntil) >= Date.parse(value.checkedAt) &&
      Date.parse(value.validUntil) - Date.parse(value.checkedAt) <= 60000 &&
      (value.allowed
        ? value.reason === "ALLOWED" && value.role !== null
        : value.reason !== "ALLOWED")
    );
  if (schema === "Event")
    return (
      (!value.tenant || value.environment === value.tenant.environment) &&
      (value.eventType !== "or.credit.granted" ||
        value.policyVersion === value.data.policyVersion)
    );
  return true;
}
function permissionAllowed(actions, action, c) {
  const rule = actions.find((row) => row.action === action);
  if (
    !rule ||
    !rule.roles.includes(c.role) ||
    !c.userActive ||
    !c.membershipActive ||
    c.product !== "OR" ||
    !c.tenantMatches ||
    !c.environmentMatches
  )
    return false;
  if (rule.entitlement === "active" && c.entitlement !== "active") return false;
  if (
    rule.entitlement === "active-or-retained" &&
    !["active", "retained"].includes(c.entitlement)
  )
    return false;
  if (rule.fresh && !c.authorityAvailable) return false;
  if (
    !c.authorityAvailable &&
    (!Number.isFinite(c.cacheAgeSeconds) ||
      c.cacheAgeSeconds < 0 ||
      c.cacheAgeSeconds > 60)
  )
    return false;
  if (["run.cancel", "run.resume"].includes(action) && c.role === "MEMBER" && !c.ownsRun)
    return false;
  if (action === "credits.purchase" && !c.paidPlan) return false;
  return true;
}
function scopeDecision(fixture, actions, request) {
  if (request.issuer !== fixture.issuer) return "WRONG_ISSUER";
  if (request.environment !== fixture.environment) return "WRONG_ENVIRONMENT";
  const user = fixture.users.find((u) => u.subject === request.subject);
  if (!user || user.status !== "active") return "USER_INACTIVE";
  const product = fixture.products.find((p) => p.id === request.productId);
  if (
    !product ||
    product.orgId !== request.orgId ||
    request.resourceOrgId !== request.orgId
  )
    return "TENANT_MISMATCH";
  if (product.code !== "OR") return "WRONG_PRODUCT";
  if ((request.productStateOverride || product.state) !== "active")
    return "PRODUCT_INACTIVE";
  const membership = fixture.memberships.find(
    (m) =>
      m.subject === user.subject &&
      m.orgId === request.orgId &&
      m.productId === request.productId &&
      m.status === "active",
  );
  if (!membership) return "NO_MEMBERSHIP";
  const rule = actions.find((a) => a.action === request.action);
  if (!rule || !rule.roles.includes(membership.role)) return "ROLE_DENIED";
  const entitlement = request.entitlementOverride || product.entitlement;
  if (
    !(
      rule.entitlement === "active-or-retained" ? ["active", "retained"] : ["active"]
    ).includes(entitlement)
  )
    return "NO_ENTITLEMENT";
  if (
    !request.authorityAvailable &&
    (rule.fresh || request.cacheAgeSeconds > 60 || request.cacheAgeSeconds < 0)
  )
    return "AUTHORITY_UNAVAILABLE";
  return permissionAllowed(actions, request.action, {
    role: membership.role,
    userActive: true,
    membershipActive: true,
    product: "OR",
    tenantMatches: true,
    environmentMatches: true,
    entitlement,
    authorityAvailable: request.authorityAvailable,
    cacheAgeSeconds: request.cacheAgeSeconds,
    ownsRun: request.ownsRun,
    paidPlan: request.paidPlan,
  })
    ? "ALLOW"
    : "ROLE_DENIED";
}
module.exports = { semanticValid, permissionAllowed, scopeDecision };

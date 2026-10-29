"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
// This test bundle imports no application entry point, env loader, DB client or HTTP client.
const read = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, name), "utf8"));
const schema = read("schema.json"),
  fixtures = read("fixtures.json"),
  permissions = read("permissions.json");
const endpoints = read("endpoints.json"),
  scopes = read("tenant-fixtures.json"),
  manifest = read("manifest.json");
const validators = require("./validators.cjs");
const reference = require("./reference.cjs");
test("snapshot integrity: reject drift in any distributed file", () => {
  for (const [file, expected] of Object.entries(manifest.files)) {
    const actual = crypto
      .createHash("sha256")
      .update(fs.readFileSync(path.join(__dirname, file)))
      .digest("hex");
    assert.equal(actual, expected, file);
  }
});
test("each endpoint has locally available request/response validators", () => {
  for (const endpoint of endpoints) {
    for (const name of [endpoint.request, endpoint.response].filter(Boolean)) {
      assert.ok(schema.$defs[name], name);
      assert.equal(typeof validators[name], "function", name);
    }
  }
});
test("fixture IDs and schema definitions are complete", () => {
  const names = fixtures.cases.map((x) => x.name);
  assert.equal(new Set(names).size, names.length);
  for (const name of Object.keys(schema.$defs))
    assert.equal(typeof validators[name], "function", name);
});
for (const c of fixtures.cases)
  test("schema: " + c.name, () => {
    const validate = validators[c.schema];
    assert.equal(!!validate(c.data), c.valid, JSON.stringify(validate.errors));
  });
for (const c of fixtures.semanticCases)
  test("semantics: " + c.name, () => {
    assert.equal(reference.semanticValid(c.schema, c.data), c.valid);
  });
for (const c of permissions.cases)
  test("role: " + c.name, () => {
    assert.equal(
      reference.permissionAllowed(permissions.actions, c.action, c.context),
      c.allowed,
    );
  });
test("tenant fixture graph has valid unique identities and product memberships", () => {
  assert.equal(
    new Set(scopes.organizations.map((x) => x.id)).size,
    scopes.organizations.length,
  );
  assert.equal(new Set(scopes.products.map((x) => x.id)).size, scopes.products.length);
  assert.equal(new Set(scopes.users.map((x) => x.subject)).size, scopes.users.length);
  for (const m of scopes.memberships) {
    assert.ok(scopes.users.some((u) => u.subject === m.subject));
    assert.ok(scopes.organizations.some((o) => o.id === m.orgId));
    if (m.productId !== null)
      assert.ok(scopes.products.some((p) => p.id === m.productId && p.orgId === m.orgId));
  }
  assert.equal(scopes.products.filter((p) => p.code === "OR").length, 2);
  assert.ok(scopes.products.some((p) => p.code === "OI"));
  assert.ok(scopes.products.some((p) => p.code === "OP"));
});
for (const c of scopes.cases)
  test("tenant: " + c.name, () => {
    assert.equal(
      reference.scopeDecision(scopes, permissions.actions, c.request),
      c.expected,
    );
  });
test("impossible calendar timestamp is not accepted as a valid quote", () => {
  const quote = structuredClone(
    fixtures.cases.find((c) => c.schema === "Quote" && c.valid).data,
  );
  quote.expiresAt = "2026-02-30T00:00:00Z";
  assert.equal(reference.semanticValid("Quote", quote), false);
});
test("public engine schema cannot accept restricted execution metadata", () => {
  const privateConfig = fixtures.cases.find(
    (c) => c.schema === "PrivateEngineCatalog" && c.valid,
  ).data;
  assert.equal(validators.EngineCatalog(privateConfig), false);
});

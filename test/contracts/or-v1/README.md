# OR contract fixture bundle v1

Run `npm run test:or-contracts` or `node --test test/contracts/or-v1/contract.test.cjs` with Node 20+. No database, environment secrets, network, sibling repository, or installed npm dependencies are required to run these tests.

These synthetic tests validate contracts and reference permission rules, not application integration. Fixture-only overrides are not public request fields. Future application tests must exercise the same expected outcomes through real handlers.

Canonical source: `contracts/or/v1` in Owners Reach. Replicas: `test/contracts/or-v1` in all four repositories. Manifest hashes detect drift.

Regenerate with `node scripts/contracts/build.cjs <toolchain-root>` using Ajv 8.18.0 and esbuild 0.27.4. Generation alone needs those packages. Preserve the bundled Ajv license.

Synchronize with `node scripts/contracts/sync.cjs <backend-root> <admin-root> <portal-root>`; add `--check` for read-only verification. Owners Reach is always included. Commit the snapshots together.

Coverage includes two organizations, OR/OI/OP separation, suspended identities and memberships, organization-only membership, missing entitlements, retained access, billing restrictions, and authority outages. See OR-008 verification evidence in output/planning for existing regression baseline limitations.

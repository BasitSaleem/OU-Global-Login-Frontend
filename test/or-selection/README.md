# OR portal selection tests

Run from OU-Global-Login-Frontend:

```powershell
npm ci
npm run test:or-selection
npm run test:or-contracts
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/next/dist/bin/next build --webpack
```

The dedicated Jest config uses the repository's React runtime, jsdom and ts-jest. Separate TypeScript checks remain required; test transformation does not typecheck.

The four suites cover incoming selection parsing/hydration, auth redirect preservation, new/existing organization components, combined products, and fresh catalog preflight. They use synthetic published catalogs and mocked API/mutation boundaries. Shared plan cards and SetupStep are exercised; modal shells and unrelated UI/network dependencies are isolated. No real backend, payment or provider operation occurs.

Both OR rollout flags default off. Tests override them in memory only. Live OR onboarding requires the backend provisioning/access/payment tasks and owner review. See the OR repository output/planning/OR-016-Implementation.md for the request shape, flags, limits and dependency audit finding.

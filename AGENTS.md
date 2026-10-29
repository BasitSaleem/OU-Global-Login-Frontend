# Repository working conventions

Before implementing a change, read an existing neighboring feature end to end and identify the components, helpers and naming conventions to reuse. Follow this repository's patterns; do not transplant a different repository's architecture.

Keep routing, transport, validation, persistence and rendering responsibilities separate. Use descriptive product/feature filenames and readable formatting. Preserve existing behavior and versioned contracts during structural refactors. Do not rewrite applied migrations or rename persisted identifiers merely for style.

Shared OR contract snapshots under test/contracts/or-v1 are replicated from lead-gen-system/contracts/or/v1. Edit handwritten canonical sources there and synchronize with scripts/contracts/sync.cjs. Do not hand-edit generated validators.cjs or frozen baseline-schema fixtures.

Run the repository's configured checks and relevant behavior tests. Report any alternate-config or pre-existing failures separately. Update implementation references when files move.

## Owners Global Portal

- This is a Next.js App Router application. Route entries belong in src/app; reusable page sections belong in src/components/pages.
- Reuse src/components/ui exports and the existing AuthGuard/auth context.
- API query/mutation hooks and corresponding types belong in src/apiHooks.ts/<feature>/*.api.ts and *.types.ts. Reuse utils/requestFunction and established React Query patterns.
- References: src/app/create-organization/page.tsx, src/apiHooks.ts/plans/plans.api.ts and src/components/pages/CreateOrganization.
- Do not copy Super Admin's Vite page/service layout into this repository.

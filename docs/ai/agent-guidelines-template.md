# AI Extension Template

Use this file as an extension template. Do not duplicate global rules from `AGENTS.md`.

## Base rules

- Inherit all repository-wide rules from `AGENTS.md`.
- Only add rules here that are scope-specific or temporary.

## Scope

- Applies to: `<folders/files>`
- Does not apply to: `<folders/files>`

## Additional constraints (only deviations/additions)

- `<example: This area requires client components because it uses browser APIs>`
- `<example: Use service X instead of service Y in this folder>`

## Task context

- Feature/initiative: `<name>`
- Owner/team: `<team>`
- Expiry/review date: `<YYYY-MM-DD>`

## Validation for this scope

- Required commands: `<e.g. yarn test lib/utils/date.test.ts>`
- Additional checks: `<e.g. accessibility manual checks for keyboard nav>`

## Notes for maintainers

- Keep this file short.
- If a rule becomes broadly useful, move it to `AGENTS.md` and remove it from here.


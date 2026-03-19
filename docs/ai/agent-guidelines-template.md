# AI Extension Template

Use this template to create **scoped AI instructions** for one part of the repo.
Do not duplicate global rules from `AGENTS.md`.

## Where to place scoped instruction files

- Put the scoped file in the **closest relevant subfolder** to the code it governs.
- Example placements:
  - `app/sak/AGENTS.md` for rules that only apply under `app/sak/`
  - `lib/services/pdl/AGENTS.md` for one service integration
  - `components/felleskomponenter/card/AGENTS.md` for one component area
- Keep root `AGENTS.md` as the global source of truth.

## Naming convention

- Use the filename `AGENTS.md` for scoped files.
- Prefer one scoped `AGENTS.md` per bounded area instead of many tiny files.
- If two areas need different rules, place separate `AGENTS.md` files in each area.

## How to create and use a scoped file

1. Copy this template into the target folder as `AGENTS.md`.
2. Fill only scope-specific additions/deviations.
3. In prompts/tasks, reference both root `AGENTS.md` and the scoped file path.
4. If a scoped rule becomes generally useful, move it to root `AGENTS.md`.

## Base rules

- Inherit all repository-wide rules from root `AGENTS.md`.
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
- If a rule becomes broadly useful, move it to root `AGENTS.md` and remove it from here.


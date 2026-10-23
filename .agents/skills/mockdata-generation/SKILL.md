---
name: mockdata-generation
description: Use when refreshing, adding or changing mock data for a service in lib/services/*/mockdata/ (mockdata.json, mockdata-example.json, mockdata.config.json, mockdata-generator.sh), for example after API changes or when adding new IDs.
---

# Mock data generation

Each service keeps real responses from the dev environment in its `mockdata/` folder, used for local development. The reference is `lib/services/arenaoppslag/mockdata/`.

## Files

- `mockdata.json` — a single map of `{ id: data }` containing real responses for all IDs listed in `mockdata.config.json`. This is what the mock resolver imports and what is used for local testing.
- `mockdata-example.json` — a single unwrapped entry for a pinned ID. Kept in source control as a readable reference of the full data structure for developers and AI agents. Do not import this file in application code.
- `mockdata.config.json` — lists the IDs to fetch. Add new IDs here, then re-run the generator.
- `mockdata-generator.sh` — fetches real responses from the dev API and writes `mockdata.json` and `mockdata-example.json` (and any additional per-endpoint files). Run it to refresh data after API changes or when adding new IDs.

## Workflow

1. Add new IDs to `mockdata.config.json`.
2. Run `mockdata-generator.sh` from the service's `mockdata/` folder. It needs `jq` and an Azure token cookie, which the script prompts for. This is interactive and needs the user, so ask the user to run it and do not try to run it yourself.
3. Review the diff of the generated JSON. Make sure nothing unexpected changed and the example still reflects the full structure.
4. Update `{name}-types.ts` if the response shape changed.
5. Run `pnpm lint`, `pnpm vitest run` and `pnpm build`.

## Notes

- Mock data is real data from dev. Do not hand-edit generated files; change the config or the script and regenerate.
- When creating a mock resolver for a new service, see the `new-service` skill.

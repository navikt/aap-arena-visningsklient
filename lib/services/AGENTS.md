# AGENTS.md — lib/services/

Inherits all rules from root `AGENTS.md`. Applies only to `lib/services/`.

A service is a server-side integration to one external system. Each service lives in its own
subfolder. The reference implementation is `lib/services/arenaoppslag/`.

## Always

- Load the `new-service` skill before creating or changing a service.
- Load the `mockdata-generation` skill before touching `mockdata/`.
- Never import service files from client components.
- Use `apiFetch` from `lib/services/api-fetch/`. Never duplicate its logic.
- Never log secrets or tokens.

## Validation

- `pnpm lint` and `pnpm build` must pass.

# AGENTS.md — lib/services/

Inherits all rules from root `AGENTS.md`. This file adds scope-specific rules for `lib/services/`.

## Scope

- Applies to: `lib/services/`
- Does not apply to: `lib/utils/`, `lib/serverutlis/`, `app/`, `components/`

## What a service is

A service is a server-side integration to one external system or API. Each service lives in its own
subfolder under `lib/services/`. The canonical reference implementation is `lib/services/arenaoppslag/`.

## File structure per service

Each service subfolder should contain the following files:

| File                | Purpose                                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| `{name}-service.ts` | Exported async functions. Must start with `'use server'`. See rules below. |
| `{name}-types.ts`   | TypeScript DTOs and response types. No runtime code — types only.          |
| `{name}-mock.ts`    | Mock data resolver used during local development.                          |
| `mockdata/`         | Real JSON responses fetched from the dev environment. One file per entity. |

## Rules for `{name}-service.ts`

- Always add `'use server'` as the first line.
- Read `baseUrl` and `scope` from environment variables at module level.
- Always check `mocksEnabled()` first and return mock data if true.
- Use `apiFetch` from `lib/services/api-fetch/apiFetch` for all HTTP calls.
- Return `null` on `404` responses — do not throw.
- Log unexpected errors with the Winston logger before throwing. Include contextual metadata.
  Never log secrets or tokens.
- Do not import service files from client components.

```ts
'use server';

import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { mocksEnabled } from 'lib/utils/environment';
import { getLogger } from 'lib/serverutlis/logger';
import { MyResponseDTO } from 'lib/services/my-service/my-service-types';
import { getMockData } from 'lib/services/my-service/my-service-mock';

const baseUrl = process.env.MY_SERVICE_BASE_URL;
const scope = process.env.MY_SERVICE_SCOPE || '';
const logger = getLogger('lib.services.my-service');

export async function fetchThing(id: string): Promise<MyResponseDTO | null> {
  if (mocksEnabled()) {
    return getMockData(id);
  }

  const response = await apiFetch<MyResponseDTO>(`${baseUrl}/api/thing/${id}`, scope, 'GET');
  if (isError(response)) {
    if (response.status === 404) return null;
    logger.error('Failed to fetch thing', { response });
    throw new Error('Failed to fetch thing', { cause: response });
  }

  return response.data;
}
```

## Rules for `{name}-types.ts`

- Contains only TypeScript type and interface declarations — no runtime code.
- Use a local `NIL` alias for nullable fields to keep types concise:

```ts
type NIL = null | undefined;

export type MyResponseDTO = {
  id: string;
  name: string;
  optionalField: string | NIL;
};
```

- Suffix type names with `DTO` when they directly represent external API response shapes.
- Do not import from service files or utils here — types only.

## Rules for `{name}-mock.ts`

- Export a function that accepts the same arguments as the real service function.
- Switch on the ID or key and return the matching imported JSON fixture.
- Return `null` for unknown IDs.
- Import fixture files from the `mockdata/` subfolder.

```ts
import { MyResponseDTO } from 'lib/services/my-service/my-service-types';
import Fixture123 from 'lib/services/my-service/mockdata/thing-123-mockdata.json';

export function getMockData(id: string): MyResponseDTO | null {
  switch (id) {
    case '123':
      return Fixture123;
    default:
      return null;
  }
}
```

## Rules for `mockdata/`

- JSON files contain real responses captured from the dev environment.
- One file per entity, named `{entity}-{id}-mockdata.json`.
- `mockdata.config.json` lists the IDs that have fixture files.
- `mockdata-generator.sh` fetches and writes fixture files from the dev API — run it to refresh.

## Shared infrastructure in `api-fetch/`

`lib/services/api-fetch/` is shared infrastructure, not a business service. Do not copy or
duplicate its logic. Use it as-is:

- `apiFetch` — generic typed HTTP client. Handles retries, OBO tokens, and logging.
- `token.ts` — OBO token acquisition. Handles three modes automatically (local Wonderwall,
  mock login, production).
- `token-types.ts` — JWT payload type definitions.
- `token-mock.ts` — mock token resolution for local development.

## Validation

- `yarn lint` — must pass after any changes.
- `yarn build` — must pass. Services are server-only; build failures often indicate missing env
  vars or type errors.
- If logic changes, add or update tests in `lib/utils/` for any shared utilities touched.

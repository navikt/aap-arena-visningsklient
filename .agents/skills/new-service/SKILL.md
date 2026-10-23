---
name: new-service
description: Use when creating, changing, debugging or reviewing a server-side service in lib/services/ (external API integrations, apiFetch, service types, mock resolvers). Covers file structure, conventions and code templates. Reference implementation is lib/services/arenaoppslag/.
---

# New or changed service

A service is a server-side integration to one external system or API. Each service lives in its own subfolder under `lib/services/`. The canonical reference implementation is `lib/services/arenaoppslag/`. Read it before writing a new one.

## File structure per service

| File                | Purpose                                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| `{name}-service.ts` | Exported async functions. Must start with `'use server'`. See rules below. |
| `{name}-types.ts`   | TypeScript DTOs and response types. No runtime code — types only.          |
| `{name}-mock.ts`    | Mock data resolver used during local development.                          |
| `mockdata/`         | Real JSON responses fetched from the dev environment. Use the `mockdata-generation` skill. |

## Rules for `{name}-service.ts`

- Always add `'use server'` as the first line.
- Read `baseUrl` and `scope` from environment variables at module level.
- Always check `mocksEnabled()` first and return mock data if true.
- Use `apiFetch` from `lib/services/api-fetch/apiFetch` for all HTTP calls.
- Return `null` on `404` responses — do not throw.
- Log unexpected errors with the Winston logger before throwing. Include contextual metadata. Never log secrets or tokens.
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
- Import `NIL` from `lib/utils/types` for nullable fields instead of defining it locally.
- Suffix type names with `DTO` when they directly represent external API response shapes.

```ts
import { NIL } from 'lib/utils/types';

export type MyResponseDTO = {
  id: string;
  name: string;
  optionalField: string | NIL;
};
```

## Rules for `{name}-mock.ts`

- Export a function that accepts the same arguments as the real service function.
- Import `mockdata.json` and look up by ID using a map access.
- Return `null` for unknown IDs.

```ts
import { MyResponseDTO } from 'lib/services/my-service/my-service-types';
import allFixtures from 'lib/services/my-service/mockdata/mockdata.json';

export function getMockData(id: string): MyResponseDTO | null {
  return (allFixtures as Record<string, MyResponseDTO>)[id] ?? null;
}
```

## Shared infrastructure in `api-fetch/`

`lib/services/api-fetch/` is shared infrastructure, not a business service. Do not copy or duplicate its logic. Use it as-is:

- `apiFetch` — generic typed HTTP client. Handles retries, OBO tokens, and logging.
- `token.ts` — OBO token acquisition. Handles three modes automatically (local Wonderwall, mock login, production).
- `token-types.ts` — JWT payload type definitions.
- `token-mock.ts` — mock token resolution for local development.

## Checklist

1. Create the subfolder and the three files above.
2. Add env vars for `baseUrl` and `scope` (and to the Nais config if needed).
3. Set up mock data with the `mockdata-generation` skill.
4. Run `pnpm lint` and `pnpm build`. Build failures often mean missing env vars or type errors.
5. If shared utilities in `lib/utils/` were touched, add or update tests there.

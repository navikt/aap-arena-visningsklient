---
name: nextjs-patterns
description: Use when adding or changing pages, routes, layouts, components, server actions or data fetching in app/, components/ or lib/, or when deciding where new code belongs in this Next.js App Router repo.
---

# Next.js patterns and folder structure

## Patterns

- Default to Server Components unless client interactivity is needed.
- Add `"use client"` only when required.
- Keep data fetching on the server when possible.
- Use route handlers/server actions for mutations and cookie writes.
- Be explicit with caching strategy when introducing fetches.

## Folder structure

- `app/`: Next.js server pages/routes. Do API/data fetching in server components and pass data down via props. Keep JSX/CSS here minimal, only for small page/layout-specific parts.
- `components/`: Client components. Keep each component in its own folder. Put shared/reusable components in `components/felleskomponenter/`.
- `lib/serverutlis/`: Server-only utilities (for example logger). Do not import these from client components. (Folder name is currently `serverutlis` in this repo.)
- `lib/services/`: One service per subfolder. Server-side integrations to external systems. Use the `new-service` skill.
- `lib/utils/`: General utilities usable by both server and client code. Add/update tests for shared logic here when relevant.

## Styling

Use Aksel components first, and the `aksel-builder` skill for UI work. Custom styling uses CSS Modules and Aksel tokens only.

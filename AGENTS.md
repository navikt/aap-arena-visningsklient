# AGENTS.md

This file is the source of truth for AI agents working in this repository.

## Instruction priority

1. System/developer instructions from the active AI runtime.
2. This file (`AGENTS.md`).
3. Task-specific instructions from the user/issue/PR.
4. Existing code patterns in this repository.

If instructions conflict, follow the highest-priority source and explain trade-offs.

## Project quick facts

- Stack: Next.js App Router + TypeScript
- UI library: NAV Aksel (`@navikt/ds-react`)
- Styling: CSS Modules
- Package manager: Yarn
- Tests: Vitest
- Linting/formatting: oxlint + oxfmt

## Repo goals for AI contributions

- Make small, safe changes with clear intent.
- Prefer consistency with existing patterns over inventing new abstractions.
- Keep behavior unchanged unless task explicitly asks for behavior change.
- Include or update tests when logic changes.

## Frontend styling contract (IMPORTANT)

- Prefer Aksel components before custom HTML/CSS.
- If custom styling is needed:
  - Use CSS Modules only.
  - Do not use inline styles (except dynamic values that cannot be represented in CSS).
  - Do not hardcode spacing, colors, border radius, typography, z-index, or breakpoints.
  - Use Aksel CSS variables/tokens for design values.
- Keep accessibility intact (labels, semantics, keyboard support, focus state, contrast).

### Styling examples

Good:

```css
.container {
  padding: var(--a-spacing-4);
  background: var(--a-surface-default);
  border-radius: var(--a-border-radius-medium);
}
```

Avoid:

```css
.container {
  padding: 16px;
  background: #fff;
  border-radius: 6px;
}
```

## Next.js patterns

- Default to Server Components unless client interactivity is needed.
- Add `"use client"` only when required.
- Keep data fetching on the server when possible.
- Use route handlers/server actions for mutations and cookie writes.
- Be explicit with caching strategy when introducing fetches.

## Folder structure contract

- `app/`: Next.js server pages/routes. Do API/data fetching in server components and pass data down via props. Keep JSX/CSS here minimal, only for small page/layout-specific parts.
- `components/`: Client components. Keep each component in its own folder. Put shared/reusable components in `components/felleskomponenter/`.
- `lib/serverutlis/`: Server-only utilities (for example logger). Do not import these from client components. (Folder name is currently `serverutlis` in this repo.)
- `lib/services/`: One service per subfolder. Services are server-side integrations to external systems. See `lib/services/AGENTS.md` for detailed conventions.
- `lib/utils/`: General utilities usable by both server and client code. Add/update tests for shared logic here when relevant.

## Logging and errors

- Use existing Winston logger utilities in `lib/serverutlis/logger.ts`.
- Log errors with contextual metadata, but never secrets or tokens.
- Prefer structured logs over free-form string concatenation.

## Comments

- Write comments in Norwegian.
- Strive to write code that does not need comments. Good naming is preferred over explanation.
- Only add a comment when the code is genuinely hard to understand without it.
- Comments must explain **why** the code does something, not **what** it does. The code itself shows what; the comment should explain the reason or intent that is not obvious from reading it.

## Testing expectations

- Update/add Vitest tests for changed logic in `lib/utils` and other test-covered modules.
- Keep tests deterministic and readable.
- Include edge cases (null/undefined/empty values) when relevant.

## Git workflow

Before committing or pushing, always:

1. Run `oxfmt` on all changed files to ensure correct formatting.
2. Show the user a summary of the changes to be committed.
3. Propose a commit message and wait for explicit approval before proceeding.
4. Do not commit or push until the user has confirmed both the changes and the message.

Before creating a pull request, always:

1. Propose a PR title and description and present them to the user.
2. Wait for explicit approval — including any requested edits — before creating it.

## Definition of done for AI PRs

- Code builds and lint/tests pass locally or in CI.
- New/changed behavior is covered by tests where applicable.
- Styling follows Aksel-first + token-only CSS rules.
- Docs updated if behavior, setup, or conventions changed.

## Suggested prompt template for future tasks

Use this when asking an AI agent to implement changes:

```md
Task:

- <what to change>

Constraints:

- Use Aksel components where possible.
- If custom styles are needed, use CSS Modules and only Aksel CSS variables.
- Avoid hardcoded design values.
- Keep as Server Component unless client behavior is required.
- Add/update tests.

Validation:

- Run lint + tests.
- Explain what changed and why.
```

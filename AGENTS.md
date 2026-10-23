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
- Package manager: pnpm
- Tests: Vitest
- Linting/formatting: oxlint + oxfmt

## Repo goals for AI contributions

- Make small, safe changes with clear intent.
- Prefer consistency with existing patterns over inventing new abstractions.
- Keep behavior unchanged unless task explicitly asks for behavior change.
- Include or update tests when logic changes.

## Skills

- UI work: use the `aksel-builder` skill. Aksel components first. Custom styling uses CSS Modules and Aksel tokens only, with no inline styles and no hardcoded design values. Keep accessibility intact.
- Pages, routes, components and folder structure: use the `nextjs-patterns` skill.
- Services in `lib/services/`: use the `new-service` and `mockdata-generation` skills.
- Git and pull requests: use the `git-workflow` skill.

## Git safety

Never run `git commit` without explicit user approval of the changes and message. Never run `git push` or create pull requests. The `git-workflow` skill is the rule for all git conflicts.

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

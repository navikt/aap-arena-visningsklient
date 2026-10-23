---
name: git-workflow
description: Use whenever you are about to run git commit, git push, create a branch or pull request, or otherwise change git history in aap-arena-visningsklient. Rules for commit approval, never pushing, and never committing on main.
---

# Git workflow

These rules are strict. Follow them even if the user's request sounds like it implies skipping a step.

## 1. Check the branch first

Before any commit, run `git branch --show-current`.

If the branch is `main` (or `master`), **stop and show this warning to the user, in this form, before doing anything else**:

> ⚠️ **WARNING: You are on the `main` branch.**
> I will not commit here. Please tell me to create a new branch (suggested name: `<forslag>`) or switch to an existing one.

- Do not commit on `main`, even if the user says "commit". Ask them to confirm a branch switch or a new branch first.
- Creating a new branch from `main` with the uncommitted changes is fine once the user has agreed on the name.

## 2. Never commit without approval

Before every commit:

1. Show a summary of the changes to be committed (`git status` and `git diff --stat`, plus a short description in your own words).
2. Propose a commit message (see the `conventional-commit` skill for the format).
3. **Ask the user explicitly whether they accept both the changes and the message.** Wait for the answer.
4. Only commit after a clear yes. If the user asks for edits, apply them and ask again.

Approval applies to that one commit only. Ask again for every new commit, including amends.

## 3. Never push

- Never run `git push`, in any form (including `--force`, `--force-with-lease`, `--set-upstream`).
- After committing, tell the user the commit is ready and that they need to push it themselves.
- Do not create or update a pull request. If the user wants one, follow section 5.

## 4. Other safe habits

- Stage only the files that belong to the change. Do not use `git add -A` blindly; check `git status` first.
- Never rewrite history (`rebase`, `reset --hard`, `commit --amend` on existing commits) without being asked.
- Never skip hooks (`--no-verify`).
- Run `oxfmt` on all changed files, then `pnpm lint`, `pnpm test` and `pnpm build`, and make sure they pass before proposing a commit.

## 5. Pull requests

Before proposing a pull request:

1. Run `oxfmt` on all changed files.
2. Run `pnpm lint` and fix any errors.
3. Run `pnpm vitest run` and fix any failing tests.
4. Propose a PR title and description and present them to the user.
5. **Never run `gh pr create` or any equivalent**, even after the user approves the title and description. Tell the user to create the PR themselves (this follows section 3).

### Definition of done for AI PRs

- Code builds and lint/tests pass locally or in CI.
- New/changed behavior is covered by tests where applicable.
- Styling follows Aksel-first + token-only CSS rules.
- Docs updated if behavior, setup, or conventions changed.

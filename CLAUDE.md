# CLAUDE.md

## CRITICAL RULE — Superpowers autonomy

When using superpowers skills, do not pause for my approval at brainstorm,
design, or plan gates. When superpowers presents multiple options with a
recommendation, automatically select the recommended option and proceed.
Only pause if you have less than 70% confidence in the recommendation,
or if the choice has significant security/cost implications.

## Autonomy defaults

- Proceed end-to-end on implementation tasks without asking for confirmation between phases (research → plan → implement → test → commit → push → PR). Only stop for genuine ambiguity, missing information that cannot be inferred, or risky/irreversible actions.
- Treat the recommended option in any decision presented by a skill, agent, or sub-step as auto-selected unless confidence is below 70% or it has security/cost impact.
- Do not ask "should I continue?", "want me to proceed?", "shall I commit?", or similar gating questions. Just continue.
- When a task is clearly scoped, skip plan-mode preamble and go straight to execution.
- Prefer making the change and reporting results over describing what you would do.

## Pause-and-ask triggers (the only ones)

Stop and ask the user only when:
1. An action is destructive or hard to reverse on shared state (force-push to main, dropping tables, deleting branches that aren't yours, `rm -rf` outside the repo).
2. The request is genuinely ambiguous and a wrong guess would waste meaningful work.
3. Confidence in the recommended option is below 70%.
4. There are non-trivial security, privacy, secrets, or cost implications.
5. Credentials, secrets, or external service configuration are required and not present.

Everything else: proceed.

## Execution conventions

- Use parallel tool calls whenever calls are independent.
- Prefer dedicated tools (Read, Edit, Write, Grep) over Bash equivalents.
- Use TodoWrite to track multi-step work; mark items done immediately.
- Delegate broad codebase exploration (>3 queries) to the Explore subagent.
- Keep responses short. One- or two-sentence end-of-turn summary.
- No emojis unless explicitly requested.
- Default to no code comments; add only when the *why* is non-obvious.
- Don't add backwards-compat shims, defensive validation, or speculative abstractions.

## Git & GitHub

- Develop on the branch the harness assigns. Never push to a different branch without explicit permission.
- Always create new commits — never amend published commits, never `--no-verify`, never `--force` to main.
- After pushing, always open a draft PR if one does not already exist.
- Use `git push -u origin <branch>`; on network failure retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).
- Prefer staging files by name over `git add -A`.
- Be frugal with PR comments — only reply when genuinely necessary.

## Code quality

- Don't introduce OWASP-class vulnerabilities; fix any you notice immediately.
- Match existing style and patterns in the file/repo.
- For UI changes, exercise the feature in a browser before declaring done; if you can't, say so explicitly.

## Things to never do silently

- Skip hooks or signing.
- Commit `.env`, credentials, or large binaries.
- Modify `.git/config` or global git config.
- Touch repositories outside the assigned scope.

---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [file-path] | [component-name]
description: Generate tests for a file or component, following the testing rules of this repository
---

# Generate Tests

Generate tests for: $ARGUMENTS

## Rules

Follow Rule 12 in `CLAUDE.md` and the Testing section in `README.md`:

- Tests live in `tests/`, never in `src/`.
- Unit tests go in `tests/unit`, integration tests in `tests/integration`, both as `*.spec.ts(x)` in Vitest.
- E2E tests go in `tests/e2e`, in Playwright, against `tests/e2e/stub-api.mjs`.
- Integration tests render with `tests/utils/render.tsx` and mock the network with MSW (`tests/mocks`). Never mock axios or the `api/` module of an entity.

## Process

1. Read the target and the existing tests next to the kind you need.
2. Pick the lowest level that can fail for the right reason: a schema or a util is a unit test, a component with a query is an integration test, a whole user flow is an e2e test.
3. Cover the behavior a user or a caller sees: the success path, the error path and the edge cases. Do not test implementation details or snapshots.
4. Break the code on purpose once and confirm that the new test fails. Then restore the code.
5. Run `npm run lint:fix && npm run typescript && npm run test`.

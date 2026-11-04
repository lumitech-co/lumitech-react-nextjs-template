# PR risk levels

Use this table to find the `Risk` level in the pull request template.
Examine each dimension. The highest level of all the dimensions is the level of the PR.
Add the label `risk: <level>` to the PR.

| Dimension        | low                                                | medium                                                     | high                                                                           | critical                                                                 |
| ---------------- | -------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **routes**       | No change to a URL or a locale.                    | A new page or a new locale.                                | A change to an existing URL, a redirect or `src/proxy.ts`.                     | An existing page or link stops working for users in production.          |
| **API contract** | No change to a request or a response.              | A call to a new endpoint or a new optional field.          | A change to how the app reads an existing endpoint, or to its query keys.      | The app does not work with the API version in production.                |
| **rendering**    | No change to Server or Client Components.          | A new Client Component or a new prefetch.                  | A change to prefetch, hydration, caching or the static rendering of a page.    | A user can see the data of another user.                                 |
| **security**     | No change to auth, headers, secrets or validation. | A new form that uses the existing validation.              | A change to auth, security headers, CSP, cookies or `dangerouslySetInnerHTML`. | A change to how the app stores or sends tokens, or a secret in a bundle. |
| **integrations** | No new external script or service.                 | A new optional provider, a new dependency or env variable. | A change to analytics, payments or another provider in production.             | A call that deletes data, sends messages or takes money.                 |
| **code**         | Docs, tests, tooling or a refactor with tests.     | New code with tests.                                       | A change to how existing shared code works: `src/shared`, `next.config.mjs`.   | A major upgrade of Next.js or React.                                     |

## Rollback

A PR with the level `high` or `critical` must have "Rollback:" in section 5. Write:

1. The steps to undo the change: revert the PR, remove the env variable, redeploy.
2. The effects that a revert cannot undo: cached pages, sent messages, links that users saved.
3. The order of the steps, when the API and the app must change in a fixed order.

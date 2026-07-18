# CLAUDE.md - Project Guide for Claude Code

## Project Overview
Next.js (App Router) frontend template with TypeScript, featuring:
- **Next.js 14+ App Router** - React Server Components by default
- **TanStack Query** - server state, caching, SSR prefetch + hydration
- **Zustand** - client state
- **Zod + React Hook Form** - validation and forms
- **Axios** - HTTP client (`shared/lib/axios.ts`)
- **Tailwind CSS** - styling (`cn()` from `shared/lib/styles`)
- **@t3-oss/env-nextjs** - typed, validated environment variables
- **SVGR** - `.svg` imported as React components
- **eslint-plugin-boundaries** - enforces the FSD layer rules below at lint time
- **eslint-plugin-check-file** - enforces kebab-case file/folder naming at lint time

The project follows [Feature-Sliced Design](https://feature-sliced.design/) (FSD):
```
app → widgets → features → entities → shared
```
A layer may import only **itself** (same slice) and layers **strictly below** it — enforced
by `boundaries/dependencies` in `.eslintrc.js`, not just convention. `shared` has no slices
and imports only other `shared` segments, plus libraries and `env`.

**No barrel files.** No folder anywhere in `src/` has an `index.ts` that re-exports its
contents — every import points directly at the file that declares the symbol. This is
enforced by ESLint's `no-restricted-syntax` (bans `export * from` / `export { x } from`).
See rule 7.

**`src/` has a fixed set of folders and no `shared/api`.** Every file must belong to one of
the declared layers/segments (`boundaries/no-unknown-files` fails lint otherwise) — there is
no `src/utils/`, no `src/shared/api/`, no ad-hoc folder. All API access, even a single
one-off endpoint, is an `entities/<entity>`. See rules 3 and 8.

**`process.env` only in `src/env.ts`.** ESLint's `no-restricted-properties` fails lint on any
`process.env.X` outside that one file. See rule 1.

**Styling is Tailwind-only, no custom CSS.** The only stylesheet in `src/` is
`src/app/styles/global.css`. ESLint's `no-restricted-imports` fails lint on importing any
other local `.css`/`.scss`/`.sass`/`.less` file. See rule 9.

**Files and folders are kebab-case.** `create-todo-form.tsx`, `entities/todos/`, not
`CreateTodoForm.tsx` or `entities/my_slice/`. `src/app/**` follows Next.js's own App Router
naming instead (`[id]`, `(group)`, `@slot`). Enforced by `eslint-plugin-check-file`. See
rule 10.

## Critical: Code Generation Commands

### Finishing a feature
**ALWAYS run lint and typescript checks when finishing a feature**
```bash
npm run lint:fix && npm run typescript
```

### Creating a New Entity
**Never create an entity by hand — always run the generator first:**
```bash
npm run generate:entity <entityName>
```
This creates `src/entities/<entity>/` with:
- `api/` - `get.ts`, `post.ts`, `put.ts`, `patch.ts`, `delete.ts`
- `hooks/` - the React Query hooks for those requests
- `types/` - `params.ts`, `payloads.ts`, `responses.ts`

No `index.ts` is generated anywhere — this template forbids barrel files (see rule #7).
The generator also wires:
- `src/shared/constants/query-keys.ts` - adds `GET_<ENTITY>S` and `GET_INFINITE_<ENTITY>S`
  to the `QueryKeys` enum

### Creating a New Feature
**Never create a feature by hand — always run the generator first:**
```bash
npm run generate:feature <featureName>
```
This creates `src/features/<feature>/` with `ui/`, `hooks/`, `lib/`, `schemas/`, `types/`.
No `index.ts` is generated — import each component/hook from its own file (see rule #7).

## Architecture Rules (non-negotiable)

These rules are hard constraints. If a task cannot be done without breaking one of them,
stop and ask instead of working around it.

### 0. Entities and features are only ever created by the generators
A new entity or feature is **always** scaffolded by the CLI, never by hand:
```bash
npm run generate:entity <entityName>     # node cli/entity-gen/index.js
npm run generate:feature <featureName>   # node cli/feature-gen/index.js
```
Creating `src/entities/<name>/**` or `src/features/<name>/**` with the Write tool is
forbidden — the entity generator also wires the `QueryKeys` enum, and hand-written
folders silently skip that wiring and drift from the layout the rest of the codebase
expects. Run the generator first, then edit the files it produced (delete the request
kinds the entity does not need).

If a generator cannot produce what the task needs, stop and ask — do not fall back to
creating the files manually. Fixing the generator is a valid answer; bypassing it is not.

### 1. Environment variables only through `src/env.ts`
`process.env` is read in **exactly one place**: `src/env.ts`, where every variable is
declared and validated with Zod through `createEnv` from `@t3-oss/env-nextjs`. Everywhere
else the variable is imported from there:
```typescript
import { env } from 'env';

export const api = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL });
```
Forbidden anywhere outside `src/env.ts`: `process.env.X`, `process.env.X!`,
`process.env.X ?? 'fallback'`, and re-reading a variable "just for this one file". This is
lint-enforced: ESLint's `no-restricted-properties` rule (`.eslintrc.js`) errors on any
`process.env` member access outside `src/env.ts`, which is the sole `overrides` exemption.

Adding a variable means three edits in `src/env.ts` (never fewer):
1. the schema entry — `client` for `NEXT_PUBLIC_*`, `server` for everything else;
2. the matching `runtimeEnv` line (Next.js inlines client vars only if they are listed
   there explicitly);
3. the same key in `.env.example`.

A server-only variable must never be named `NEXT_PUBLIC_*` — that prefix ships its value
to the browser bundle. `next.config.mjs` imports `./src/env` via jiti so a missing or
invalid variable fails the **build**, not a request; do not remove that import.

### 2. Pages are always Server Components
A `src/app/**/page.tsx` (and `layout.tsx`) is a **Server Component**: no `'use client'` at
the top of a page, and therefore no hooks (`useState`, `useEffect`, React Query hooks,
zustand stores) and no browser APIs inside it.

Everything interactive is a client component that lives in `features/` (or `widgets/`) and
carries its own `'use client'`; the page only composes them:
```typescript
// src/app/page.tsx — server
const HomePage = async () => {
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_TODOS, params],
    queryFn: () => getTodos(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <TodosList />   {/* 'use client' lives inside the feature */}
      </Suspense>
    </HydrationBoundary>
  );
};
```
`'use client'` goes on the **leaf** that actually needs it — the smallest component with
state, effects, event handlers or a store — never on a page, a layout, or a wrapper that
would drag its whole subtree into the client bundle.

Data a page needs on the server is prefetched with `queryClient.prefetchQuery` and handed
down through `HydrationBoundary` + `dehydrate`, so the client hook (`useGetX`) reads it
from the cache instead of refetching.

### 3. Layer placement (where a file goes)

`src/shared/**` — everything global, reusable and feature-agnostic:
- `shared/ui/` - **all reusable UI components** (Button, Input, Modal, …). A component
  used by more than one feature, or generic enough to be, belongs here — never duplicated
  inside a feature.
- `shared/types/` - all general/shared types.
- `shared/store/` - **all zustand stores**. A store is never created inside a feature or
  a component file.
- `shared/providers/` - **all React context providers** (TanStack Query and any other
  library that needs one). Providers are client components and are mounted in
  `src/app/layout.tsx`.
- `shared/lib/` - global utilities and configured library instances (`axios.ts` → `api`,
  `query.ts` → `queryClient`, `styles.ts` → `cn`).
- `shared/icons/` - **custom icons only** — `.svg` files imported directly as React
  components via SVGR (`import TestIcon from 'shared/icons/test-icon.svg';`). Use this when
  the icon must be customized (`fill="currentColor"`, size, theme). An icon that is never
  restyled goes to `public/icons/` instead.
- `shared/hooks/` - global hooks that **do not touch the network** (`useDebounce`,
  `useMediaQuery`, …). A hook that wraps a TanStack Query call is not "global" — it belongs
  in `entities/<entity>/hooks/`, never here.
- `shared/constants/` - global constants, including the `QueryKeys` enum.

There is **no `shared/api/`**. Every API call — even a single one-off endpoint that no other
feature will ever reuse — is scaffolded as an `entities/<entity>`, never dropped into
`shared` as a "misc" request. This is lint-enforced (see rule 8).

`src/entities/<entity>/` — **API access only**, one folder per route prefix. The folder
name is the route prefix: routes under `/users` → `src/entities/users/`, with exactly three
subfolders:
- `api/` - the axios requests themselves;
- `types/` - query params, responses, payloads;
- `hooks/` - the React Query hooks the app uses to reach those routes.

An entity contains **no UI and no business logic** — components never call
`entities/*/api` directly, they use the entity's hooks.

`src/features/<feature>/` — UI components plus the logic of the user's interaction with
them: `ui/` (components), `hooks/`, `schemas/` (Zod schemas for this feature's forms),
`lib/` (feature-local helpers), `types/`.

`src/widgets/` — compositions of several features into a page-level block.

`src/app/` — routing, layouts, pages, global styles. No business logic.

### 4. Validation only via Zod
All user input — forms, search params, anything untrusted — is validated with a Zod schema.
Feature-level schemas live in `src/features/<feature>/schemas/`, and the type is derived
with `z.infer`, never hand-written next to the schema:
```typescript
export const createTodoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  completed: z.boolean().default(false),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
```
Forms use React Hook Form with `zodResolver(schema)`. No manual `if (!value) setError(...)`
as a substitute for a schema. Environment variables are the same rule, one file up:
Zod inside `createEnv` (see rule 1).

### 5. Server state through TanStack Query, client state through zustand
- Anything that comes from the API is server state: it is fetched with a query/mutation
  hook from `entities/<entity>/hooks`, keyed with a `QueryKeys` member, and invalidated with
  `queryClient.invalidateQueries` after a mutation. Never mirror fetched data into a zustand
  store or `useState`.
- Anything that is purely client-side (theme, modals, wizard step) is a zustand store in
  `shared/store`.
- Query keys are always members of the `QueryKeys` enum in
  `src/shared/constants/query-keys.ts` — never an inline string literal.

### 6. Assets
- **Icons → SVG.** A custom/restyled icon lives in `src/shared/icons/` and is imported
  directly as a React component (SVGR): `import TestIcon from 'shared/icons/test-icon.svg';`.
  An icon that is used as-is lives in `public/icons/` and is referenced by URL.
- **Every other image → WebP**, stored in `public/`. No PNG/JPEG, no raster image committed
  under `src/`.
- Raster images are rendered with `next/image`.

### 7. Imports — no barrel files, ever
**Barrel files (`index.ts` re-exporting a folder's contents) are forbidden everywhere in
`src/`.** No folder — `shared/*`, `entities/<entity>`, `features/<feature>`, `widgets/*` —
has an `index.ts`. This is enforced by ESLint (`no-restricted-syntax` bans
`export * from` and `export { x } from`) and by the generators, which never emit one.
Always import (and export) directly from the file that declares the symbol:
```typescript
// ✅ Good — direct file import
import { useGetUsers } from 'entities/users/hooks/get';
import { cn } from 'shared/lib/styles';

// ❌ Forbidden — there is no entities/users/index.ts or shared/lib/index.ts to import from
import { useGetUsers } from 'entities/users';
import { cn } from 'shared/lib';
```
- Absolute imports from `src` (`baseUrl: "./src"`) for anything outside the current slice:
  `shared/lib/axios`, `entities/users/hooks/get`, `env`. Never `../../../shared/...` across
  layers.
- Inside the same slice, relative imports of siblings are correct and preferred:
  `../todo/todo`, `../../lib/validation`.
- Layer boundaries (`app → widgets → features → entities → shared`, plus "same slice only"
  within `widgets`/`features`/`entities`) are enforced by `eslint-plugin-boundaries`
  (`boundaries/dependencies` in `.eslintrc.js`) — see [FSD docs](https://feature-sliced.design/docs)
  for the model this mirrors. A layer can only import itself and layers strictly below it;
  `entities/todos` can never import `entities/users`, `features/*`, or `widgets/*`.

### 8. `src/` has a fixed set of folders — no ad-hoc structure, not even inside a slice
Every file under `src/` must match one of the layers/segments declared in
`boundaries/elements` in `.eslintrc.js` — and each layer's pattern is scoped down to its
*documented segments*, not just `<layer>/*`:
- `app/**` — unrestricted (routing/pages, not segmented)
- `widgets/*/(ui|hooks|lib|types)/**`
- `features/*/(ui|hooks|schemas|lib|types)/**`
- `entities/*/(api|hooks|types)/**`
- `shared/(ui|types|store|providers|lib|icons|hooks|constants)/**`
- `env.ts` (via a file descriptor, not an element)

ESLint's `boundaries/no-unknown-files` rule fails lint on any file that doesn't match one of
these. This blocks two things, not just one:
1. A stray top-level folder — `src/utils/`, `src/components/`, `src/shared/api/`.
2. A stray folder **inside a slice that otherwise looks legitimate** — `entities/todos/ui/`
   (entities have no UI, see rule 3), `features/todos/store/`, `widgets/nav/random/`. These
   would pass a naive `<layer>/*` check but fail here because `ui` isn't in the entities
   segment list, `store` isn't in the features list, etc.

If a task genuinely needs a new kind of code that doesn't fit an existing segment, **stop
and ask** rather than inventing a folder. Extending `boundaries/elements` on purpose (and
updating this file + `README.md` to match) is the correct fix; silently adding a folder
outside the declared list is not.

### 9. Styling — Tailwind only, no custom CSS
Everything is styled with Tailwind utility classes, composed with `cn()` from
`shared/lib/styles`. The **only** stylesheet in `src/` is `src/app/styles/global.css`
(the `@tailwind` directives, plus theme CSS variables in `@layer base` if a library like
shadcn/ui needs them). No component-level `.css`, `.module.css`, `.scss`, `.sass` or
`.less` file anywhere.

This is lint-enforced: ESLint's `no-restricted-imports` rule (`.eslintrc.js`) fails on
importing any local stylesheet other than `app/styles/global.css`:
```typescript
// ✅ Good
<button className={cn('rounded px-4 py-2', primary && 'bg-blue-500')}>Click me</button>

// ❌ Fails lint
import './button.css';
import styles from './button.module.css';
```
Need a reusable value (brand color, spacing, breakpoint, font)? Add it to
**`tailwind.config.ts`** (`theme.extend`) and consume it as a utility class — never hand-roll
a CSS class for it.

A UI library that ships its own stylesheet (Swiper, react-day-picker, …) is imported
directly from the package, never copied into `src/`:
```typescript
// ✅ Good — bare package specifier, not a local file, so the rule above doesn't apply
import 'swiper/css';
```

### 10. Naming — kebab-case for files and folders
Every file and folder under `src/` is kebab-case: `create-todo-form.tsx`, `todos-list.tsx`,
`query-keys.ts`, `entities/todos/`, `features/todos/ui/create-todo-form/`. Not
`CreateTodoForm.tsx`, not `todos_list.ts`, not `entities/Todos/`.

`src/app/**` is the one exception — it follows **Next.js App Router's own** naming instead
of plain kebab-case, since it has conventions kebab-case doesn't cover: dynamic segments
(`[id]`, `[...slug]`), route groups (`(marketing)`), parallel routes (`@modal`), and the
fixed special filenames (`page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`, …) — those are
already lint-compatible, nothing extra to do there.

Lint-enforced by `eslint-plugin-check-file`:
- `check-file/filename-naming-convention` → `KEBAB_CASE` for every `.ts`/`.tsx` under `src/`
- `check-file/folder-naming-convention` → `KEBAB_CASE` under `src/` except `src/app/**`,
  which gets `NEXT_JS_APP_ROUTER_CASE`
```typescript
// ✅ Good
src/features/todos/ui/create-todo-form/create-todo-form.tsx

// ❌ Fails lint
src/features/todos/ui/CreateTodoForm/createTodoForm.tsx
```

## Directory Structure

```
src/
├── app/                     # App Router: pages (server), layouts, global styles
│   └── styles/global.css
├── widgets/                 # Compositions of features
├── features/                # UI + user-interaction logic (npm run generate:feature)
│   └── <feature>/
│       ├── ui/              # Components ('use client' where needed)
│       ├── hooks/           # Feature-local hooks
│       ├── schemas/         # Zod schemas for this feature
│       ├── lib/             # Feature-local helpers
│       └── types/           # Feature-local types
├── entities/                # API layer only (npm run generate:entity)
│   └── <entity>/            # One folder per route prefix (/users → users/)
│       ├── api/             # Axios requests
│       ├── types/           # Params, payloads, responses
│       └── hooks/           # React Query hooks
├── shared/
│   ├── ui/                  # All reusable UI components
│   ├── types/               # General types
│   ├── store/               # All zustand stores
│   ├── providers/           # All providers (React Query, …)
│   ├── lib/                 # Global utils + configured libs (api, queryClient, cn)
│   ├── icons/               # Custom SVG icons (SVGR components)
│   ├── hooks/               # Global hooks (no network calls — those live in entities/)
│   └── constants/           # Global constants + QueryKeys
└── env.ts                   # The only place that reads process.env
public/                      # Static assets: SVG icons, WebP images
```

## Key Patterns

### Entity hooks (server state)
```typescript
export const useGetUsers = (query: IGetUsersParams) => {
  return useQuery({
    queryKey: [QueryKeys.GET_USERS, query],
    queryFn: ({ signal }) => getUsers(query, signal),
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (payload: ICreateUser) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS] });
    },
  });
};
```

### Entity requests
Requests take `(params | payload, signal?)`, use the shared `api` instance, and return
`response.data` typed with an interface from the entity's `types/`:
```typescript
import { api } from 'shared/lib/axios';

export const getUsers = async (
  params: IGetUsersParams,
  signal?: AbortSignal,
): Promise<IUsersResponse> => {
  const response = await api.get('/users', { params, signal });

  return response.data;
};
```

### Providers
A provider is a client component in `shared/providers` and is mounted once in
`src/app/layout.tsx`:
```typescript
<TanStackQueryProvider>
  <Header />
  {children}
</TanStackQueryProvider>
```

### Styling
Compose Tailwind classes with `cn()` from `shared/lib/styles` (clsx + tailwind-merge) —
never string-concatenate class names. No custom CSS files — a reusable value goes in
`tailwind.config.ts` instead (see rule 9).

## Common Tasks

### Add a new API route group (e.g. `/users`)
1. `npm run generate:entity user`
2. Delete the request kinds the API does not have; adjust paths in `api/*.ts`
3. Fill in `types/responses.ts`, `types/payloads.ts`, `types/params.ts`
4. Import the generated hooks directly (e.g. `entities/users/hooks/get`) from a feature
   component

### Add a new screen
1. `npm run generate:feature <feature>`
2. Build the components in `features/<feature>/ui/` (`'use client'` only on the leaves that
   need it); reuse components from `shared/ui`; import each component from its own file
3. Create `src/app/<route>/page.tsx` as a Server Component that prefetches the data and
   renders the feature inside `HydrationBoundary`

### Add an environment variable
1. Add it to the `client` or `server` schema in `src/env.ts`
2. Add the matching `runtimeEnv` line
3. Add the key to `.env.example`

## Important Conventions
- Entities and features are scaffolded only with `npm run generate:entity` /
  `npm run generate:feature` — never written by hand (see Architecture Rules #0)
- `process.env` is read only in `src/env.ts`; everything else imports `env` — lint-enforced
  by `no-restricted-properties` (see #1)
- Pages and layouts are Server Components; `'use client'` sits on the smallest leaf that
  needs it (see #2)
- Reusable UI → `shared/ui`; general types → `shared/types`; zustand stores →
  `shared/store`; providers → `shared/providers`; global utils/libs → `shared/lib`; custom
  icons → `shared/icons`; global non-network hooks → `shared/hooks`; global constants →
  `shared/constants` (see #3)
- `entities/<entity>` is API-only: `api/` + `types/` + `hooks/`, one folder per route
  prefix, no UI. There is no `shared/api` — every API call, including one-off endpoints,
  is an entity (see #3)
- All validation is Zod; form types come from `z.infer` (see #4)
- Query keys come from the `QueryKeys` enum, never inline strings (see #5)
- Icons are SVG, all other images are WebP in `public/` (see #6)
- No barrel files (`index.ts` re-exports) anywhere in `src/` — always import directly from
  the file that declares the symbol; layer boundaries are enforced by
  `eslint-plugin-boundaries` (see #7)
- `src/` only contains the declared FSD folders/segments — `boundaries/no-unknown-files`
  fails lint on anything else, so don't invent a folder (see #8)
- Styling is Tailwind-only — no custom CSS files besides `app/styles/global.css`; reusable
  values go in `tailwind.config.ts`, lint-enforced by `no-restricted-imports` (see #9)
- Files and folders under `src/` are kebab-case (`src/app/**` follows Next.js App Router
  naming instead), lint-enforced by `eslint-plugin-check-file` (see #10)
- **No inline comments** - Do not add comments after lines of code. JSDoc comments for
  functions/components are allowed when they add meaningful context (non-obvious behavior)
- Always finish with `npm run lint:fix && npm run typescript`

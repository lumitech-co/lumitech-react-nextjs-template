# ARCHITECTURE.md - Reference for Claude Code

Detailed reference for this template: the stack, the Feature-Sliced Design layout, code
examples, and step-by-step recipes. `CLAUDE.md` holds the hard rules and points here for
the "how it looks in code" detail. Read this when you need an example or the exact folder
layout; treat the rules in `CLAUDE.md` as authoritative.

## Stack

Next.js (App Router) frontend template with TypeScript:
- **Next.js 14+ App Router** - React Server Components by default
- **TanStack Query** - server state, caching, SSR prefetch + hydration
- **Zustand** - client state
- **Zod + React Hook Form** - validation and forms
- **Axios** - HTTP client (`shared/lib/axios.ts`)
- **Tailwind CSS** - styling (`cn()` from `shared/lib/styles`)
- **@t3-oss/env-nextjs** - typed, validated environment variables
- **SVGR** - `.svg` imported as React components
- **eslint-plugin-boundaries** - enforces the FSD layer rules at lint time
- **eslint-plugin-check-file** - enforces kebab-case file/folder naming at lint time

## Feature-Sliced Design

The project follows [Feature-Sliced Design](https://feature-sliced.design/) (FSD):
```
app → widgets → features → entities → shared
```
A layer may import only **itself** (same slice) and layers **strictly below** it — enforced
by `boundaries/dependencies` in `.eslintrc.js`, not just convention. `shared` has no slices
and imports only other `shared` segments, plus libraries and `env`. So `entities/todos` can
never import `entities/users`, `features/*`, or `widgets/*`.

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

The set of folders/segments is fixed and lint-enforced (`boundaries/no-unknown-files`):
- `app/**` — unrestricted (routing/pages, not segmented)
- `widgets/*/(ui|hooks|lib|types)/**`
- `features/*/(ui|hooks|schemas|lib|types)/**`
- `entities/*/(api|hooks|types)/**`
- `shared/(ui|types|store|providers|lib|icons|hooks|constants)/**`
- `env.ts` (via a file descriptor, not an element)

## Layer placement (where a file goes)

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
  components via SVGR. Use this when the icon must be customized (`fill="currentColor"`,
  size, theme). An icon that is never restyled goes to `public/icons/` instead.
- `shared/hooks/` - global hooks that **do not touch the network** (`useDebounce`,
  `useMediaQuery`, …). A hook that wraps a TanStack Query call belongs in
  `entities/<entity>/hooks/`, never here.
- `shared/constants/` - global constants, including the `QueryKeys` enum.

There is **no `shared/api/`**. Every API call — even a single one-off endpoint that no other
feature will ever reuse — is scaffolded as an `entities/<entity>`.

`src/entities/<entity>/` — **API access only**, one folder per route prefix. The folder
name is the route prefix (routes under `/users` → `src/entities/users/`), with exactly
`api/` (the axios requests), `types/` (params, responses, payloads), and `hooks/` (the
React Query hooks). An entity contains **no UI and no business logic** — components never
call `entities/*/api` directly, they use the entity's hooks.

`src/features/<feature>/` — UI components plus the logic of the user's interaction with
them: `ui/` (components), `hooks/`, `schemas/` (Zod schemas for this feature's forms),
`lib/` (feature-local helpers), `types/`.

`src/widgets/` — compositions of several features into a page-level block.

`src/app/` — routing, layouts, pages, global styles. No business logic.

## Code Examples

### Pages are Server Components (rule 2)
A page prefetches on the server and hands data down through `HydrationBoundary`; the
client hook reads it from cache instead of refetching:
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

### Environment variables (rule 1)
```typescript
import { env } from 'env';

export const api = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL });
```

### Zod schema + inferred type (rule 4)
```typescript
export const createTodoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  completed: z.boolean().default(false),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
```
Forms use React Hook Form with `zodResolver(schema)`.

### Entity hooks — server state (rule 5)
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

### Imports — no layer-wide barrels (rule 7)
```typescript
// ✅ Good — direct file import
import { useGetUsers } from 'entities/users/hooks/get';
import { cn } from 'shared/lib/styles';

// ❌ Forbidden — a barrel on a layer root or a shared segment root
import { cn } from 'shared/lib'; // shared/lib/index.ts
import { Header } from 'widgets'; // widgets/index.ts
```
A single **slice** barrel is allowed: `<layer>/<slice>/index.ts` re-exporting that slice's
public API. Generators don't create one — add it by hand when a slice has a public surface
worth naming:
```typescript
// features/members/index.ts
export { RemoveMemberButton } from './ui/remove-member-button';
export { RemoveMemberDialog } from './ui/remove-member-dialog';

// consumer in widgets/
import { RemoveMemberButton } from 'features/members';
```
Layer rules still apply to it: the barrel is classified as its own slice, so it may only
re-export files from that slice, and importers obey the usual layer order.

Use absolute imports from `src` (`baseUrl: "./src"`) across layers; inside the same slice,
relative imports of siblings are correct and preferred (`../todo/todo`).

### Providers
A provider is a client component in `shared/providers`, mounted once in
`src/app/layout.tsx`:
```typescript
<TanStackQueryProvider>
  <Header />
  {children}
</TanStackQueryProvider>
```

### Styling (rule 9)
Compose Tailwind classes with `cn()`; never string-concatenate class names. A UI library
that ships its own stylesheet is imported directly from the package:
```typescript
// ✅ Good
<button className={cn('rounded px-4 py-2', primary && 'bg-blue-500')}>Click me</button>
import 'swiper/css';

// ❌ Fails lint
import './button.css';
import styles from './button.module.css';
```

### Naming (rule 10)
```typescript
// ✅ Good
src/features/todos/ui/create-todo-form/create-todo-form.tsx

// ❌ Fails lint
src/features/todos/ui/CreateTodoForm/createTodoForm.tsx
```

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

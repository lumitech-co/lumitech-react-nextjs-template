# CLAUDE.md - Project Guide for Claude Code

Next.js (App Router) + TypeScript frontend template on **Feature-Sliced Design**:
`app → widgets → features → entities → shared`.

**Main rule: everything goes by the FSD architecture.** For the stack, the folder layout,
code examples and step-by-step recipes, read **`ARCHITECTURE.md`** — consult it whenever you
need the "how it looks in code" detail. This file holds the hard rules; they are authoritative.

## Code Generation Commands

- **New entity:** `npm run generate:entity <entityName>` — scaffolds `api/`, `hooks/`,
  `types/` and wires the `QueryKeys` enum. Never create an entity by hand.
- **New feature:** `npm run generate:feature <featureName>` — scaffolds `ui/`, `hooks/`,
  `lib/`, `schemas/`, `types/`. Never create a feature by hand.
- **Finishing a feature:** always run `npm run lint:fix && npm run typescript`.

Generators emit no barrel files. If a generator can't produce what a task needs, stop and
ask — fixing the generator is valid, bypassing it is not.

## Architecture Rules (non-negotiable)

Hard constraints. If a task cannot be done without breaking one, **stop and ask** instead of
working around it. Code examples for each rule live in `ARCHITECTURE.md`.

0. **Generators only.** Entities and features are always scaffolded by the CLI
   (`generate:entity` / `generate:feature`), never written by hand — hand-written folders
   skip the `QueryKeys` wiring and drift from the expected layout. Then edit what they
   produced (delete unused request kinds).

1. **Env vars only through `src/env.ts`.** `process.env` is read in exactly one place, where
   every variable is declared and validated with Zod via `createEnv`. Everywhere else,
   `import { env } from 'env'`. Forbidden outside that file: `process.env.X`, `process.env.X!`,
   `process.env.X ?? 'fallback'` (lint-enforced by `no-restricted-properties`). Adding a
   variable = three edits: the schema entry (`client` for `NEXT_PUBLIC_*`, else `server`),
   the matching `runtimeEnv` line, and the key in `.env.example`. Server-only vars must never
   be named `NEXT_PUBLIC_*`. Do not remove the `./src/env` import in `next.config.mjs`.

2. **Pages are always Server Components.** No `'use client'` on a `page.tsx` / `layout.tsx`,
   and therefore no hooks, stores, or browser APIs there. Interactive code is a client
   component in `features/` (or `widgets/`) carrying its own `'use client'`; the page only
   composes them. `'use client'` sits on the smallest **leaf** that needs it. Server data is
   prefetched with `queryClient.prefetchQuery` and passed via `HydrationBoundary` + `dehydrate`.

3. **Layer placement.** `shared/**` = global, reusable, feature-agnostic (`ui`, `types`,
   `store`, `providers`, `lib`, `icons`, `hooks` (no network), `constants`).
   `entities/<entity>` = **API access only** (`api` + `types` + `hooks`), one folder per route
   prefix, no UI or business logic — components use the entity's hooks, never `entities/*/api`
   directly. `features/<feature>` = UI + interaction logic. `widgets/` = compositions of
   features. `app/` = routing/layouts/pages, no business logic. There is **no `shared/api/`** —
   every API call, including one-offs, is an entity.

4. **Validation only via Zod.** All untrusted input (forms, search params) is validated with a
   Zod schema; feature schemas live in `features/<feature>/schemas/`, and the type is derived
   with `z.infer`, never hand-written. Forms use React Hook Form with `zodResolver(schema)`.

5. **Server state → TanStack Query, client state → zustand.** API data is fetched with a
   query/mutation hook from `entities/<entity>/hooks`, keyed with a `QueryKeys` member, and
   invalidated after mutations — never mirrored into a store or `useState`. Purely client-side
   state (theme, modals, wizard step) is a zustand store in `shared/store`. Query keys always
   come from the `QueryKeys` enum, never inline strings.

6. **Assets.** Custom/restyled icons → SVG in `src/shared/icons/` (SVGR components);
   used-as-is icons → `public/icons/`. Every other image → WebP in `public/`, rendered with
   `next/image`. No PNG/JPEG or raster image under `src/`.

7. **No layer-wide barrels.** Forbidden: an `index.ts` on a layer root or a `shared` segment
   root (`src/features/index.ts`, `src/widgets/index.ts`, `src/entities/index.ts`,
   `src/shared/index.ts`, `src/shared/ui/index.ts`, …) — lint-enforced, `no-restricted-syntax`
   bans `export * from` / `export { x } from` in exactly those files, and
   `boundaries/no-unknown-files` rejects the layer-root ones outright. Allowed: one **slice**
   barrel, `<layer>/<slice>/index.ts` (`features/members/index.ts`), re-exporting that slice's
   public API. Everything else imports directly from the declaring file. Absolute imports from
   `src` across layers
   (`baseUrl: "./src"`); relative imports for siblings in the same slice. Layer boundaries
   (`app → widgets → features → entities → shared`, plus "same slice only") are enforced by
   `eslint-plugin-boundaries`.

8. **`src/` has a fixed set of folders.** Every file must match a declared layer/segment
   (`boundaries/no-unknown-files`) — no stray top-level folder (`src/utils/`, `src/shared/api/`)
   and no stray segment inside a slice (`entities/todos/ui/`, `features/todos/store/`). A new
   kind of code that doesn't fit → **stop and ask**; extending `boundaries/elements` on purpose
   (and updating this file + `README.md`) is the fix, inventing a folder is not.

9. **Styling — Tailwind only.** Utility classes composed with `cn()` from `shared/lib/styles`.
   The only stylesheet in `src/` is `src/app/styles/global.css`; no component-level
   `.css`/`.module.css`/`.scss`/`.sass`/`.less` (lint-enforced by `no-restricted-imports`).
   Reusable values go in `tailwind.config.ts` (`theme.extend`). A library's own stylesheet is
   imported from the package (`import 'swiper/css'`), never copied into `src/`.

10. **Naming — kebab-case** for every file and folder under `src/` (`create-todo-form.tsx`,
    `entities/todos/`). `src/app/**` is the exception — it follows Next.js App Router naming
    (`[id]`, `(group)`, `@slot`, fixed special filenames). Lint-enforced by
    `eslint-plugin-check-file`.

11. **No inline comments.** No comments after lines of code. JSDoc on functions/components is
    allowed when it adds meaningful, non-obvious context.

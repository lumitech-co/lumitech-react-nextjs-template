<div align="center">
 <img width="524" src="https://github.com/user-attachments/assets/73daa1c3-8cf0-4e02-adae-427b36a924a1" />
</div>


## [Lumitech](https://lumitech.co/) Next.js Template ⚡
The Lumitech Next.js Template provides a powerful and modern starting point for building fast, scalable, and maintainable web applications. With a clean architecture and pre-configured best practices, this template ensures that your development process is efficient and the project is production-ready.

### About Lumitech
[Lumitech](https://lumitech.co/) is a global custom software development company helping tech businesses build successful teams and innovative products. With a 600% growth since 2022, our team of engineers, AI/ML specialists, and product managers delivers high-quality software using the latest technologies.

### Why Use This Template? <br>
This template is designed to accelerate and simplify development by providing modern technologies, a well-structured architecture, and ready-to-use examples:

⚡ **Uses the latest and most modern technologies** – ```Zustand```, ```Tailwind```, ```TanStack Query```, ```Zod```, ```React Hook Form```, and more. <br>
📂 **Clear folder architecture (FSD)** – no need to think about where to place files; everything is structured and ready to use. <br>
📖 **Ready-to-use code examples** – quickly learn how to use key technologies with practical code snippets included in the template. <br>
⚙️ **Typed env file** – prevents errors with strict validation of environment variables. <br>
🖌️ **Smart Tailwind class merging** – automatically resolves style conflicts and simplifies working with dynamic classes. <br>
🖼️ **Built-in SVG support with SVGR** – import SVGs as React components and style them dynamically. <br>
📝 **Commitizen support** – makes writing commit messages easier and faster by guiding you through the process. <br>
🔗 **Clean import rules** – alias-based imports keep your code clean and eliminate long relative paths. <br>

Just grab it and start developing! 🚀



## 🛠️ Tech Stack
- [Typescript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/docs)
- [Tailwind](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/)
- [Zod](https://zod.dev/?id=basic-usage)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [Axios](https://axios-http.com/docs/intro)
- [React Hook Forms](https://react-hook-form.com/)


## 📚 Getting Started
### 1. Install dependencies:
```bash
yarn install
```
### 2. Create a .env file:
```bash
cp .env.example .env
```
### 3. Run the development server:
```bash
yarn dev
```
</br>
You will have server running at:
- App - http://localhost:3000



## 📁 Project structure
```
├── public/
|     └── icons/                # Stores static assets like app icons (SVG files, etc.)
└── src/
    ├── app/                    # Contains the core application logic and structure
    |    ├── layout.tsx
    |    ├── page.tsx
    |    └── styles/            # Global application styles (CSS/SCSS)
    |          └── global.css   # Global styles applied across the app
    ├── widgets/                # Compositions of several features into a page-level block
    ├── entities/                # <entity>/{api,types,hooks} — API access only, no UI
    ├── features/                # <feature>/{ui,hooks,schemas,lib,types}
    ├── shared/
    |      ├── constants/       # App-wide constants (e.g., enums, configuration values)
    |      ├── providers/       # Context providers and dependency injection
    |      ├── store/           # State management (e.g., Redux, Zustand)
    |      ├── hooks/           # Reusable React hooks
    |      ├── icons/           # Stores dynamic app icons (could be React components)
    |      ├── types/           # Shared TypeScript types and interfaces
    |      ├── lib/             # Utility functions and reusable helper libraries
    |      └── ui/              # UI components shared across the app
    └── env.ts                  # Configuration and validation of environment variables
```
📖 See [Feature-Sliced Design](#-feature-sliced-design-fsd) below for what belongs in each
folder and how imports between them are allowed to flow.



## 🧱 Feature-Sliced Design (FSD)
This template's `src/` folder follows [Feature-Sliced Design](https://feature-sliced.design/),
an architecture methodology that organizes code by **layers** (how close a piece of code is
to a concrete screen) instead of by technical role (`components/`, `hooks/`, `utils/`).
Read the [official docs](https://feature-sliced.design/docs) for the full methodology — this
section covers only how it's applied here.

### Layers, top to bottom
```
app → widgets → features → entities → shared
```
A layer may only import from **itself** and from layers **strictly below** it. `shared` is
the only layer with no import restrictions of its own — but it may never import from
`entities`, `features`, `widgets` or `app`. This is enforced automatically by
`eslint-plugin-boundaries` (`boundaries/dependencies` rule in `.eslintrc.js`) — an illegal
import (e.g. `entities` importing from `features`) fails `yarn lint`.

| Folder | What goes here |
| --- | --- |
| `src/app/` | Routing, layouts, pages, global styles. **Server Components only** — no hooks, no `'use client'`, no business logic. Composes `widgets`/`features` and prefetches their data. |
| `src/widgets/` | Compositions of several `features` (and `entities`) into one page-level block (e.g. a page header combining search + nav + user menu). Optional layer — small apps may not need it. |
| `src/features/` | A user-facing capability and the UI/logic behind it: `ui/` (components, `'use client'` on the leaves that need it), `hooks/`, `schemas/` (Zod), `lib/` (feature-local helpers), `types/`. Scaffolded only via `yarn generate:feature <name>`. |
| `src/entities/` | The API access layer, one folder per route prefix (`/users` → `entities/users/`): `api/` (axios requests), `types/` (params, payloads, responses), `hooks/` (TanStack Query hooks). **No UI, no business logic.** Scaffolded only via `yarn generate:entity <name>`. |
| `src/shared/` | Everything global and feature-agnostic, with **no slices** — just segments: `ui/` (reusable components), `lib/` (utils + configured library instances like `axios`, `queryClient`, `cn`), `hooks/` (global hooks, not tied to any API call), `store/` (all Zustand stores), `providers/` (all React context providers, mounted in `app/layout.tsx`), `constants/` (incl. the `QueryKeys` enum), `types/` (shared types), `icons/` (custom SVG icons imported as React components). **No `api/` segment** — every API call belongs to an `entities/<entity>`, even a one-off endpoint; see [🚫 No `shared/api`](#-no-sharedapi-every-api-call-is-an-entity) below. |

### 🚫 No layer-wide barrels
**No layer root and no `shared` segment root has an `index.ts` that re-exports its
contents** — `src/app/`, `src/widgets/`, `src/features/`, `src/entities/`, `src/shared/`
and `src/shared/<segment>/` stay barrel-free:
```typescript
// ✅ Good
import { useGetTodos } from 'entities/todos/hooks/get';
import { cn } from 'shared/lib/styles';

// ❌ Forbidden — shared/lib/index.ts, features/index.ts
import { cn } from 'shared/lib';
import { CreateTodoForm } from 'features';
```
A layer-wide barrel defeats Next.js/webpack tree-shaking (importing one symbol pulls in the
whole layer's graph), slows down cold builds and HMR, and hides where a symbol actually
lives. It is blocked by ESLint's `no-restricted-syntax` (an override scoped to exactly those
files rejects `export * from '...'` and `export { x } from '...'`), and the layer-root ones
are additionally rejected by `boundaries/no-unknown-files`.

**A slice barrel is allowed**: a single `index.ts` on a slice root, re-exporting that
slice's public API:
```typescript
// features/members/index.ts
export { RemoveMemberButton } from './ui/remove-member-button';
export { RemoveMemberDialog } from './ui/remove-member-dialog';
```
```typescript
// ✅ Good — one slice, one barrel
import { RemoveMemberButton } from 'features/members';
```
It stays inside the boundaries model: `.eslintrc.js` classifies `<layer>/<slice>/index.ts`
as that slice, so it may only re-export files from its own slice and importers still obey
the layer order. The generators don't create one — add it by hand if the slice needs it.

### 🚫 No `shared/api` — every API call is an entity
There is no "misc API calls that don't belong to a feature" escape hatch. Any code that
calls `api.get/post/put/patch/delete` lives in `entities/<entity>/api/`, generated by
`yarn generate:entity <name>` — even for a single one-off endpoint. `shared/hooks/` is for
hooks that don't touch the network (`useDebounce`, `useMediaQuery`, …); a hook that wraps a
TanStack Query call belongs in `entities/<entity>/hooks/` instead.

### 🔒 The `src/` folder structure is locked down — even inside a slice
Every file under `src/` must belong to one of the folders documented above, and each layer
is scoped to its *specific* segments — not just "anything under this layer":
- `widgets/*/(ui|hooks|lib|types)/**`
- `features/*/(ui|hooks|schemas|lib|types)/**`
- `entities/*/(api|hooks|types)/**`
- `shared/(ui|types|store|providers|lib|icons|hooks|constants)/**`

So there's no `src/utils/`, no `src/shared/api/` — but also no `entities/todos/ui/`
(entities have no UI), no `features/todos/store/`, no `widgets/nav/random/`. This isn't just
a convention: `eslint-plugin-boundaries`'s `boundaries/no-unknown-files` rule fails
`yarn lint` on any file that doesn't match one of the patterns above, however plausible the
folder name looks. If a new kind of code doesn't fit an existing segment, extend
`boundaries/elements` in `.eslintrc.js` on purpose — don't add a folder it doesn't know
about.

### 🔐 `process.env` only in `src/env.ts`
`process.env.SOMETHING` anywhere outside `src/env.ts` fails lint with ESLint's
`no-restricted-properties` rule. Add the variable to the Zod schema in `env.ts` (see
[⚙️ Typed Environment Configuration](#️-typed-environment-configuration-with-example) below)
and import the validated `env` object everywhere else:
```typescript
// ✅ Good
import { env } from 'env';
const apiUrl = env.NEXT_PUBLIC_API_URL;

// ❌ Fails lint anywhere except src/env.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 🔤 Naming — kebab-case for files and folders
Every file and folder in `src/` is **kebab-case**: `create-todo-form.tsx`,
`entities/todos/`, `features/todos/ui/create-todo-form/`. Never `CreateTodoForm.tsx`,
`todos_list.ts`, or `entities/Todos/`.

The one exception is `src/app/**`, which follows **Next.js App Router's own** naming
instead — dynamic segments (`[id]`), route groups (`(marketing)`), parallel routes
(`@modal`), and the fixed special filenames (`page.tsx`, `layout.tsx`, `route.ts`, …) don't
fit plain kebab-case, and don't need to.

Enforced by `eslint-plugin-check-file`:
```
✅ src/features/todos/ui/create-todo-form/create-todo-form.tsx
❌ src/features/todos/ui/CreateTodoForm/createTodoForm.tsx   — fails yarn lint
```

## 🤖 Claude Code agents & commands
This repo ships a `.claude/` folder with Claude Code agents and slash commands tuned to this
template's FSD/Next.js conventions (the same rules documented in `CLAUDE.md`), so anyone using
Claude Code in this repo gets them automatically — no setup required.

| Path | What it does |
| --- | --- |
| `.claude/commands/pr-review.md` (`/pr-review`) | Orchestrated PR review: runs the two agents below in parallel against a PR (or the local branch diff), merges their findings, and publishes one review. |
| `.claude/agents/pr-review/pr-architecture-reviewer.md` | Checks a diff against this repo's own architecture rules, read live from `CLAUDE.md` (Server/Client components, generator-only `entities`/`features`, no barrel files, layer boundaries, `env.ts`, Zod, `QueryKeys`, Tailwind-only styling, kebab-case). |
| `.claude/agents/pr-review/pr-functional-reviewer.md` | Verifies a PR actually implements its ticket and hunts for logic bugs on the real code path (query-key mismatches, stale query-cache data, unhandled loading/error states). |
| `.claude/agents/code-reviewer.md` | General quality/maintainability review for a diff. No test-coverage checks — this project has no test suite. |
| `.claude/agents/security-auditor.md` | Frontend-focused security review: XSS, `NEXT_PUBLIC_*` env leakage, CSP/security headers, client-side token handling. |
| `.claude/agents/ai-engineer.md` | LLM/RAG integration specialist for AI-powered feature work. |

These are **not** a substitute for `yarn lint:fix && yarn typescript` — they catch things lint
can't (architectural intent, ticket coverage, logic bugs), while ESLint/TypeScript remain the
hard gate for everything mechanical.

## Guidelines
### 📝 Commits format
Commitlint is used to check if your commit messages meet the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/). This format helps create a consistent, structured commit history, making it easier to understand the project’s development over time, automate changelog generation, and manage versioning.
The commit message format follows the pattern:
```
type(scope?): subject
```
#### Breakdown of Each Part:
- **type**: The type of change being made. It should be one of the defined commit types (see below).
- **scope** *(optional)*: A small context or part of the project that is being affected by the commit (e.g., `api`, `ui`, `auth`). This is optional but helps to narrow down the area of change.
- **subject**: A short and concise description of what the commit does.
#### Real world examples can look like this:
```
chore: run tests on travis ci
```
```
fix(stepper): update button actions
```
```
feat(passenger): add comment section
```
Common types according to [commitlint-config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum) can be:
* **build**: Changes related to the build system or external dependencies.
* **ci**: Updates to the continuous integration configuration or scripts.
* **chore**: Routine tasks, maintenance, or general updates.
* **docs**: Changes to documentation.
* **feat**: Introduces a new feature for the user or customer.
* **fix**: Resolves a bug or fixes an issue.
* **perf**: Improvements related to performance.
* **refactor**: Code restructuring that does not change its external behavior.
* **revert**: Reverts a previous commit.
* **style**: Changes that do not affect the code's logic (e.g., formatting).
* **test**: Adds or modifies tests.
#### Use Commitizen to Commit
Once you’ve installed all the required libraries, run ```yarn install```. After everything is set up, when you run ```git commit```, Commitizen will automatically trigger and ask you to choose the type of commit, enter a scope (if applicable), and provide a subject for your commit.
</br>
To start the commit redactor, simply run:
```
git add .
git commit
```
#### What Happens During the Commit Process:
- **Commit Type**: You will be prompted to select the type of change (e.g., feat, fix, chore, etc.).
- **Scope** (optional): You will be asked to provide a scope (e.g., auth, ui, etc.).
- **Subject**: Finally, you'll be asked to enter a short description of what the commit does.

<br>

### 🌍🖼️ Nextjs External Images
Next.js has built-in support for optimizing images using the next/image component. However, by default, Next.js blocks external images unless explicitly allowed. This guide explains how to configure Next.js to permit images from external domains.
#### Configuration
To enable images from external sources, modify your ```next.config.mjs``` file and add the ```images``` configuration with ```remotePatterns```.
#### Steps:
1. Open your Next.js project.
2. Locate the next.config.mjs file (or create one if it doesn't exist).
3. Add or modify the images configuration to allow remote sources.
#### Example Configuration
```
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
  ...
};
```
#### Explanation
* ```images.remotePatterns``` defines an array of allowed remote image sources.
* Each entry consists of:
    * **protocol**: Allowed protocol (e.g., ```https```).
    * **hostname**: External domain where images are hosted.
    * **pathname**: Path pattern for image URLs.
#### Usage Example
Once configured, you can use external images with the ```next/image``` component:
```
<Image
  src="https://firebasestorage.googleapis.com/v0/b/example-bucket/o/image.jpg"
  width={500}
  height={300}
  alt="Example Image"
/>
```
#### Troubleshooting
* If images do not load, ensure the domain is correctly added in ```remotePatterns```.
* If running locally, restart the Next.js server after modifying ```next.config.mjs```.

<br>

### 🖼️ Using SVGs
Our template supports using SVGs as React components with SVGR.
#### 🚀 Using SVG as React Components
You can store SVG icons inside the ```shared/icons``` folder and import them as components.
##### 📁 Folder Structure
```
├── src/
|     └── shared/
|           └── icons/
|                 └──test-icon.svg
```
##### ✅ How to Use
```
import TestIcon from "shared/icons/test-icon.svg";

const ExampleComponent = () => {
  return (
    <TestIcon width={50} height={50} color="red" />
  );
};

export default ExampleComponent;
```
##### 📌 When to Use This
* When you need to style SVGs with Tailwind or props (```width```, ```color```, ```fill```).
* When using SVGs as inline components in React.
* When you want flexibility with dynamic styling.

This setup ensures flexibility, allowing you to choose the best method depending on your use case. 🚀

<br>

### 🎨 Styling — Tailwind only, no custom CSS
This template styles **exclusively with Tailwind utility classes**. There is no other
stylesheet to fall back to: the only CSS file in `src/` is `src/app/styles/global.css`
(the `@tailwind` directives, plus — if you add a library like shadcn/ui — its theme CSS
variables in `@layer base`). No `*.css`, `*.module.css`, `*.scss` file anywhere else.

This is enforced by ESLint's `no-restricted-imports` rule in `.eslintrc.js`: importing any
local stylesheet other than `app/styles/global.css` fails `yarn lint`.
```typescript
// ✅ Good — Tailwind classes, merged with cn()
<button className={cn('rounded px-4 py-2', primary && 'bg-blue-500')}>Click me</button>

// ❌ Fails lint — no local stylesheets besides app/styles/global.css
import './button.css';
import styles from './button.module.css';
```
**Need a reusable value** (a brand color, a spacing scale, a custom breakpoint, a font)?
Add it to **`tailwind.config.ts`** (`theme.extend`) and use it as a utility class —
don't hand-write a CSS class for it:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: { brand: '#1a73e8' },
  },
},
```
```tsx
// ✅ Good
<div className="bg-brand" />

// ❌ Don't recreate this as a hand-written CSS class
```
**A UI library ships its own stylesheet** (Swiper, react-day-picker, …)? Import it directly
from the package — never copy it into `src/`:
```typescript
// ✅ Good — imported straight from node_modules, not duplicated in src/
import 'swiper/css';
```

<br>

### 🖌️ Tailwind CSS Class Merging Guide
When working with dynamic classes in Tailwind CSS, class merging helps avoid conflicts and simplifies styling. We use ```clsx``` and ```tailwind-merge``` to efficiently combine classes, ensuring cleaner and more maintainable code.

#### Example
##### ❌ Without Merging Classes
```
const Button = ({ primary, disabled }: { primary: boolean, disabled: boolean }) => {
  return (
    <button className={`px-4 py-2 ${primary ? 'bg-blue-500' : 'bg-gray-500'} ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-opacity-80'}`}>
      Click me
    </button>
  );
};
```

##### ✅ With Class Merging

```
const Button = ({ primary, disabled }: { primary: boolean, disabled: boolean }) => {
  return (
    <button className={cn(
      'px-4 py-2 rounded-lg text-white',
      primary ? 'bg-blue-500' : 'bg-gray-500',
      disabled && 'bg-gray-300 cursor-not-allowed',
      !disabled && 'hover:bg-opacity-80'
    )}>
      Click me
    </button>
  );
};
```

<br>

### ⚙️ Typed Environment Configuration with Example
This setup uses typed environment variables to validate configuration, reducing runtime errors by ensuring all required variables are provided and preventing issues with non-existent variables.

**Example:**
```
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  client: {
    // Client-side variables must be prefixed with NEXT_PUBLIC_ to be exposed to the browser
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_NODE_ENV: z.enum(['production', 'development', 'test']),
  },
  server: {
    NEXT_AUTH_SESSION_EXPIRED: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_AUTH_SESSION_EXPIRED: process.env.NEXT_AUTH_SESSION_EXPIRED,
  },
});

export { env };
```

**Example of how to access an environment variable**
```
const apiUrl = env.NEXT_PUBLIC_API_URL; // Access client-side variable
const sessionExpired = env.NEXT_AUTH_SESSION_EXPIRED; // Access server-side variable
```

<br>

### 🔗 Properly Using Import Aliases in Your Project
Thanks to `baseUrl: "./src"` in `tsconfig.json`, every folder under `src/` can be imported
by its path instead of a long relative one — no extra alias configuration needed.

**Basic Import:** import the exact file that declares what you need:
```
import { useGetUsers } from 'entities/users/hooks/get';
import { LoginButton } from 'features/auth/ui/login-button/login-button';
import { fetchData } from 'shared/lib/fetch-data';
```
**Import the Concrete File — the only barrel is a slice barrel:** layer roots and `shared`
segments never have an `index.ts` (see
[🚫 No layer-wide barrels](#-no-layer-wide-barrels)), so an import resolves to a real file —
or, at most, to a slice that chose to expose one:
```
// ✅ Good: import the file that declares the symbol
import { LoginForm } from 'features/auth/ui/login-form/login-form';

// ✅ Also fine, if features/auth/index.ts exists
import { LoginForm } from 'features/auth';

// ❌ Forbidden: features/index.ts, shared/ui/index.ts
import { LoginForm } from 'features';
```
Instead of writing a long relative path like ```../../../shared/ui/button/button```, use the
absolute one — ```shared/ui/button/button``` — from anywhere in the project. This keeps
imports short and explicit without hiding behind a barrel.

Which layer is allowed to import which is enforced by `eslint-plugin-boundaries`
(`boundaries/dependencies` in `.eslintrc.js`) — see
[🧱 Feature-Sliced Design](#-feature-sliced-design-fsd) above for the allowed layer order.

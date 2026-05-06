# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Curation is an invite only social media with ability to create events and posts selling rare expensive items built with Next.js 16+ App Router, TypeScript, and Feature-Sliced Design architecture.

## Essential Commands

```bash
# Development
yarn dev          # Start development server with Turbopack
yarn build        # Production build
yarn start        # Start production server

# Code Quality
yarn lint         # Run ESLint
yarn lint:fix     # Auto-fix ESLint issues
yarn typescript   # Type checking (no emit)

# Code Generation
yarn generate:entity EntityName    # Create new business entity with CRUD
yarn generate:feature FeatureName  # Create new feature module

# Git
yarn commit       # Use Commitizen for conventional commits
```

## Architecture

### Feature-Sliced Design (FSD) Structure

```
src/
├── app/           # Next.js App Router pages
├── entities/      # Business entities with React Query hooks
│   ├── user/           # User entity
│   │   ├── api/        # React Query hooks (useUpdateUser, etc.)
│   │   └── index.ts
│   ├── user-preferences/
│   │   ├── api/        # React Query hooks (useUpsertPreferences, etc.)
│   │   └── index.ts
│   ├── general/        # Shared hooks used across multiple features/widgets
│   │   └── <entity>/   # Place shared hooks here when needed
│   └── index.ts        # Re-exports all entities
├── features/      # User interactions (auth, theme, CRUD operations)
│   └── <feature>/
│       └── hooks/      # Feature-specific orchestration hooks only
├── shared/        # Reusable code
│   ├── ui/       # UI components (shadcn/ui + custom)
│   ├── icons/    # SVG icons as React components
│   ├── api/      # API services (HTTP methods only, no hooks)
│   └── lib/      # Utilities and helpers
└── widgets/       # Page-level composite components
```

**Import Rules (Enforced by ESLint):**

- `app` → can import from anywhere
- `widgets` → can import from `features`, `entities`, `shared`
- `features` → can import from `entities`, `shared`
- `entities` → can import from `shared`
- `shared` → cannot import from other layers
- **Use narrow imports** — import from the specific subfolder, not the barrel: `import { Foo } from 'shared/ui/foo'` instead of `import { Foo } from 'shared/ui'`

### State Management

- **Authentication**: Zustand store in `features/auth/model/store.ts`
- **Server State**: TanStack Query with mock data in `shared/api/mock/`
- **UI State**: Local React state or Zustand for complex cases

### API Architecture

The API layer is split into two parts:

1. **Services** (`shared/api/`) - Pure HTTP methods, no React hooks
2. **Hooks** (`entities/<entity>/api/`) - React Query hooks that wrap services

This separation keeps services reusable and places React-specific code in the entities layer where it belongs in FSD.

### UI Development

- **Component Library**: shadcn/ui components in `shared/ui/`
- **Icons**: SVG icons in `shared/icons/`, imported as React components
- **Theme**: Purple color system with HSL tokens in `tailwind.config.ts`
- **Styling**: Tailwind CSS with custom utilities

## Key Technical Decisions

1. **Server/Client Components**: Use `"use client"` only when needed (interactivity, hooks)
2. **Environment Variables**: Type-safe with Zod validation in `src/env.ts`
3. **SVG Handling**: SVGR transforms SVGs to React components
4. **Form Handling**: React Hook Form + Zod for validation (see Forms section below)
5. **Data Fetching**: TanStack Query for all API calls
6. **Routing**: File-based with Next.js App Router
7. **Single Export Per File**: Each file should export only one component or hook. Split multiple components into separate files within the same folder

## Forms

**IMPORTANT: Always use React Hook Form for all form handling.** Do NOT use `useState` for form fields.

### Required Pattern

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 1. Define schema
const formSchema = z.object({
  fieldName: z.string().min(1, 'Field is required'),
});

type FormData = z.infer<typeof formSchema>;

// 2. Use the form hook
const {
  register,
  handleSubmit,
  formState: { errors, isDirty, isSubmitting },
  reset,
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { fieldName: '' },
});

// 3. Handle submission
const onSubmit = async (data: FormData) => {
  await api.mutateAsync(data);
  reset(data); // Reset dirty state after successful save
};
```

### Key Rules

- **Never use `useState` for form fields** - use `register()` or controlled fields with `Controller`
- **Always use Zod schemas** for validation instead of manual validation
- **Use `isDirty`** to detect changes instead of manual comparison
- **Use `isSubmitting`** for loading states instead of mutation.isPending
- **Call `reset(data)`** after successful submission to sync form state
- **Encapsulate form logic in custom hooks** - place form handlers in `features/<feature-name>/hooks/` folder to keep UI components clean and free of business logic
- **Name files with kebab-case** - created files should use kebab-case naming style.

### Form Hook Pattern

**IMPORTANT:** All form business logic must be encapsulated in custom hooks. UI components should only contain render logic.

```typescript
// features/settings/hooks/use-profile-form.ts
import { useUpdateUser } from 'entities/user';

export const useProfileForm = () => {
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateUser();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  // Sync with external data
  useEffect(() => {
    if (user) {
      form.reset({ firstName: user.firstName, lastName: user.lastName });
    }
  }, [user, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    await updateProfileMutation.mutateAsync(data);
    form.reset(data);
  });

  return {
    form,
    onSubmit,
    isLoading: updateProfileMutation.isPending,
    isSuccess: updateProfileMutation.isSuccess,
    error: updateProfileMutation.error,
  };
};

// features/settings/hooks/index.ts
export * from './use-profile-form';

// UI component stays clean - only render logic
export const ProfileSettings = () => {
  const { form, onSubmit, isLoading } = useProfileForm();
  const { register, formState: { errors, isDirty } } = form;

  return (
    <form onSubmit={onSubmit}>
      <Input {...register('firstName')} error={errors.firstName?.message} />
      <Button type="submit" disabled={!isDirty || isLoading}>Save</Button>
    </form>
  );
};
```

## Development Patterns

### Creating New Features

Use generators for consistency:

```bash
yarn generate:feature feature-name  # Creates feature structure
yarn generate:entity entity-name    # Creates entity with CRUD
```

### Working with UI Components

1. Check existing components in `shared/ui/` before creating new ones
2. Follow shadcn/ui patterns for consistency
3. Use design tokens from Tailwind config
4. Always use shadcn for new components and try avoiding custom components

### API Integration

**API Services (in `shared/api/`):**
Each API service has its own folder with types and service (HTTP methods only, no React hooks):

```
shared/api/
├── auth/
│   ├── types.ts      # Auth types (IUser, ILoginRequest, etc.)
│   ├── service.ts    # Auth API methods
│   └── index.ts      # Re-exports
├── users/
│   ├── types.ts      # User types (IUpdateUserRequest, etc.)
│   ├── service.ts    # User API methods
│   └── index.ts
├── user-preferences/
│   ├── types.ts      # Preferences types
│   ├── service.ts    # Preferences API methods
│   └── index.ts
└── index.ts          # Re-exports all services
```

**React Query Hooks (in `entities/<entity>/api/`):**
Each entity has its own folder with React Query hooks that wrap the shared services:

```
entities/
├── user/
│   ├── api/
│   │   ├── use-update-user.ts    # Mutation hook for user updates
│   │   └── index.ts
│   └── index.ts
├── user-preferences/
│   ├── api/
│   │   ├── use-upsert-preferences.ts
│   │   └── index.ts
│   └── index.ts
├── general/            # For shared hooks across multiple features/widgets
│   └── <entity-name>/  # Place shared hooks here
└── index.ts            # Re-exports all entities
```

**Creating a new API integration:**

1. Create service in `shared/api/<service-name>/`:

   - Add `types.ts` with request/response types
   - Add `service.ts` with API methods
   - Add `index.ts` that exports both
   - Update `shared/api/index.ts` to export the new service

2. Create hooks in `entities/<entity-name>/api/`:

   - Add hook files (e.g., `use-get-<entity>.ts`, `use-create-<entity>.ts`)
   - Add `index.ts` that exports all hooks
   - Update `entities/<entity-name>/index.ts` to export from `./api`
   - Update `entities/index.ts` to export the new entity

3. For shared hooks used by multiple features/widgets:
   - Create in `entities/general/<entity-name>/`
   - This keeps hooks accessible without circular dependencies

**Hook Rules:**

- **Always use `mutateAsync()` instead of `mutate()`** for mutations
- Import hooks from `entities` layer: `import { useUpdateUser } from 'entities/user'`
- Feature-specific orchestration hooks stay in `features/<feature>/hooks/` but import entity hooks

### Common Patterns

```typescript
// Import UI components

// Use React Query hooks from entities
import { useUpdateUser } from 'entities/user';
import { useUpsertPreferences } from 'entities/user-preferences';

// Access auth state
import { useAuthStore } from 'features/auth';
// Use API services directly (for custom logic)
import { usersApi } from 'shared/api';
// Import icons
import { IconName } from 'shared/icons';
import { Button, Card } from 'shared/ui';
```

## Environment Configuration

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_API_URL`: Backend API URL (defaults to mock)
- `NEXT_PUBLIC_APP_URL`: Application URL

## Testing Commands

Currently no test framework configured. When adding tests, update this section with test commands.

## Checklist for New Code

- [ ] Uses barrel exports (`index.ts`) at every folder level
- [ ] Respects FSD layer boundaries (no upward imports)
- [ ] Uses narrow imports from specific subfolders (not top-level barrels)
- [ ] Client components marked with `'use client'`
- [ ] Single component/hook per file (split into separate files if needed)
- [ ] API services placed in `shared/api/<service-name>/`
- [ ] React Query hooks placed in `entities/<entity-name>/api/`
- [ ] API hooks invalidate related queries on mutation success
- [ ] Form validation uses Zod schema with `zodResolver`
- [ ] Tailwind classes merged with `cn()` when conditional
- [ ] No banned variable names (`e`, `cb`, `item`, `i`, `err`, `el`)
- [ ] Arrow function expressions, max 3 params
- [ ] Query keys added to `QueryKeys` enum
- [ ] Ran yarn typescript and yarn lint
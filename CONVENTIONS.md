# Project Conventions

## Folder Structure

```
src/
├── core/           # Infrastructure: navigation, store, API, storage, theme
├── shared/         # Reusable code used by ≥2 features
├── features/       # Business logic, isolated per feature
└── assets/         # Fonts, images, icons
```

---

## Naming Conventions

### Files

| Type                | Convention                    | Example             |
| ------------------- | ----------------------------- | ------------------- |
| React component     | PascalCase                    | `LoginScreen.tsx`   |
| Hook                | camelCase prefixed with `use` | `useAuth.ts`        |
| Utility function    | camelCase                     | `formatDate.ts`     |
| Type/Interface file | camelCase                     | `auth.types.ts`     |
| Constant file       | camelCase                     | `storageKeys.ts`    |
| Navigator           | PascalCase                    | `AuthNavigator.tsx` |
| Slice               | camelCase                     | `authSlice.ts`      |
| API definition      | camelCase                     | `auth.api.ts`       |
| Barrel export       | always `index.ts`             | `index.ts`          |

### Identifiers

| Type                | Convention                              | Example           |
| ------------------- | --------------------------------------- | ----------------- |
| Component           | PascalCase                              | `LoginButton`     |
| Hook                | camelCase                               | `useAuthState`    |
| Interface           | PascalCase prefixed with `I` (optional) | `AuthState`       |
| Type alias          | PascalCase                              | `LoginPayload`    |
| Enum                | PascalCase                              | `AuthStatus`      |
| Constant            | SCREAMING_SNAKE_CASE                    | `MAX_RETRY_COUNT` |
| Variable / function | camelCase                               | `handleLogin`     |

---

## Import Conventions

### Order (enforced by ESLint)

1. React
2. React Native
3. Third-party libraries
4. Internal (`@core`, `@shared`, `@features`)
5. Relative (`./ ../`)
6. Type imports

```ts
// ✅ Correct
import React from 'react';
import { View } from 'react-native';

import { useDispatch } from 'react-redux';

import { Button } from '@shared/components';
import { useAuth } from '@features/auth';

import { LoginForm } from './LoginForm';
import type { LoginScreenProps } from './login.types';
```

### Rules

- Always use path aliases (`@core/`, `@shared/`, `@features/`) for cross-directory imports
- Use relative imports only within the same feature
- Use `import type` for type-only imports
- Never import from a sibling feature directly — go through the feature's barrel

---

## Feature Boundaries

Each feature in `src/features/` is a self-contained module.

```
features/
└── auth/
    ├── components/     # Auth-specific UI
    ├── hooks/          # Auth-specific hooks
    ├── navigation/     # AuthNavigator
    ├── screens/        # Auth screens
    ├── types/          # Auth types
    ├── api/            # RTK Query endpoint injection (optional)
    └── index.ts        # Selective public barrel
```

### Rules

- Features must NOT import from other features directly
- If two features share logic, extract it to `src/shared/`
- A feature's public API is defined only by its `index.ts` barrel
- Navigation params owned by a feature live inside that feature

---

## Barrel Exports (Selective)

Barrels should be **selective** — only export what other modules should consume.

```ts
// ✅ features/auth/index.ts — only public surface
export { AuthNavigator } from './navigation/AuthNavigator';
export { useAuth } from './hooks/useAuth';
export type { AuthUser } from './types/auth.types';

// ❌ Never re-export everything
export * from './screens/LoginScreen'; // internal screen, not public
```

---

## TypeScript Standards

- No `any`
- No `as any`
- No `@ts-ignore`
- Use `unknown` in catch blocks
- Use `type` imports for type-only usage
- Prefer `interface` for object shapes, `type` for unions/intersections

---

## Component Standards

```tsx
// ✅ Always name your components (required for React DevTools)
export function LoginScreen(): React.JSX.Element {
  return <View />;
}

// ✅ Props type above component
interface LoginScreenProps {
  onSuccess: () => void;
}

// ❌ Avoid anonymous default exports
export default () => <View />; // no display name
```

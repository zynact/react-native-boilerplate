# Project Architecture & Conventions

This project follows a **Feature-First Architecture** designed for maintainability, encapsulation, and scaling. Rather than organizing files by technical concern (e.g., placing all screens in one folder, all hooks in another), code is grouped by business feature.

## Folder Structure

```
src/
├── @types/         # Global type definitions (e.g., PNG, env decls)
├── assets/         # App-wide static assets (images, fonts, localizations)
├── core/           # App-wide infrastructure (strictly independent of features)
│   ├── api/        # RTK Query base query and centralized error parsing
│   ├── auth/       # Global Authentication states and initializer hooks
│   ├── config/     # Environment configurations and runtime validation
│   ├── error/      # Error boundary wrapper and mapping filters
│   ├── navigation/ # Root stacks, modal sheets, and deep linking controllers
│   ├── providers/  # Store and Context bindings (RootProvider)
│   ├── services/   # Centralized reusable utility modules
│   ├── storage/    # Core secure storage wrappers (MMKV)
│   ├── store/      # Global Redux state configuration
│   └── theme/      # Style tokens, hooks, and nativewind settings
├── shared/         # Shared assets used by two or more features
│   ├── components/ # Reusable UI primitives (Buttons, Text, Loader, etc.)
│   ├── constants/  # Reusable shared constants
│   ├── hooks/      # Shared hooks (e.g., useApiError)
│   ├── types/      # Common application schemas and types
│   ├── utils/      # General utilities (e.g., date formats, asserts)
│   └── validation/ # Global form and model schemas
└── features/       # Self-contained domain areas (features)
    ├── auth/       # Login, register, and password-restore interfaces
    ├── home/       # Home dashboards
    └── profile/    # User settings and profile managers
```

---

## Feature Boundaries

A feature in `src/features/` is a self-contained slice of business logic:

```
features/my-feature/
├── components/     # Feature-only UI components
├── hooks/          # Hooks scoped specifically to this domain
├── navigation/     # Feature navigators and routing rules
├── screens/        # Features screens (views)
├── types/          # Domain-specific TypeScript declarations
├── api/            # API endpoint injection queries
└── index.ts        # Public surface barrel
```

### Dependency Rules

1. **Zero Direct Feature-to-Feature Imports**: A feature must **never** import from another feature's internal directories.
2. **Access via Barrels**: If feature `A` must reference something from feature `B`, it must only import from the public surface exposed by `src/features/B/index.ts`.
3. **Refactoring to Shared**: If logic, UI, or types are shared across two or more features, extract them into `src/shared/`.

---

## TypeScript & Code Standards

- **Strict Type Checking**: Explicitly configure `"strict": true` in `tsconfig.json`.
- **No Bypasses**: The use of `any`, `as any`, `@ts-ignore`, or disabling ESLint formatting is strictly prohibited. Use proper union types, `unknown` in catch blocks, and generic parameters.
- **Selective Exports**: In index barrels, only export files that should be consumed by outer modules. Do not export internal screens or helpers.

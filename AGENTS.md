# AGENTS.md — AI Agent Guide for react-native-template

> **Read this first.** This file is the authoritative reference for any AI agent working on a project built from this template. It supersedes generic knowledge about React Native. Follow every rule here exactly.

---

## 1. Project Overview

| Layer    | Path            | Purpose                                                                |
| -------- | --------------- | ---------------------------------------------------------------------- |
| Core     | `src/core/`     | Infrastructure: API, auth, navigation, store, storage, services, theme |
| Shared   | `src/shared/`   | Reusable UI and utilities used by ≥ 2 features                         |
| Features | `src/features/` | Self-contained business domains                                        |
| Assets   | `src/assets/`   | Fonts, images, icons                                                   |

**Stack:** React Native · TypeScript (strict) · Redux Toolkit · RTK Query · NativeWind (Tailwind v3) · MMKV · React Navigation v7 · React Hook Form + Zod · react-native-reanimated

---

## 2. Hard Rules — Never Break These

### TypeScript

```
❌ any
❌ as any
❌ @ts-ignore
❌ @ts-expect-error (without a specific justified comment)
❌ Disabling ESLint to bypass a type error
✅ Use `unknown` in catch blocks
✅ Use `import type` for type-only imports
✅ Prefer `interface` for object shapes, `type` for unions/intersections
```

### API Layer

```
❌ NEVER call createApi() inside a feature — there is ONE baseApi
❌ NEVER import baseApi from the feature itself — always from @core/api
✅ Features inject endpoints with: baseApi.injectEndpoints({ ... })
✅ Always type endpoints with ApiResponse<T> or PaginatedApiResponse<T>
✅ Use transformResponse to unwrap the .data field before returning
```

### Feature Boundaries

```
❌ Feature A must NEVER import internal files from Feature B
❌ Never import directly from src/features/X/screens/SomeScreen
✅ Only import from a feature's public barrel: src/features/X/index.ts
✅ If two features share logic → move it to src/shared/
```

### Components

```
❌ No anonymous default exports: export default () => <View />
✅ Always use named exports: export function MyScreen(): React.JSX.Element
✅ Define props interface above the component
✅ All component names must be PascalCase
```

### Imports (ESLint-enforced order)

```typescript
// 1. React
import React from 'react';
// 2. React Native
import { View, Text } from 'react-native';
// 3. Third-party
import { useForm } from 'react-hook-form';
// 4. Internal aliases (@core, @shared, @features)
import { useAppSelector } from '@core/store';
import { Button } from '@shared/components';
// 5. Relative
import { LoginForm } from './LoginForm';
// 6. Types
import type { LoginScreenProps } from './login.types';
```

---

## 3. Path Aliases

Always use aliases for cross-directory imports. Never use `../../../`.

| Alias                | Resolves to             |
| -------------------- | ----------------------- |
| `@core/api`          | `src/core/api`          |
| `@core/auth`         | `src/core/auth`         |
| `@core/config`       | `src/core/config`       |
| `@core/navigation`   | `src/core/navigation`   |
| `@core/services`     | `src/core/services`     |
| `@core/storage`      | `src/core/storage`      |
| `@core/store`        | `src/core/store`        |
| `@core/theme`        | `src/core/theme`        |
| `@shared/components` | `src/shared/components` |
| `@shared/constants`  | `src/shared/constants`  |
| `@shared/hooks`      | `src/shared/hooks`      |
| `@shared/utils`      | `src/shared/utils`      |
| `@shared/validation` | `src/shared/validation` |
| `@features/auth`     | `src/features/auth`     |

---

## 4. Naming Conventions

| Thing                | Convention               | Example             |
| -------------------- | ------------------------ | ------------------- |
| React component file | PascalCase               | `LoginScreen.tsx`   |
| Hook file            | camelCase prefixed `use` | `useAuthState.ts`   |
| Utility file         | camelCase                | `formatDate.ts`     |
| Type file            | camelCase                | `auth.types.ts`     |
| Constant file        | camelCase                | `storageKeys.ts`    |
| Navigator            | PascalCase               | `AuthNavigator.tsx` |
| Redux slice          | camelCase                | `authSlice.ts`      |
| API file             | camelCase                | `auth.api.ts`       |
| Barrel               | always                   | `index.ts`          |
| Component identifier | PascalCase               | `LoginButton`       |
| Hook identifier      | camelCase                | `useAuthState`      |
| Constant value       | SCREAMING_SNAKE_CASE     | `MAX_RETRY_COUNT`   |
| Variable / function  | camelCase                | `handleLogin`       |

---

## 5. Core API Types — Always Use These

These types are exported from `@core/api`. Use them for every endpoint.

```typescript
import type {
  ApiResponse, // Single resource: { success, message, data: T }
  PaginatedApiResponse, // List resource: { success, message, data: T[], meta: PaginationMeta }
  PaginationMeta, // { total, page, limit, totalPages, hasNextPage, hasPrevPage }
  PaginationQuery, // { page?: number, limit?: number }
  IdRequest, // { id: string }
  NullResponse, // ApiResponse<null> — for delete/logout endpoints
} from '@core/api';
```

**Always `transformResponse` to unwrap `.data`:**

```typescript
getUser: builder.query<UserProfile, IdRequest>({
  query: ({ id }) => `/users/${id}`,
  transformResponse: (response: ApiResponse<UserProfile>) => response.data,
}),
```

---

## 6. Workflows — Step by Step

### 6.1 Add a New Feature

```
1. Create: src/features/<name>/
   ├── api/            (optional — if the feature has API calls)
   ├── components/     (feature-only UI)
   ├── hooks/          (feature-only hooks)
   ├── navigation/     (feature navigator)
   ├── screens/        (screen components)
   ├── types/          (TypeScript types)
   └── index.ts        (public barrel — only export what others need)

2. Add the navigator to AppNavigator or MainTabsNavigator
3. Register new route params in navigation.types.ts
4. Export the navigator from the feature's index.ts
5. Add the navigator to RootNavigator or AppNavigator
```

Or use the generator:

```bash
pnpm generate feature <name>
```

---

### 6.2 Add a New Screen to an Existing Feature

```
1. Create: src/features/<name>/screens/<ScreenName>.tsx
2. Add the route to the feature's param list in navigation.types.ts
3. Register the screen in the feature's navigator
4. If the screen needs a deep link, add it to linking.ts
```

Or use the generator:

```bash
pnpm generate screen <feature>/<ScreenName>
```

**Screen template:**

```typescript
import React from 'react';
import { View } from 'react-native';

import type { AuthScreenProps } from '@core/navigation';

interface LoginScreenProps extends AuthScreenProps<'Login'> {}

export function LoginScreen({ navigation }: LoginScreenProps): React.JSX.Element {
  return (
    <View className='flex-1 bg-white dark:bg-slate-900' />
  );
}
```

---

### 6.3 Add a New API Endpoint

```
1. Create: src/features/<name>/api/<name>.api.ts
2. Import baseApi from @core/api — NEVER call createApi()
3. Define request/response types using ApiResponse<T> or PaginatedApiResponse<T>
4. Use baseApi.injectEndpoints() with overrideExisting: false
5. Export hooks from the file
6. Export types/hooks from the feature's index.ts
```

**API file template:**

```typescript
import { baseApi } from '@core/api';
import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationQuery,
  IdRequest,
  NullResponse,
} from '@core/api';

// ── Types ──────────────────────────────────────────────────────────────────

export interface MyItem {
  _id: string;
  name: string;
}

export interface CreateMyItemRequest {
  name: string;
}

// ── API ────────────────────────────────────────────────────────────────────

export const myFeatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<MyItem[], PaginationQuery>({
      query: (params) => ({ url: '/items', params }),
      transformResponse: (res: PaginatedApiResponse<MyItem>) => res.data,
      providesTags: ['List'],
    }),
    getItemById: builder.query<MyItem, IdRequest>({
      query: ({ id }) => `/items/${id}`,
      transformResponse: (res: ApiResponse<MyItem>) => res.data,
      providesTags: (_result, _err, { id }) => [{ type: 'Detail', id }],
    }),
    createItem: builder.mutation<MyItem, CreateMyItemRequest>({
      query: (body) => ({ url: '/items', method: 'POST', body }),
      transformResponse: (res: ApiResponse<MyItem>) => res.data,
      invalidatesTags: ['List'],
    }),
    deleteItem: builder.mutation<null, IdRequest>({
      query: ({ id }) => ({ url: `/items/${id}`, method: 'DELETE' }),
      transformResponse: (res: NullResponse) => res.data,
      invalidatesTags: ['List'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
} = myFeatureApi;
```

---

### 6.4 Add a New Redux Slice

```
1. Create: src/features/<name>/<name>Slice.ts
2. Add the reducer to src/core/store/store.ts
3. Export actions and types from the feature's index.ts
```

Or use the generator:

```bash
pnpm generate slice <name>
```

---

### 6.5 Add a New Navigation Route

**To add a screen to the App stack:**

```typescript
// src/core/navigation/navigation.types.ts
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  MyNewScreen: { id: string }; // ← add here
};
```

**To add a bottom tab:**

```typescript
// src/core/navigation/navigation.types.ts
export type MainTabsParamList = {
  Home: undefined;
  Profile: undefined;
  MyTab: undefined; // ← add here
};
```

**To add a modal:**

```typescript
// src/core/navigation/navigation.types.ts
export type ModalStackParamList = {
  MyModal: { title: string }; // ← add here
};

// src/core/navigation/linking.ts — add the deep link path too
```

**Screen prop typing for the new route:**

```typescript
import type { AppScreenProps } from '@core/navigation';

export function MyNewScreen({ route }: AppScreenProps<'MyNewScreen'>): React.JSX.Element {
  const { id } = route.params;
  ...
}
```

---

### 6.6 Add a New Storage Key

```typescript
// src/shared/constants/storageKeys.ts — add to STORAGE_KEYS object
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',
  USER_PROFILE: 'user.profile',
  MY_NEW_KEY: 'feature.myValue', // ← add here
} as const;
```

Then use:

```typescript
import { StorageService } from '@core/storage';
import { STORAGE_KEYS } from '@shared/constants';

StorageService.setString(STORAGE_KEYS.MY_NEW_KEY, value);
const value = StorageService.getString(STORAGE_KEYS.MY_NEW_KEY);
```

---

## 7. State & Store

### Typed Redux Hooks — always use these, never raw hooks

```typescript
import { useAppDispatch, useAppSelector, useAppStore } from '@core/store';

// Read state
const token = useAppSelector((state) => state.auth.accessToken);
const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

// Dispatch
const dispatch = useAppDispatch();
dispatch(clearAuth());

// Imperative store access (use sparingly, prefer useAppSelector)
const store = useAppStore();
const currentState = store.getState();
```

### Auth State Shape

```typescript
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isInitializing: boolean; // true while reading tokens from MMKV at startup
  isAuthenticated: boolean;
}
```

### Auth Actions

```typescript
import { setTokens, clearAuth, initializeAuth } from '@core/auth';

dispatch(setTokens({ accessToken, refreshToken })); // on login success
dispatch(clearAuth()); // on logout
```

---

## 8. Navigation

### Navigate Between Screens

```typescript
import { useNavigation } from '@core/navigation';

const navigation = useNavigation();
navigation.navigate('App', { screen: 'MyNewScreen', params: { id: '123' } });
navigation.goBack();
```

### Bottom Sheet (imperative, not in nav stack)

```typescript
import { useBottomSheet } from '@core/navigation';

const { present, dismiss } = useBottomSheet();
present({ content: <MySheetContent />, snapPoints: ['40%', '80%'] });
```

### Dialog (imperative)

```typescript
import { useDialog } from '@core/navigation';

const { show, hide } = useDialog();
show({
  title: 'Are you sure?',
  message: 'This cannot be undone.',
  buttons: [
    { text: 'Cancel', style: 'cancel', onPress: hide },
    { text: 'Delete', style: 'destructive', onPress: handleDelete },
  ],
});
```

---

## 9. Core Services

### Toast

```typescript
import { ToastService } from '@core/services';

ToastService.success('Saved successfully');
ToastService.error('Something went wrong');
ToastService.warning('Please check your input');
ToastService.info('Update available');
```

### Logger

```typescript
import { logger } from '@core/services';

// Global
logger.info('User logged in', 'Auth');
logger.error('API failed', error, 'Bookings');

// Context logger (preferred — attaches module tag automatically)
const log = logger.createContext('BookingsScreen');
log.info('Fetching bookings');
log.error('Failed to load', error);
```

### Storage

```typescript
import { StorageService } from '@core/storage';
import { STORAGE_KEYS } from '@shared/constants';

StorageService.setString(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
StorageService.getString(STORAGE_KEYS.USER_PROFILE);
StorageService.remove(STORAGE_KEYS.USER_PROFILE);
StorageService.clear(); // wipes all MMKV keys
```

### Error Handling in Components

```typescript
import { useApiError } from '@shared/hooks';

const { isLoading, isError, error } = useGetItemsQuery();
const errorMessage = useApiError(error); // normalized human-readable string
```

---

## 10. Styling (NativeWind / Tailwind)

Use Tailwind classes via `className` prop. Never use `StyleSheet.create` for new code unless absolutely required by a library.

```tsx
// ✅ Correct
<View className='flex-1 p-4 bg-white dark:bg-slate-900'>
  <Text className='text-lg font-semibold text-slate-800 dark:text-slate-100'>
    Title
  </Text>
</View>

// ✅ Conditional classes
<View className={`p-4 ${isActive ? 'bg-primary-500' : 'bg-slate-100'}`} />

// ❌ Don't create new StyleSheet.create() blocks for simple layouts
```

**Design tokens** (use as Tailwind class values — see `tailwind.config.js`):

- Spacing: `xs(4)` `sm(8)` `md(16)` `lg(24)` `xl(32)` `2xl(48)` `3xl(64)`
- Radius: `sm(4)` `md(8)` `lg(12)` `xl(16)` `full`
- Font sizes: `xs(12)` `sm(14)` `md(16)` `lg(18)` `xl(20)` `2xl(24)`

---

## 11. Shared Components Reference

All available from `@shared/components`. Use these instead of building from scratch.

| Component      | Usage                                    |
| -------------- | ---------------------------------------- |
| `<AppText>`    | All text — supports NativeWind className |
| `<Button>`     | Primary/secondary/ghost variants         |
| `<Input>`      | Text input with label and error          |
| `<Card>`       | Container with shadow/border             |
| `<Badge>`      | Status chips                             |
| `<Chip>`       | Selectable tags                          |
| `<Avatar>`     | User avatar with fallback initials       |
| `<Loader>`     | Activity spinner                         |
| `<Skeleton>`   | Loading placeholder                      |
| `<EmptyState>` | Empty list placeholder with CTA          |
| `<ErrorState>` | Error placeholder with retry             |

**Form components** (React Hook Form integrated) from `@shared/components`:

| Component               | Usage                          |
| ----------------------- | ------------------------------ |
| `<Form>`                | Root form wrapper              |
| `<FormTextField>`       | Text input field               |
| `<FormTextArea>`        | Multiline text                 |
| `<FormOtpInput>`        | 6-digit OTP entry              |
| `<FormSelect>`          | Dropdown picker                |
| `<FormDatePicker>`      | Date/time picker               |
| `<FormCheckbox>`        | Checkbox                       |
| `<FormSwitch>`          | Toggle switch                  |
| `<FormRadioGroup>`      | Radio selection                |
| `<FormNumberInput>`     | Numeric input                  |
| `<FormCurrencyInput>`   | Currency-formatted input       |
| `<FormImageUploader>`   | Image pick & upload            |
| `<FormSubmitButton>`    | Auto-disabled submit button    |
| `<FormError>`           | Field error display            |
| `<FormLabel>`           | Field label                    |
| `<FormSection>`         | Grouped form section           |
| `<FormInfoCard>`        | Informational card inside form |
| `<FormNavigationField>` | Field that navigates on press  |
| `<FormDurationPicker>`  | Duration (HH:MM) picker        |

---

## 12. Forms Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormTextField, FormSubmitButton } from '@shared/components';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm(): React.JSX.Element {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    // call mutation here
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormTextField name='email' label='Email' keyboardType='email-address' />
      <FormTextField name='password' label='Password' secureTextEntry />
      <FormSubmitButton label='Login' />
    </Form>
  );
}
```

---

## 13. Error Boundary

Wrap any screen or subtree that can fail:

```tsx
import { ErrorBoundary } from '@core/error';

<ErrorBoundary onError={(err, info) => logger.error('Screen crashed', err)}>
  <MyRiskyScreen />
</ErrorBoundary>;
```

Custom fallback:

```tsx
<ErrorBoundary
  fallback={
    <View>
      <Text>Custom error UI</Text>
    </View>
  }
>
  <MyScreen />
</ErrorBoundary>
```

---

## 14. Environment & Config

Read environment variables via `appConfig` — never access `RNConfig` directly:

```typescript
import { appConfig, isDevelopment, isProduction } from '@core/config';

const baseUrl = appConfig.API_BASE_URL;
const timeout = appConfig.API_TIMEOUT;

if (isDevelopment) {
  // dev-only behaviour
}
```

Adding a new env variable:

1. Add it to `.env`, `.env.staging`, `.env.production`
2. Add it to `AppConfig` interface in `src/core/config/env.ts`
3. Parse it using `requireString` / `optionalNumber` / `optionalBoolean`

---

## 15. Auth Flow Reference

```
App start
  → useAuthInitializer reads MMKV tokens
  → dispatches initializeAuth({ accessToken, refreshToken })
  → RootNavigator renders:
      isInitializing  → SplashScreen
      !isAuthenticated → AuthNavigator (Login → ForgotPassword → OTP → Reset → Success)
      isAuthenticated  → AppNavigator (MainTabs → feature screens)

API call returns 401
  → baseQueryWithReauth intercepts
  → Single-flight refresh via POST /auth/refresh
  → On success: dispatches setTokens, saves to MMKV, retries original request
  → On failure: dispatches clearAuth, clears MMKV, navigates to Auth stack
```

Auth endpoints exempt from refresh: `/auth/login`, `/auth/refresh`, `/auth/logout`

---

## 16. Adding a New Optional Module

Do not install optional packages manually. Use the automation scripts:

```bash
pnpm add:stripe      # Stripe payments
pnpm add:sentry      # Crash reporting
pnpm add:maps        # Google Maps
pnpm add:camera      # Vision Camera
pnpm add:socketio    # Socket.IO realtime
pnpm add:websocket   # WebSocket
pnpm add:sse         # Server-Sent Events
```

---

## 17. Code Generation CLI Reference

```bash
pnpm generate feature <name>                  # Full feature scaffold
pnpm generate screen <feature>/<ScreenName>   # Screen inside a feature
pnpm generate component <folder>/<Name>       # Component (shared or feature)
pnpm generate hook <folder>/<hookName>        # Hook file
pnpm generate api <feature>/<name>            # RTK Query endpoint file
pnpm generate slice <name>                    # Redux slice
pnpm generate form <feature>/<name>           # Form component
```

---

## 18. Common Mistakes to Avoid

| Mistake                                           | Correct Approach                          |
| ------------------------------------------------- | ----------------------------------------- |
| Calling `createApi()` in a feature                | Use `baseApi.injectEndpoints()`           |
| Importing `RNConfig` directly                     | Use `appConfig` from `@core/config`       |
| Using `AsyncStorage`                              | Use `StorageService` from `@core/storage` |
| Hardcoding MMKV key strings                       | Add to `STORAGE_KEYS` in `storageKeys.ts` |
| Using raw `useDispatch` / `useSelector`           | Use `useAppDispatch` / `useAppSelector`   |
| Cross-importing between features                  | Only use the feature's `index.ts` barrel  |
| Returning raw `ApiResponse<T>` from query         | Use `transformResponse` to unwrap `.data` |
| Anonymous default export components               | Named exports only                        |
| `StyleSheet.create` for layout                    | Use NativeWind `className`                |
| Putting shared logic inside a feature             | Move to `src/shared/`                     |
| Skipping type imports (`import` vs `import type`) | Always `import type` for type-only usage  |
| Magic strings for storage keys                    | Always use `STORAGE_KEYS` constants       |

---

## 19. File Checklist When Adding a Feature

- [ ] Feature folder created with all subfolders (`api/`, `components/`, `hooks/`, `navigation/`, `screens/`, `types/`, `index.ts`)
- [ ] Route param types added to `navigation.types.ts`
- [ ] Screen registered in the feature's navigator
- [ ] Navigator registered in `AppNavigator` or `MainTabsNavigator`
- [ ] Deep link paths added to `linking.ts` (if needed)
- [ ] API file uses `baseApi.injectEndpoints()` with `overrideExisting: false`
- [ ] All endpoints use `ApiResponse<T>` / `PaginatedApiResponse<T>` with `transformResponse`
- [ ] Cache tags registered in `baseApi.ts` `tagTypes` array
- [ ] Public API exported via `src/features/<name>/index.ts`
- [ ] No cross-feature imports
- [ ] TypeScript strict — no `any`
- [ ] All storage keys in `STORAGE_KEYS`

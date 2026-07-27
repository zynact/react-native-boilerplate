# State Management & API Layer

Global state management and networking are unified using **Redux Toolkit (RTK)** and **RTK Query**.

## Redux Store

The store configuration in [store.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/store/store.ts) registers standard reducers, middleware, and query caches. Always use the typed hook versions inside components:

```typescript
import { useAppDispatch, useAppSelector } from '@core/store';

const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

---

## API Base Instance

Network operations use a single RTK Query base API [baseApi.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/api/baseApi.ts).
Features must **never** call `createApi` to define a separate interface. Instead, inject custom endpoints into the single base:

```typescript
// src/features/dashboard/api/dashboard.api.ts
import { baseApi } from '@core/api';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<StatsResponse, void>({
      query: () => '/dashboard/stats',
      providesTags: ['List'],
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
```

---

## Authentication & Auto-Reauth Flow

Authorization header injection and session expiration recovery are handled centrally in [baseQueryWithReauth.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/api/baseQueryWithReauth.ts):

### Reauth Workflow

1. **Header Injection**: Requests include the current bearer token from Redux state (unless matched by auth exceptions).
2. **Auto Refresh on 401**: If a request fails with an HTTP `401 Unauthorized` status:
   - The query pauses execution.
   - A single-flight token refresh command (`POST /auth/refresh`) is triggered using the current refresh token.
   - While refresh is in progress, other incoming API calls are queued.
   - If the refresh succeeds: the new access token is persisted, and the paused/queued calls are re-run.
   - If the refresh fails: the auth state is wiped, tokens are deleted from MMKV, and the user is redirected to the Login flow.
3. **Circular Prevention**: Authorization routes (`/auth/login`, `/auth/refresh`, etc.) bypass the retry flow to prevent infinite recursive request cycles.

# Core Services & Utilities

Core infrastructure services reside inside `src/core/services/` and `src/core/storage/`. These handle peripheral system hooks, native device capabilities, and data storage.

## Key Services

### Storage (MMKV)

Persistent storage is backed by **MMKV** instead of AsyncStorage due to its high performance (written in C++). A typed wrapper is exposed as [StorageService](file:///d:/Work/zynact/templates/react-native-template/src/core/storage/storage.service.ts):

```typescript
import { StorageService } from '@core/storage';
import { STORAGE_KEYS } from '@shared/constants';

// Writing values
StorageService.setString(STORAGE_KEYS.ACCESS_TOKEN, token);

// Reading values
const token = StorageService.getString(STORAGE_KEYS.ACCESS_TOKEN);
```

---

### Toast Notifications

Trigger animated toast popups anywhere via the global [ToastService](file:///d:/Work/zynact/templates/react-native-template/src/core/services/toast/toast.service.ts):

```typescript
import { ToastService } from '@core/services';

ToastService.show({
  type: 'success',
  message: 'Data saved successfully',
  duration: 3000,
});
```

---

### Logger

A structured logging service is configured in [logger.service.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/services/logger/logger.service.ts). It enforces severity tags (info, warn, error) and can be extended to feed crash reporting logs (e.g. Sentry):

```typescript
import { logger } from '@core/services';

logger.info('[Auth] User logging in', { email });
logger.error('[API] Failed fetching list', error);
```

---

### Device Permissions

Request and check device permissions safely using [PermissionsService](file:///d:/Work/zynact/templates/react-native-template/src/core/services/permissions/permissions.service.ts). This handles boilerplate requirements for Android runtimes:

```typescript
import { PermissionsService } from '@core/services';

const hasPostNotifications = await PermissionsService.requestAndroidPermission(
  'android.permission.POST_NOTIFICATIONS',
);
```

---

### Clipboard & Linking

- **ClipboardService**: Core helper to copy text data or read content from the device clipboard.
- **LinkingService**: Resolves deep linking endpoints, opens URLs in native system browsers, or redirects to system settings.

# Navigation Architecture

This project implements a modular, type-safe navigation structure built on top of **React Navigation** (v7) and features a distinct layering of navigation concerns.

## Navigation Hierarchy

Navigation flows are handled by the [RootNavigator](file:///d:/Work/zynact/templates/react-native-template/src/core/navigation/RootNavigator.tsx):

```
RootNavigator (Stack)
├── SplashNavigator       – Loading states shown during authentication check
├── AuthNavigator         – Login, Registration, Password reset
├── AppNavigator          – Nested bottom tab navigation for core user actions
│   └── MainTabsNavigator
│       ├── Home (Tab)
│       └── Profile (Tab)
├── ModalNavigator        – Fullscreen modals (e.g. settings overlay)
├── BottomSheetProvider   – Slide-up sheet overlays (not in navigation stack)
└── DialogProvider        – System dialog popups
```

---

## Type Safety

The navigation system enforces compile-time safety. Route parameters and screen props are strongly typed inside [navigation.types.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/navigation/navigation.types.ts):

```typescript
// Define params for App Stack routes
export type AppStackParamList = {
  MainTabs: undefined;
  // Feature stacks are nested here
};

// Screen props typings helper
export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>;
```

---

## Overlays (Bottom Sheets & Dialogs)

To keep the stack clean and maintain declarative rendering, bottom sheets and dialog overlays do not live in the navigation stack. Instead, they are managed globally via context providers:

### Bottom Sheets

Wrap overlays in a `<BottomSheetProvider>` and trigger them using the custom hook:

```tsx
import { useBottomSheet } from '@core/navigation';

export function MyScreen() {
  const { present, dismiss } = useBottomSheet();

  const handleOpen = () => {
    present({
      content: <MySheetContent />,
      snapPoints: ['40%', '80%'],
    });
  };

  return <Button label='Open Sheet' onPress={handleOpen} />;
}
```

### Dialogs

Global imperative dialogs are available in a similar fashion via `useDialog`:

```tsx
import { useDialog } from '@core/navigation';

export function ConfirmButton() {
  const { show, hide } = useDialog();

  const handlePress = () => {
    show({
      title: 'Are you sure?',
      message: 'This action is irreversible.',
      buttons: [
        { text: 'Cancel', style: 'cancel', onPress: hide },
        { text: 'Delete', style: 'destructive', onPress: performDelete },
      ],
    });
  };

  return <Button label='Delete Account' onPress={handlePress} />;
}
```

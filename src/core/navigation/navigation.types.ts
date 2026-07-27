import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ─────────────────────────────────────────────────────────────────────────────
// Root Navigator
// ─────────────────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
  Modal: NavigatorScreenParams<ModalStackParamList>;
  BottomSheet: NavigatorScreenParams<BottomSheetStackParamList>;
  Dialog: NavigatorScreenParams<DialogStackParamList>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Auth Navigator
// ─────────────────────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// ─────────────────────────────────────────────────────────────────────────────
// App (Main) Navigator
// ─────────────────────────────────────────────────────────────────────────────

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Tabs Navigator
// ─────────────────────────────────────────────────────────────────────────────

export type MainTabsParamList = {
  Home: undefined;
  Profile: undefined;
};

// ─────────────────────────────────────────────────────────────────────────────
// Modal Navigator
// ─────────────────────────────────────────────────────────────────────────────

export type ModalStackParamList = {
  // Add fullscreen modals here
  // Example: ImageViewer: { uri: string };
};

// ─────────────────────────────────────────────────────────────────────────────
// BottomSheet Navigator
// ─────────────────────────────────────────────────────────────────────────────

export type BottomSheetStackParamList = {
  // Add bottom sheet screens here
  // Example: FilterSheet: { onApply: (filters: Filters) => void };
};

// ─────────────────────────────────────────────────────────────────────────────
// Dialog Navigator
// ─────────────────────────────────────────────────────────────────────────────

export type DialogStackParamList = {
  // Add dialogs here
  // Example: ConfirmDialog: { title: string; message: string; onConfirm: () => void };
};

// ─────────────────────────────────────────────────────────────────────────────
// Typed screen props helpers
// ─────────────────────────────────────────────────────────────────────────────

// Root
export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Auth
export type AuthScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// App
export type AppScreenProps<T extends keyof AppStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AppStackParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// Tab
export type MainTabsScreenProps<T extends keyof MainTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, T>,
  CompositeScreenProps<
    NativeStackScreenProps<AppStackParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

// Modal
export type ModalScreenProps<T extends keyof ModalStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ModalStackParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

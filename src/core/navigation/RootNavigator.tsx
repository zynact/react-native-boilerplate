import React, { useEffect, useRef } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthInitializer } from '@core/auth/useAuthInitializer';
import { useAppSelector } from '@core/store';
import { AuthNavigator } from '@features/auth';

import { AppNavigator } from './AppNavigator';
import { ModalNavigator } from './ModalNavigator';
import { SplashScreen } from './SplashScreen';

import type { RootStackParamList } from './navigation.types';
import type { NavigationContainerRef } from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator
 *
 * Hierarchy:
 *   Root
 *   ├── Splash          – shown while isInitializing === true
 *   ├── Auth            – unauthenticated flows
 *   ├── App             – authenticated flows (tabs + feature stacks)
 *   ├── Modal           – fullscreen modals (presented over everything)
 *   ├── BottomSheet     – managed via BottomSheetProvider (not a navigator)
 *   └── Dialog          – managed via DialogProvider (not a navigator)
 *
 * Auth state determines which group is active after initialization completes.
 */
export function RootNavigator(): React.JSX.Element {
  const { isInitializing } = useAuthInitializer();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Keep a ref to the navigator so we can imperatively navigate once
  // initialization finishes without causing a re-render loop.
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    const targetRoute = isAuthenticated ? 'App' : 'Auth';

    // Use a small timeout to ensure the navigator has mounted
    const timer = setTimeout(() => {
      if (navigationRef.current?.isReady()) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: targetRoute }],
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isInitializing, isAuthenticated]);

  return (
    <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Splash' component={SplashScreen} />
      <Stack.Screen name='Auth' component={AuthNavigator} />
      <Stack.Screen name='App' component={AppNavigator} />
      <Stack.Screen name='Modal' component={ModalNavigator} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

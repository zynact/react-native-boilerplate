import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthInitializer } from '@core/auth/useAuthInitializer';
import { useAppSelector } from '@core/store';
import { AuthNavigator } from '@features/auth';

import { AppNavigator } from './AppNavigator';
import { ModalNavigator } from './ModalNavigator';
import { SplashScreen } from './SplashScreen';

import type { RootStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator
 *
 * Uses declarative routing based on the app initializing and authentication state:
 *   - isInitializing === true: renders Splash screen
 *   - isAuthenticated === false: renders Auth stack (Login, Register, etc.)
 *   - isAuthenticated === true: renders App stack (Tabs, Features) and Modals
 */
export function RootNavigator(): React.JSX.Element {
  const { isInitializing } = useAuthInitializer();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isInitializing ? (
        <Stack.Screen name='Splash' component={SplashScreen} />
      ) : !isAuthenticated ? (
        <Stack.Screen name='Auth' component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name='App' component={AppNavigator} />
          <Stack.Screen
            name='Modal'
            component={ModalNavigator}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

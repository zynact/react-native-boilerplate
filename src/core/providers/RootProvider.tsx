import React, { type ReactNode } from 'react';

import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomSheetProvider, DialogProvider, linking } from '@core/navigation';
import { ToastProvider } from '@core/services';

import { StoreProvider } from './StoreProvider';

interface RootProviderProps {
  children: ReactNode;
}

/**
 * RootProvider wraps the entire app with all required context providers.
 *
 * Order matters:
 *   1. StoreProvider           – Redux store (must be outermost for RTK Query)
 *   2. GestureHandlerRootView  – required for gesture-handler + bottom-sheet
 *   3. SafeAreaProvider        – provides safe area insets
 *   4. NavigationContainer     – navigation context + deep linking
 *   5. BottomSheetProvider     – app-level bottom sheet service
 *   6. DialogProvider          – app-level dialog service
 *   7. ToastProvider           – imperative toast notifications (innermost)
 */
export function RootProvider({ children }: RootProviderProps): React.JSX.Element {
  return (
    <StoreProvider>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <NavigationContainer linking={linking}>
            <BottomSheetProvider>
              <DialogProvider>
                <ToastProvider>{children}</ToastProvider>
              </DialogProvider>
            </BottomSheetProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

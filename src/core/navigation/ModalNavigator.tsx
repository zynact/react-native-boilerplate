import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { ModalStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<ModalStackParamList & { _Placeholder: undefined }>();

/**
 * ModalNavigator — fullscreen modals presented over the entire UI.
 *
 * To add a modal:
 *   1. Add its params to ModalStackParamList in navigation.types.ts
 *   2. Create the modal screen component
 *   3. Register it as a Stack.Screen below
 *   4. Remove _Placeholder once a real screen exists
 */
export function ModalNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    >
      {/* Placeholder — remove once you add real modal screens */}
      <Stack.Screen
        name='_Placeholder'
        component={PlaceholderModal}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function PlaceholderModal(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Modal placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

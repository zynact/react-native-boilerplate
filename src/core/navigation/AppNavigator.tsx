import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabsNavigator } from './MainTabsNavigator';

import type { AppStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MainTabs' component={MainTabsNavigator} />
    </Stack.Navigator>
  );
}

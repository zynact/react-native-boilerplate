import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardHomeScreen } from '../screens/DashboardHomeScreen';

import type { DashboardStackParamList } from '../types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='DashboardHome' component={DashboardHomeScreen} />
    </Stack.Navigator>
  );
}

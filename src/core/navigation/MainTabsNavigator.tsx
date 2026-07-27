import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '@features/home';
import { ProfileScreen } from '@features/profile';

import type { MainTabsParamList } from './navigation.types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabsNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  );
}

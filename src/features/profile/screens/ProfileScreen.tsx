import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import type { MainTabsScreenProps } from '@core/navigation';

type Props = MainTabsScreenProps<'Profile'>;

export function ProfileScreen(_props: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});

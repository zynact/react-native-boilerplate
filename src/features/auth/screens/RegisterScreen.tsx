import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import type { AuthScreenProps } from '@core/navigation';

type Props = AuthScreenProps<'Register'>;

export function RegisterScreen(_props: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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

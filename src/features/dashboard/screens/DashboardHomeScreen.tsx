import React from 'react';

import { StyleSheet, View } from 'react-native';

import { AppText, Button } from '@shared/components';

import type { DashboardScreenProps } from '../types';

type Props = DashboardScreenProps<'DashboardHome'>;

export function DashboardHomeScreen({ navigation }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <AppText variant='h3' weight='semibold' className='mb-4'>
        Dashboard Home Screen
      </AppText>
      <Button label='Go Back' onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

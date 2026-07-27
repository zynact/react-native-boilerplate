import React from 'react';

import { View } from 'react-native';

import { AppText } from '@shared/components';

import type { MainTabsScreenProps } from '@core/navigation';

type Props = MainTabsScreenProps<'Home'>;

export function HomeScreen(_props: Props): React.JSX.Element {
  return (
    <View className='flex-1 items-center justify-center p-4'>
      <AppText variant='h3' weight='semibold'>
        Home
      </AppText>
    </View>
  );
}

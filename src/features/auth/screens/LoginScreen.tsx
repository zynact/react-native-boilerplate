import React from 'react';

import { View } from 'react-native';

import { AppText } from '@shared/components';

import type { AuthScreenProps } from '@core/navigation';

type Props = AuthScreenProps<'Login'>;

export function LoginScreen(_props: Props): React.JSX.Element {
  return (
    <View className='flex-1 items-center justify-center p-4'>
      <AppText variant='h3' weight='semibold'>
        Login
      </AppText>
    </View>
  );
}

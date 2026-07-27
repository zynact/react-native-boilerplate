import React from 'react';

import { View } from 'react-native';

import { Button } from '../Button/Button';
import { AppText } from '../Text/Text';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;
  testID?: string;
}

export const ErrorState = ({
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Try again',
  icon,
  testID,
}: ErrorStateProps): React.JSX.Element => {
  return (
    <View
      className='flex-1 items-center justify-center px-8 py-12'
      testID={testID}
      accessibilityRole='none'
    >
      {icon != null && <View className='mb-4'>{icon}</View>}
      <AppText variant='h4' weight='semibold' align='center' color='error' className='mb-2'>
        {title}
      </AppText>
      {description != null && description.length > 0 && (
        <AppText variant='body' color='muted' align='center' className='mb-6'>
          {description}
        </AppText>
      )}
      {onRetry != null && (
        <Button label={retryLabel} onPress={onRetry} variant='outline' size='md' />
      )}
    </View>
  );
};

ErrorState.displayName = 'ErrorState';

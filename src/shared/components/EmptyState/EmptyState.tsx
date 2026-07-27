import React from 'react';

import { View } from 'react-native';

import { Button } from '../Button/Button';
import { AppText } from '../Text/Text';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
  icon?: React.ReactNode;
  testID?: string;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon,
  testID,
}: EmptyStateProps): React.JSX.Element => {
  return (
    <View
      className='flex-1 items-center justify-center px-8 py-12'
      testID={testID}
      accessibilityRole='none'
    >
      {icon != null && <View className='mb-4'>{icon}</View>}
      <AppText variant='h4' weight='semibold' align='center' className='mb-2'>
        {title}
      </AppText>
      {description != null && description.length > 0 && (
        <AppText variant='body' color='muted' align='center' className='mb-6'>
          {description}
        </AppText>
      )}
      {action != null && (
        <Button label={action.label} onPress={action.onPress} variant='primary' size='md' />
      )}
    </View>
  );
};

EmptyState.displayName = 'EmptyState';

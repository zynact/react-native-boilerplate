import React from 'react';

import { ActivityIndicator, View } from 'react-native';

import { AppText } from '../Text/Text';

export interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  message?: string;
}

export const Loader = ({
  size = 'large',
  color = '#3b82f6',
  fullScreen = false,
  message,
}: LoaderProps): React.JSX.Element => {
  const content = (
    <View className='items-center justify-center gap-3'>
      <ActivityIndicator size={size} color={color} accessibilityLabel='Loading' />
      {message != null && message.length > 0 && (
        <AppText variant='bodySmall' color='muted'>
          {message}
        </AppText>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        className='absolute inset-0 z-50 items-center justify-center bg-black/30'
        accessibilityViewIsModal
        accessibilityLiveRegion='polite'
      >
        <View className='rounded-xl bg-white px-8 py-6'>{content}</View>
      </View>
    );
  }

  return content;
};

Loader.displayName = 'Loader';

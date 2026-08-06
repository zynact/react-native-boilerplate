import React, { useEffect, useRef, useState } from 'react';

import { Animated, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNetworkStatus } from '@shared/hooks';

import { AppText } from '../Text/Text';

export interface NetworkBannerProps {
  offlineText?: string;
  onlineText?: string;
}

export function NetworkBanner({
  offlineText = 'No Internet Connection — Offline Mode',
  onlineText = 'Back Online',
}: NetworkBannerProps): React.JSX.Element | null {
  const { isConnected } = useNetworkStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bannerType, setBannerType] = useState<'offline' | 'online'>('offline');
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!isConnected) {
      setWasOffline(true);
      setBannerType('offline');
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (wasOffline) {
      setBannerType('online');
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -60,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
          setWasOffline(false);
        });
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isConnected, wasOffline, slideAnim]);

  if (!visible) {
    return null;
  }

  const isOffline = bannerType === 'offline';

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        paddingTop: Math.max(insets.top, 8),
      }}
      className={`w-full px-4 py-2 flex-row items-center justify-center ${
        isOffline ? 'bg-amber-600 dark:bg-amber-700' : 'bg-emerald-600 dark:bg-emerald-700'
      }`}
      accessibilityRole='alert'
      accessibilityLiveRegion='polite'
    >
      <View className='w-2 h-2 rounded-full mr-2 bg-white' />
      <AppText variant='caption' className='text-white font-medium text-center text-xs'>
        {isOffline ? offlineText : onlineText}
      </AppText>
    </Animated.View>
  );
}

NetworkBanner.displayName = 'NetworkBanner';

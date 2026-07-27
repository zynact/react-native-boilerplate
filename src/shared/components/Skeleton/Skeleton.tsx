import React, { useEffect, useRef } from 'react';

import { Animated, StyleSheet, type ViewStyle } from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export const Skeleton = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  className,
}: SkeletonProps): React.JSX.Element => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  // StyleSheet is needed here because dynamic width/height/borderRadius
  // cannot be expressed as NativeWind className values at runtime.
  const dynamicStyle: ViewStyle = {
    width: width as ViewStyle['width'],
    height: height as ViewStyle['height'],
    borderRadius,
  };

  return (
    <Animated.View
      style={[styles.base, dynamicStyle, { opacity }]}
      className={className}
      accessibilityLabel='Loading placeholder'
      accessibilityRole='progressbar'
    />
  );
};

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#e2e8f0',
  },
});

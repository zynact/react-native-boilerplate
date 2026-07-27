import React from 'react';

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export interface AvatarProps {
  uri?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  onPress?: () => void;
}

const sizeMap: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
};

const fontSizeMap: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 10,
  sm: 13,
  md: 16,
  lg: 22,
  xl: 28,
};

const AVATAR_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
];

function hashInitials(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = (hash * 31 + initials.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0];
}

export const Avatar = ({
  uri,
  initials,
  size = 'md',
  shape = 'circle',
  onPress,
}: AvatarProps): React.JSX.Element => {
  const dimension = sizeMap[size];
  const borderRadius = shape === 'circle' ? dimension / 2 : dimension * 0.2;
  const backgroundColor = initials != null ? hashInitials(initials) : '#94a3b8';

  const containerStyle: {
    width: number;
    height: number;
    borderRadius: number;
    backgroundColor: string;
    overflow: 'hidden';
  } = {
    width: dimension,
    height: dimension,
    borderRadius,
    backgroundColor,
    overflow: 'hidden',
  };

  const inner =
    uri != null ? (
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        accessibilityRole='image'
        accessibilityLabel={initials ?? 'Avatar'}
      />
    ) : (
      <Text style={[styles.initialsText, { fontSize: fontSizeMap[size] }]} accessibilityRole='text'>
        {initials?.slice(0, 2).toUpperCase() ?? '?'}
      </Text>
    );

  if (onPress != null) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.center, containerStyle]}
        accessibilityRole='button'
        accessibilityLabel={initials ?? 'Avatar'}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View style={[styles.center, containerStyle]} accessibilityRole='image'>
      {inner}
    </View>
  );
};

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

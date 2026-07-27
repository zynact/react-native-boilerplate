import React from 'react';

import { Image, Pressable, View } from 'react-native';

import { AppText } from '../Text/Text';

export interface AvatarProps {
  uri?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  onPress?: () => void;
}

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-18 h-18',
};

const fontSizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
};

const shapeClasses = (
  shape: NonNullable<AvatarProps['shape']>,
  size: NonNullable<AvatarProps['size']>,
): string => {
  if (shape === 'circle') return 'rounded-full';

  switch (size) {
    case 'xs':
      return 'rounded-sm';
    case 'sm':
      return 'rounded';
    case 'md':
      return 'rounded-md';
    case 'lg':
      return 'rounded-lg';
    case 'xl':
      return 'rounded-xl';
  }
};

const AVATAR_BG_CLASSES = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-red-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-indigo-500',
];

function hashInitials(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = (hash * 31 + initials.charCodeAt(i)) % AVATAR_BG_CLASSES.length;
  }
  return AVATAR_BG_CLASSES[hash] ?? AVATAR_BG_CLASSES[0];
}

export const Avatar = ({
  uri,
  initials,
  size = 'md',
  shape = 'circle',
  onPress,
}: AvatarProps): React.JSX.Element => {
  const sizeClass = sizeClasses[size];
  const roundedClass = shapeClasses(shape, size);
  const bgClass = initials != null ? hashInitials(initials) : 'bg-slate-400';

  const containerClass = `items-center justify-center overflow-hidden ${sizeClass} ${roundedClass} ${bgClass}`;

  const inner =
    uri != null ? (
      <Image
        source={{ uri }}
        className='absolute inset-0'
        accessibilityRole='image'
        accessibilityLabel={initials ?? 'Avatar'}
      />
    ) : (
      <AppText weight='semibold' className={`text-white ${fontSizeClasses[size]}`}>
        {initials?.slice(0, 2).toUpperCase() ?? '?'}
      </AppText>
    );

  if (onPress != null) {
    return (
      <Pressable
        onPress={onPress}
        className={containerClass}
        accessibilityRole='button'
        accessibilityLabel={initials ?? 'Avatar'}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View className={containerClass} accessibilityRole='image'>
      {inner}
    </View>
  );
};

Avatar.displayName = 'Avatar';

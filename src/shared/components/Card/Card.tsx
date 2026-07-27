import React from 'react';

import { Pressable, View } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  testID?: string;
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  elevated: 'bg-white rounded-xl shadow-md',
  outlined: 'bg-white rounded-xl border border-secondary-200',
  filled: 'bg-secondary-100 rounded-xl',
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = ({
  children,
  onPress,
  variant = 'elevated',
  padding = 'md',
  className,
  testID,
}: CardProps): React.JSX.Element => {
  const containerClass = [variantClasses[variant], paddingClasses[padding], className]
    .filter(Boolean)
    .join(' ');

  if (onPress != null) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole='button'
        testID={testID}
        className={containerClass}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View testID={testID} className={containerClass}>
      {children}
    </View>
  );
};

Card.displayName = 'Card';

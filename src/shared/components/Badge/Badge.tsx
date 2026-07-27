import React from 'react';

import { View } from 'react-native';

import { AppText } from '../Text/Text';

export interface BadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantContainerClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-secondary-200',
  primary: 'bg-primary-100',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  error: 'bg-red-100',
  info: 'bg-blue-100',
};

const variantTextClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'text-secondary-700',
  primary: 'text-primary-700',
  success: 'text-green-700',
  warning: 'text-amber-700',
  error: 'text-red-700',
  info: 'text-blue-700',
};

const variantDotClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-secondary-500',
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const sizeContainerClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-1.5 py-0.5 rounded',
  md: 'px-2.5 py-1 rounded-full',
};

const sizeDotClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'w-1.5 h-1.5 rounded-full',
  md: 'w-2.5 h-2.5 rounded-full',
};

export const Badge = ({
  label,
  variant = 'default',
  size = 'md',
  dot = false,
}: BadgeProps): React.JSX.Element => {
  if (dot) {
    return (
      <View
        className={[variantDotClasses[variant], sizeDotClasses[size]].join(' ')}
        accessibilityRole='none'
        accessibilityLabel={label}
      />
    );
  }

  return (
    <View
      className={[
        'flex-row items-center self-start',
        variantContainerClasses[variant],
        sizeContainerClasses[size],
      ].join(' ')}
      accessibilityRole='none'
      accessibilityLabel={label}
    >
      <AppText
        variant={size === 'sm' ? 'caption' : 'label'}
        className={[
          'font-medium',
          variantTextClasses[variant],
          size === 'sm' ? 'text-xs' : 'text-xs',
        ].join(' ')}
      >
        {label}
      </AppText>
    </View>
  );
};

Badge.displayName = 'Badge';

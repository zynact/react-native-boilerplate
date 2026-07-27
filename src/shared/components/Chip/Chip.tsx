import React from 'react';

import { Pressable, View } from 'react-native';

import { AppText } from '../Text/Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'outline';
  size?: 'sm' | 'md';
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

const unselectedContainerClasses: Record<NonNullable<ChipProps['variant']>, string> = {
  default: 'bg-secondary-100 border border-secondary-300',
  primary: 'bg-primary-50 border border-primary-200',
  outline: 'bg-transparent border border-secondary-400',
};

const selectedContainerClasses: Record<NonNullable<ChipProps['variant']>, string> = {
  default: 'bg-secondary-700 border border-secondary-700',
  primary: 'bg-primary-500 border border-primary-500',
  outline: 'bg-primary-500 border border-primary-500',
};

const unselectedLabelClasses: Record<NonNullable<ChipProps['variant']>, string> = {
  default: 'text-secondary-700',
  primary: 'text-primary-600',
  outline: 'text-secondary-700',
};

const selectedLabelClasses: Record<NonNullable<ChipProps['variant']>, string> = {
  default: 'text-white',
  primary: 'text-white',
  outline: 'text-white',
};

const sizeContainerClasses: Record<NonNullable<ChipProps['size']>, string> = {
  sm: 'px-2 py-1 rounded-full',
  md: 'px-3 py-1.5 rounded-full',
};

export const Chip = ({
  label,
  selected = false,
  onPress,
  onRemove,
  variant = 'default',
  size = 'md',
  leftIcon,
  disabled = false,
}: ChipProps): React.JSX.Element => {
  const containerClass = [
    'flex-row items-center self-start',
    selected ? selectedContainerClasses[variant] : unselectedContainerClasses[variant],
    sizeContainerClasses[size],
    disabled ? 'opacity-40' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const labelClass = selected ? selectedLabelClasses[variant] : unselectedLabelClasses[variant];

  const content = (
    <>
      {leftIcon != null && <View className='mr-1'>{leftIcon}</View>}
      <AppText
        variant={size === 'sm' ? 'caption' : 'label'}
        className={['font-medium', labelClass].join(' ')}
      >
        {label}
      </AppText>
      {onRemove != null && (
        <Pressable
          onPress={onRemove}
          disabled={disabled}
          accessibilityRole='button'
          accessibilityLabel={`Remove ${label}`}
          className='ml-1.5'
          hitSlop={8}
        >
          <AppText
            variant={size === 'sm' ? 'caption' : 'label'}
            className={['font-bold', labelClass].join(' ')}
          >
            ✕
          </AppText>
        </Pressable>
      )}
    </>
  );

  if (onPress != null) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel={label}
        accessibilityState={{ disabled, selected }}
        className={containerClass}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={containerClass} accessibilityRole='none'>
      {content}
    </View>
  );
};

Chip.displayName = 'Chip';

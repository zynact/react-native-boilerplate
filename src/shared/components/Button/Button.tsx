import React from 'react';

import { ActivityIndicator, Pressable, View } from 'react-native';

import { AppText } from '../Text/Text';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  testID?: string;
}

const containerVariantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary-500 border border-primary-500',
  secondary: 'bg-secondary-200 border border-secondary-200',
  outline: 'bg-transparent border border-primary-500',
  ghost: 'bg-transparent border border-transparent',
  destructive: 'bg-error border border-error',
};

const disabledContainerClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary-200 border-primary-200',
  secondary: 'bg-secondary-100 border-secondary-100',
  outline: 'bg-transparent border-primary-200',
  ghost: 'bg-transparent border-transparent',
  destructive: 'bg-red-200 border-red-200',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 rounded-md',
  md: 'px-4 py-2.5 rounded-lg',
  lg: 'px-6 py-3.5 rounded-xl',
};

const labelVariantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-white',
  secondary: 'text-secondary-800',
  outline: 'text-primary-500',
  ghost: 'text-primary-500',
  destructive: 'text-white',
};

const labelSizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const indicatorColorMap: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: '#ffffff',
  secondary: '#334155',
  outline: '#3b82f6',
  ghost: '#3b82f6',
  destructive: '#ffffff',
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  testID,
}: ButtonProps): React.JSX.Element => {
  const isDisabled = disabled || loading;

  const containerClass = [
    'flex-row items-center justify-center',
    isDisabled ? disabledContainerClasses[variant] : containerVariantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : 'self-start',
  ].join(' ');

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole='button'
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      className={containerClass}
    >
      {loading ? (
        <ActivityIndicator
          size='small'
          color={indicatorColorMap[variant]}
          accessibilityLabel='Loading'
        />
      ) : (
        <>
          {leftIcon != null && <View className='mr-2'>{leftIcon}</View>}
          <AppText
            className={[labelVariantClasses[variant], labelSizeClasses[size]].join(' ')}
            weight='semibold'
          >
            {label}
          </AppText>
          {rightIcon != null && <View className='ml-2'>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
};

Button.displayName = 'Button';

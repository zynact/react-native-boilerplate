import React, { useState } from 'react';

import { type TextInputProps, TextInput, View } from 'react-native';

import { AppText } from '../Text/Text';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  hint,
  disabled = false,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  leftIcon,
  rightIcon,
  testID,
  maxLength,
  multiline = false,
  numberOfLines,
}: InputProps): React.JSX.Element => {
  const [focused, setFocused] = useState(false);

  const hasError = error != null && error.length > 0;

  const borderClass = hasError
    ? 'border-error'
    : focused
    ? 'border-primary-500'
    : 'border-secondary-300';

  const inputContainerClass = [
    'flex-row items-center rounded-lg border bg-white px-4',
    borderClass,
    disabled ? 'bg-secondary-100 opacity-60' : '',
    multiline ? 'min-h-[80px] items-start py-2' : 'h-14',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <View className='w-full'>
      {label != null && label.length > 0 && (
        <AppText variant='label' weight='medium' className='mb-1 text-secondary-700'>
          {label}
        </AppText>
      )}
      <View className={inputContainerClass}>
        {leftIcon != null && <View className='mr-2'>{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor='#94a3b8'
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          testID={testID}
          className='flex-1 text-base text-secondary-900'
        />
        {rightIcon != null && <View className='ml-2'>{rightIcon}</View>}
      </View>
      {hasError && (
        <AppText variant='caption' color='error' className='mt-1'>
          {error}
        </AppText>
      )}
      {!hasError && hint != null && hint.length > 0 && (
        <AppText variant='caption' color='muted' className='mt-1'>
          {hint}
        </AppText>
      )}
    </View>
  );
};

Input.displayName = 'Input';

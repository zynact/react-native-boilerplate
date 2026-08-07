import React from 'react';

import { type TextInputProps } from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '../Input/Input';

interface FormTextFieldProps extends TextInputProps {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function FormTextField({
  name,
  editable,
  disabled,
  ...props
}: FormTextFieldProps): React.JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          onBlur={onBlur}
          onChangeText={onChange}
          value={String(value ?? '')}
          disabled={disabled ?? editable === false}
          {...props}
        />
      )}
    />
  );
}

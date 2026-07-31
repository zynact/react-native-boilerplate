import React, { type ComponentProps } from 'react';

import { TextInput } from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

interface FormNumberInputProps extends ComponentProps<typeof TextInput> {
  name: string;
}

export function FormNumberInput({ name, ...props }: FormNumberInputProps): React.JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          onBlur={onBlur}
          onChangeText={(text: string) => onChange(text ? parseFloat(text) : '')}
          value={value !== undefined && value !== null ? String(value) : ''}
          keyboardType='numeric'
          className='border border-gray-300 rounded-md p-2'
          {...props}
        />
      )}
    />
  );
}

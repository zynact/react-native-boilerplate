import React, { type ComponentProps } from 'react';

import { TextInput } from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

interface FormTextFieldProps extends ComponentProps<typeof TextInput> {
  name: string;
}

export function FormTextField({ name, ...props }: FormTextFieldProps): React.JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          className='border border-gray-300 rounded-md p-2'
          {...props}
        />
      )}
    />
  );
}

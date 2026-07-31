import React, { type ComponentProps } from 'react';

import { TextInput } from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

interface FormTextAreaProps extends ComponentProps<typeof TextInput> {
  name: string;
}

export function FormTextArea({ name, ...props }: FormTextAreaProps): React.JSX.Element {
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
          multiline
          numberOfLines={4}
          textAlignVertical='top'
          className='border border-gray-300 rounded-md p-2 h-28'
          {...props}
        />
      )}
    />
  );
}

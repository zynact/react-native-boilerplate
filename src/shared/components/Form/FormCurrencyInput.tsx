import React, { type ComponentProps } from 'react';

import { View, Text, TextInput } from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

interface FormCurrencyInputProps extends ComponentProps<typeof TextInput> {
  name: string;
  prefix?: string;
}

export function FormCurrencyInput({
  name,
  prefix = 'BD',
  ...props
}: FormCurrencyInputProps): React.JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=''
      render={({ field: { onChange, onBlur, value } }) => (
        <View className='flex-row items-center overflow-hidden rounded-lg border border-gray-300 bg-white'>
          <View className='justify-center bg-gray-100 px-4 py-3'>
            <Text className='font-medium text-gray-700'>{prefix}</Text>
          </View>

          <View className='h-full w-px bg-gray-300' />

          <TextInput
            inputMode={'numeric'}
            value={value?.toString() ?? ''}
            onBlur={onBlur}
            onChangeText={(text) => {
              const cleaned = parseFloat(text.replace(/[^0-9.]/g, ''));
              onChange(cleaned);
            }}
            keyboardType='decimal-pad'
            placeholder='0.000'
            className='flex-1 px-4 py-3 text-base text-gray-900'
            {...props}
          />
        </View>
      )}
    />
  );
}

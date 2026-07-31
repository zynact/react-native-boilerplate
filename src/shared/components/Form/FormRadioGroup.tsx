import React from 'react';

import { Pressable, Text, View } from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

interface FormRadioGroupOption {
  label: string;
  value: string;
}

interface FormRadioGroupProps {
  name: string;
  options: FormRadioGroupOption[];
  label?: string;
}

export function FormRadioGroup({ name, options, label }: FormRadioGroupProps): React.JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View>
          {label && <Text className='text-sm font-medium text-gray-700 mb-2'>{label}</Text>}
          <View className='gap-y-2'>
            {options.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => onChange(option.value)}
                className='flex-row items-center py-2'
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    value === option.value ? 'border-primary-500' : 'border-gray-300'
                  }`}
                >
                  {value === option.value && (
                    <View className='w-2.5 h-2.5 rounded-full bg-primary-500' />
                  )}
                </View>
                <Text className='ml-3 text-sm text-gray-700'>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    />
  );
}

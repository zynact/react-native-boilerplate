import React from 'react';

import { Pressable, Text, View } from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

interface FormSwitchProps {
  name: string;
  label?: string;
  description?: string;
}

export function FormSwitch({ name, label, description }: FormSwitchProps): React.JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Pressable
          onPress={() => onChange(!value)}
          className='flex-row items-center justify-between py-2'
        >
          <View className='flex-1'>
            {label && <Text className='text-sm font-medium text-gray-700'>{label}</Text>}
            {description && <Text className='text-sm text-gray-500'>{description}</Text>}
          </View>
          <View className={`w-12 h-6 rounded-full p-1 ${value ? 'bg-primary-500' : 'bg-gray-300'}`}>
            <View className={`w-4 h-4 rounded-full bg-white ${value ? 'ml-auto' : 'ml-0'}`} />
          </View>
        </Pressable>
      )}
    />
  );
}

import React from 'react';

import { View, Text, Pressable } from 'react-native';

import { TickSquare } from 'iconsax-react-nativejs';
import { useFormContext, Controller } from 'react-hook-form';

interface FormCheckboxProps {
  name: string;
  label?: string;
  description?: string;
}

export function FormCheckbox({ name, label, description }: FormCheckboxProps): React.JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Pressable onPress={() => onChange(!value)} className='flex-row items-center py-2'>
          <View
            className={`w-5 h-5 rounded border-2 items-center justify-center ${
              value ? 'bg-primary-500 border-primary-500' : 'border-gray-300 bg-white'
            }`}
          >
            {value && <TickSquare size={14} color='#ffffff' variant='Bold' />}
          </View>
          <View className='ml-3 flex-1'>
            {label && <Text className='text-sm font-medium text-gray-700'>{label}</Text>}
            {description && <Text className='text-sm text-gray-500'>{description}</Text>}
          </View>
        </Pressable>
      )}
    />
  );
}

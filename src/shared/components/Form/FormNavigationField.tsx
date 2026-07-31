import React from 'react';

import { Pressable, View } from 'react-native';

import { ArrowRight2 } from 'iconsax-react-nativejs';
import { useFormContext } from 'react-hook-form';

interface FormNavigationFieldProps {
  name: string;
  children: React.ReactNode;
  onClick: () => void;
}

export function FormNavigationField({
  name,
  children,
  onClick,
}: FormNavigationFieldProps): React.JSX.Element {
  const { register } = useFormContext();

  return (
    <Pressable
      onPress={onClick}
      className='flex cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm'
    >
      <View {...register(name)}>{children}</View>
      <ArrowRight2 size={18} color='#6b7280' variant='Outline' />
    </Pressable>
  );
}

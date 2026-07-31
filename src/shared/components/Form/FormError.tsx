import React from 'react';

import { Text } from 'react-native';

import { useFormContext } from 'react-hook-form';

interface FormErrorProps {
  name: string;
}

export function FormError({ name }: FormErrorProps): React.JSX.Element | null {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  if (!error) return null;

  const message = error.message as string | undefined;
  if (!message) return null;

  return <Text className='mt-1 text-sm text-red-600'>{message}</Text>;
}

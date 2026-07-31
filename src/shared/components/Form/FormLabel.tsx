import React from 'react';

import { Text } from 'react-native';

interface FormLabelProps {
  children: React.ReactNode;
}

export function FormLabel({ children }: FormLabelProps): React.JSX.Element {
  return <Text className='text-sm font-medium text-gray-700 mb-1'>{children}</Text>;
}

import React from 'react';

import { Text, View } from 'react-native';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
  icon,
}: FormSectionProps): React.JSX.Element {
  return (
    <View className='bg-white px-4 py-5 shadow rounded-lg p-6 mb-5'>
      {title && (
        <View>
          <View className={'flex-row items-center gap-2'}>
            {icon}
            <Text className='text-lg font-medium leading-6 text-gray-900'>{title}</Text>
          </View>
          {description && <Text className='mt-1 text-sm text-gray-500'>{description}</Text>}
        </View>
      )}
      <View className='mt-6 gap-y-6 gap-x-4'>{children}</View>
    </View>
  );
}

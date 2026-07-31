import React from 'react';

import { Text, View } from 'react-native';

import { Information } from 'iconsax-react-nativejs';

interface FormInfoCardProps {
  title: string;
  description: string;
}

export function FormInfoCard({ title, description }: FormInfoCardProps): React.JSX.Element {
  return (
    <View className='rounded-md bg-blue-50 p-4'>
      <View className='flex'>
        <View className='flex-shrink'>
          <Information />
        </View>
        <View className='ml-3'>
          <Text className='text-sm font-medium text-blue-800'>{title}</Text>
          <View className='mt-2'>
            <Text className='text-sm text-blue-700'>{description}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

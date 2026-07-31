import React, { useState } from 'react';

import { Modal, Pressable, Text, View } from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  options: FormSelectOption[];
  placeholder?: string;
}

export function FormSelect({
  name,
  options,
  placeholder = 'Select an option',
}: FormSelectProps): React.JSX.Element {
  const { control } = useFormContext();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View>
          <Pressable
            onPress={() => setModalVisible(true)}
            className='border border-gray-300 rounded-md p-2 flex-row items-center justify-between bg-white'
          >
            <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
              {options.find((opt) => opt.value === value)?.label || placeholder}
            </Text>
            <Text className='text-gray-500'>▼</Text>
          </Pressable>

          <Modal
            visible={modalVisible}
            transparent
            animationType='slide'
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              className='flex-1 justify-end bg-black/50'
              onPress={() => setModalVisible(false)}
            >
              <View className='bg-white rounded-t-xl p-4'>
                {options.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setModalVisible(false);
                    }}
                    className={`py-3 border-b border-gray-100 ${
                      value === option.value ? 'bg-primary-50' : ''
                    }`}
                  >
                    <Text
                      className={
                        value === option.value ? 'text-primary-600 font-medium' : 'text-gray-900'
                      }
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className='mt-4 py-3 bg-gray-100 rounded-lg'
                >
                  <Text className='text-center text-gray-700 font-medium'>Cancel</Text>
                </Pressable>
              </View>
            </Pressable>
          </Modal>
        </View>
      )}
    />
  );
}

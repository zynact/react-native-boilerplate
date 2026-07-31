import React, { useState } from 'react';

import { Modal, Pressable, Text, View } from 'react-native';

import { Calendar } from 'iconsax-react-nativejs';
import { Controller, useFormContext } from 'react-hook-form';

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
}

export function FormDatePicker({
  name,
  label,
  placeholder = 'Select a date',
}: FormDatePickerProps): React.JSX.Element {
  const { control } = useFormContext();
  const [modalVisible, setModalVisible] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (onChange: (value: string) => void, date: Date) => {
    const formatted = formatDate(date);
    onChange(formatted);
    setModalVisible(false);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View>
          {label && <Text className='text-sm font-medium text-gray-700 mb-1'>{label}</Text>}
          <Pressable
            onPress={() => setModalVisible(true)}
            className='border border-gray-300 rounded-md p-2 flex-row items-center justify-between bg-white'
          >
            <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
              {value || placeholder}
            </Text>
            <Calendar size={18} color='#6b7280' variant='Outline' />
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
                <Text className='text-lg font-semibold text-gray-900 mb-4 text-center'>
                  Select Date
                </Text>
                <View className='gap-y-3'>
                  {['Today', 'Tomorrow', 'Next Week'].map((option) => {
                    const date = new Date();
                    if (option === 'Tomorrow') date.setDate(date.getDate() + 1);
                    if (option === 'Next Week') date.setDate(date.getDate() + 7);

                    return (
                      <Pressable
                        key={option}
                        onPress={() => handleDateSelect(onChange, date)}
                        className={`py-3 border-b border-gray-100 ${
                          value === formatDate(date) ? 'bg-primary-50' : ''
                        }`}
                      >
                        <Text
                          className={
                            value === formatDate(date)
                              ? 'text-primary-600 font-medium'
                              : 'text-gray-900'
                          }
                        >
                          {option} ({formatDate(date)})
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
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

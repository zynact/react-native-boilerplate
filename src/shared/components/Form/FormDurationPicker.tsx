import React from 'react';

import { View, Text } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { Controller, useFormContext } from 'react-hook-form';

interface FormDurationPickerProps {
  name: string;
  maxHours?: number;
}

export function FormDurationPicker({
  name,
  maxHours = 24,
}: FormDurationPickerProps): React.JSX.Element {
  const { control } = useFormContext();

  const hours = Array.from({ length: maxHours + 1 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={0}
      render={({ field: { value, onChange } }) => {
        const totalMinutes = Number(value ?? 0);

        const selectedHours = Math.floor(totalMinutes / 60);
        const selectedMinutes = totalMinutes % 60;

        const updateDuration = (hour: number, minute: number) => {
          onChange(hour * 60 + minute);
        };

        return (
          <View className='flex-row items-center gap-3'>
            <View className='flex-1  border border-gray-300 rounded-lg overflow-hidden'>
              <Picker
                selectedValue={selectedHours}
                onValueChange={(hour) => updateDuration(Number(hour), selectedMinutes)}
                className={'border-1'}
              >
                {hours.map((hour) => (
                  <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour} />
                ))}
              </Picker>
            </View>

            <Text>hr</Text>

            <View className='flex-1 border border-gray-300 rounded-lg overflow-hidden'>
              <Picker
                selectedValue={selectedMinutes}
                onValueChange={(minute) => updateDuration(selectedHours, Number(minute))}
              >
                {minutes.map((minute) => (
                  <Picker.Item
                    key={minute}
                    label={minute.toString().padStart(2, '0')}
                    value={minute}
                  />
                ))}
              </Picker>
            </View>

            <Text>min</Text>
          </View>
        );
      }}
    />
  );
}

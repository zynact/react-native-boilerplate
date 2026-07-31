import React, { useRef } from 'react';

import {
  type NativeSyntheticEvent,
  TextInput,
  type TextInputKeyPressEventData,
  View,
} from 'react-native';

import { Controller, useFormContext } from 'react-hook-form';

interface FormOtpInputProps {
  name: string;
  disabled?: boolean;
}

export function FormOtpInput({ name, disabled }: FormOtpInputProps): React.JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <OtpInput value={value ?? ''} onChange={onChange} disabled={disabled} />
      )}
    />
  );
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function OtpInput({ value, onChange, disabled }: Props) {
  const inputs = useRef<Array<TextInput | null>>([]);

  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);

    const next = [...digits];
    next[index] = digit;

    onChange(next.join(''));

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key !== 'Backspace') return;

    if (digits[index]) {
      const next = [...digits];
      next[index] = '';
      onChange(next.join(''));
    } else if (index > 0) {
      inputs.current[index - 1]?.focus();

      const next = [...digits];
      next[index - 1] = '';
      onChange(next.join(''));
    }
  };

  return (
    <View className='flex-row justify-between'>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          editable={!disabled}
          keyboardType='number-pad'
          maxLength={1}
          textAlign='center'
          className='h-14 w-12 rounded-xl border border-secondary-300 bg-white text-xl font-semibold text-secondary-900'
        />
      ))}
    </View>
  );
}

import React from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { OtpInput } from './OtpInput';

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

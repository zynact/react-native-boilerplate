import React from 'react';

import { useFormState } from 'react-hook-form';

import { Button } from '../Button/Button';

interface FormSubmitButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export function FormSubmitButton({
  label = 'Submit',
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  disabled = false,
  onPress,
}: FormSubmitButtonProps): React.JSX.Element {
  const { isSubmitting } = useFormState();

  return (
    <Button
      label={label}
      onPress={onPress || (() => {})}
      variant={variant}
      size={size}
      loading={isSubmitting}
      disabled={disabled}
      fullWidth={fullWidth}
    />
  );
}

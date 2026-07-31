import React from 'react';

import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  children: React.ReactNode;
}

export function Form<T extends FieldValues>({
  methods,
  children,
}: FormProps<T>): React.JSX.Element {
  return <FormProvider {...methods}>{children}</FormProvider>;
}

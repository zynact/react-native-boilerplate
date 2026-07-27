import React from 'react';

import { Text as RNText } from 'react-native';

export interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'label' | 'overline';
  color?: 'default' | 'muted' | 'primary' | 'error' | 'success' | 'warning';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  numberOfLines?: number;
  testID?: string;
  className?: string;
}

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  h1: 'text-4xl leading-tight',
  h2: 'text-3xl leading-tight',
  h3: 'text-2xl leading-snug',
  h4: 'text-xl leading-snug',
  body: 'text-base leading-relaxed',
  bodySmall: 'text-sm leading-relaxed',
  caption: 'text-xs leading-normal',
  label: 'text-sm leading-none',
  overline: 'text-xs leading-none uppercase tracking-widest',
};

const colorClasses: Record<NonNullable<TextProps['color']>, string> = {
  default: 'text-secondary-900',
  muted: 'text-secondary-500',
  primary: 'text-primary-500',
  error: 'text-error',
  success: 'text-success',
  warning: 'text-warning',
};

const weightClasses: Record<NonNullable<TextProps['weight']>, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses: Record<NonNullable<TextProps['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const AppText = ({
  variant = 'body',
  color = 'default',
  weight = 'normal',
  align = 'left',
  children,
  numberOfLines,
  testID,
  className,
}: TextProps): React.JSX.Element => {
  const computedClass = [
    variantClasses[variant],
    colorClasses[color],
    weightClasses[weight],
    alignClasses[align],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RNText className={computedClass} numberOfLines={numberOfLines} testID={testID}>
      {children}
    </RNText>
  );
};

AppText.displayName = 'AppText';

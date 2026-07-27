# Theme Engine & Styling

This project utilizes **Tailwind CSS** (via **NativeWind** v4) for component styling, backed by a unified design token system.

## Design Tokens

Styling values are declared in JavaScript constants in [tokens.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/theme/tokens.ts) and configured for compile-time generation in [tailwind.config.js](file:///d:/Work/zynact/templates/react-native-template/tailwind.config.js):

- **Colors**: Curated, unified palette (primary, secondary, success, warning, error, info).
- **Typography**: Responsive font sizes and weights.
- **Spacing**: XS to 3XL layout scales.
- **Radius**: Standard borders (SM, MD, LG, XL, Full).
- **Shadows**: Platform-compatible shadows mapping both iOS shadow specs and Android elevation values.

---

## Styling Components

We prioritize Tailwind utility classes for consistent UI styling:

```tsx
import { View } from 'react-native';
import { Text } from '@shared/components';

export function Card(): React.JSX.Element {
  return (
    <View className='p-4 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-100 dark:border-slate-800'>
      <Text className='text-lg font-semibold text-slate-800 dark:text-slate-100'>
        Design System
      </Text>
    </View>
  );
}
```

---

## Dark Mode Support

NativeWind provides native hooks for toggling theme preferences inside [useColorScheme.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/theme/useColorScheme.ts):

```tsx
import { useColorScheme } from '@core/theme';

export function ThemeToggler() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      label={`Switch to ${colorScheme === 'dark' ? 'Light' : 'Dark'}`}
      onPress={toggleColorScheme}
    />
  );
}
```

Use the `dark:` prefix in classes to apply conditional styling properties automatically when the app theme shifts.

import { useNavigation as useRNNavigation, useRoute as useRNRoute } from '@react-navigation/native';

import type { RootStackParamList } from './navigation.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Typed useNavigation hook scoped to the root stack.
 * For screen-specific navigation (with params), use the screen's typed props instead.
 */
export function useNavigation(): NativeStackNavigationProp<RootStackParamList> {
  return useRNNavigation<NativeStackNavigationProp<RootStackParamList>>();
}

/**
 * Re-export useRoute for convenience. Use the typed screen props for full type safety.
 */
export const useRoute = useRNRoute;

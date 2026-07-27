import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { StyleSheet, View } from 'react-native';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface BottomSheetConfig {
  content: ReactNode;
  snapPoints?: (string | number)[];
}

interface BottomSheetContextValue {
  present: (config: BottomSheetConfig) => void;
  dismiss: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface BottomSheetProviderProps {
  children: ReactNode;
}

export function BottomSheetProvider({ children }: BottomSheetProviderProps): React.JSX.Element {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [config, setConfig] = useState<BottomSheetConfig | null>(null);

  const present = useCallback((cfg: BottomSheetConfig) => {
    setConfig(cfg);
    bottomSheetRef.current?.expand();
  }, []);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleClose = useCallback(() => {
    setConfig(null);
  }, []);

  return (
    <BottomSheetContext.Provider value={{ present, dismiss }}>
      {children}
      {config !== null && (
        <View style={StyleSheet.absoluteFill} pointerEvents='box-none'>
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={config.snapPoints ?? ['50%', '90%']}
            enablePanDownToClose
            onClose={handleClose}
          >
            <BottomSheetView style={styles.content}>{config.content}</BottomSheetView>
          </BottomSheet>
        </View>
      )}
    </BottomSheetContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useBottomSheet(): BottomSheetContextValue {
  const ctx = useContext(BottomSheetContext);
  if (ctx === null) {
    throw new Error('useBottomSheet must be used inside <BottomSheetProvider>');
  }
  return ctx;
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
});

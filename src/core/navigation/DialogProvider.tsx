import React, { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DialogAction {
  label: string;
  onPress: () => void;
  /** Defaults to false */
  isDestructive?: boolean;
}

export interface DialogConfig {
  title: string;
  message?: string;
  actions: DialogAction[];
}

interface DialogContextValue {
  show: (config: DialogConfig) => void;
  hide: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const DialogContext = createContext<DialogContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps): React.JSX.Element {
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback((cfg: DialogConfig) => {
    setConfig(cfg);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    // Clear config after animation
    setTimeout(() => setConfig(null), 300);
  }, []);

  return (
    <DialogContext.Provider value={{ show, hide }}>
      {children}
      <Modal
        transparent
        visible={visible}
        animationType='fade'
        statusBarTranslucent
        onRequestClose={hide}
      >
        <Pressable style={styles.backdrop} onPress={hide}>
          <Pressable style={styles.container}>
            {config !== null && (
              <>
                <Text style={styles.title}>{config.title}</Text>
                {config.message !== undefined && (
                  <Text style={styles.message}>{config.message}</Text>
                )}
                <View style={styles.actions}>
                  {config.actions.map((action) => (
                    <Pressable
                      key={action.label}
                      style={styles.actionButton}
                      onPress={() => {
                        action.onPress();
                        hide();
                      }}
                    >
                      <Text
                        style={[
                          styles.actionLabel,
                          action.isDestructive === true && styles.destructiveLabel,
                        ]}
                      >
                        {action.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </DialogContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (ctx === null) {
    throw new Error('useDialog must be used inside <DialogProvider>');
  }
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionLabel: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
    marginTop: 16,
  },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '80%',
  },
  destructiveLabel: {
    color: '#FF3B30',
  },
  message: {
    color: '#3C3C43',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  title: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});

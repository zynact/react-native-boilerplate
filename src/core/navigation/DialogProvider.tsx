import React, { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { Modal, Pressable, View } from 'react-native';

import { AppText } from '@shared/components';

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
        <Pressable className='flex-1 items-center justify-center bg-black/40' onPress={hide}>
          <Pressable
            className='bg-white rounded-2xl mx-10 px-5 pt-5 w-4/5'
            onPress={(e) => e.stopPropagation()}
          >
            {config !== null && (
              <>
                <AppText variant='h4' weight='semibold' align='center' className='text-slate-900'>
                  {config.title}
                </AppText>
                {config.message !== undefined && (
                  <AppText variant='bodySmall' align='center' className='text-slate-500 mt-1'>
                    {config.message}
                  </AppText>
                )}
                <View className='flex-row border-t border-slate-200 mt-4'>
                  {config.actions.map((action) => (
                    <Pressable
                      key={action.label}
                      className='flex-1 items-center py-3'
                      onPress={() => {
                        action.onPress();
                        hide();
                      }}
                    >
                      <AppText
                        variant='body'
                        weight='medium'
                        className={action.isDestructive === true ? 'text-red-500' : 'text-blue-500'}
                      >
                        {action.label}
                      </AppText>
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

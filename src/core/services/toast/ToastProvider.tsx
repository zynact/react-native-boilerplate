import React, { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { Animated, View } from 'react-native';

import { AppText } from '@shared/components';

import { ToastService, type ToastConfig, type ToastType } from './toast.service';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 3;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ToastItem {
  id: string;
  config: ToastConfig;
  opacity: Animated.Value;
}

// ─────────────────────────────────────────────────────────────────────────────
// Color Mapping for NativeWind
// ─────────────────────────────────────────────────────────────────────────────

const toastBgClasses: Record<ToastType, string> = {
  success: 'bg-success',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-info',
};

// ─────────────────────────────────────────────────────────────────────────────
// Individual Toast
// ─────────────────────────────────────────────────────────────────────────────

interface ToastItemViewProps {
  item: ToastItem;
}

function ToastItemView({ item }: ToastItemViewProps): React.JSX.Element {
  const type = item.config.type ?? 'info';
  const bgClass = toastBgClasses[type];

  return (
    <Animated.View
      style={{ opacity: item.opacity }}
      className={`rounded-lg mt-2 px-4 py-3 shadow-md ${bgClass}`}
    >
      <AppText variant='bodySmall' weight='medium' className='text-white'>
        {item.config.message}
      </AppText>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface ToastProviderProps {
  children: ReactNode;
}

let toastCounter = 0;

export function ToastProvider({ children }: ToastProviderProps): React.JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => {
      const item = prev.find((t) => t.id === id);
      if (item === undefined) return prev;

      Animated.timing(item.opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      });

      return prev;
    });

    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (config: ToastConfig) => {
      toastCounter += 1;
      const id = `toast_${toastCounter}`;
      const opacity = new Animated.Value(0);

      const item: ToastItem = { id, config, opacity };

      setToasts((prev) => {
        const next = [...prev, item].slice(-MAX_TOASTS);
        return next;
      });

      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss
      const duration = config.duration ?? DEFAULT_DURATION;
      const timer = setTimeout(() => {
        dismiss(id);
      }, duration);

      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    ToastService.register(addToast);
    const timers = timersRef.current;
    return () => {
      ToastService.unregister();
      // Clear all pending timers
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [addToast]);

  return (
    <>
      {children}
      {toasts.length > 0 && (
        <View className='absolute bottom-10 left-4 right-4' pointerEvents='none'>
          {toasts.map((item) => (
            <ToastItemView key={item.id} item={item} />
          ))}
        </View>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

class ToastServiceClass {
  private handler: ((config: ToastConfig) => void) | null = null;

  /**
   * Called by ToastProvider on mount to register the imperative handler.
   */
  register(handler: (config: ToastConfig) => void): void {
    this.handler = handler;
  }

  /**
   * Unregister the handler (called on provider unmount).
   */
  unregister(): void {
    this.handler = null;
  }

  show(config: ToastConfig): void {
    if (this.handler !== null) {
      this.handler(config);
    }
  }

  success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }
}

export const ToastService = new ToastServiceClass();

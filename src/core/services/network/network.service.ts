import {
  addEventListener as netInfoAddEventListener,
  type NetInfoState,
} from '@react-native-community/netinfo';

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

class NetworkServiceClass {
  private connected = true;
  private listeners: Set<(connected: boolean) => void> = new Set();
  private unsubscribeNetInfo: (() => void) | null = null;

  /**
   * Subscribe to NetInfo. Called once at app startup.
   */
  initialize(): void {
    if (this.unsubscribeNetInfo !== null) {
      return;
    }

    this.unsubscribeNetInfo = netInfoAddEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected === true;
      if (isConnected !== this.connected) {
        this.connected = isConnected;
        this.listeners.forEach((cb) => cb(this.connected));
      }
    });
  }

  /**
   * Returns the last-known connectivity status.
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Register a callback to be invoked whenever connectivity changes.
   * Returns an unsubscribe function.
   */
  onChange(callback: (connected: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const NetworkService = new NetworkServiceClass();

// Auto-initialize so consumers don't need to call initialize() manually.
NetworkService.initialize();

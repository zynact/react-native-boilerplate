import { Linking } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

class LinkingServiceClass {
  /**
   * Open a URL using the OS default handler.
   * Throws if the URL cannot be opened.
   */
  async openURL(url: string): Promise<void> {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      throw new Error(`[LinkingService] Cannot open URL: ${url}`);
    }
    await Linking.openURL(url);
  }

  /**
   * Open the app's settings page in the OS Settings app.
   */
  async openSettings(): Promise<void> {
    await Linking.openSettings();
  }

  /**
   * Returns true if the OS has a handler registered for the given URL scheme.
   */
  canOpenURL(url: string): Promise<boolean> {
    return Linking.canOpenURL(url);
  }

  /**
   * Returns the URL the app was launched with, if any.
   */
  getInitialURL(): Promise<string | null> {
    return Linking.getInitialURL();
  }
}

export const LinkingService = new LinkingServiceClass();

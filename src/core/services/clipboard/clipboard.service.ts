// NOTE: `Clipboard` from 'react-native' is deprecated as of RN 0.59. It is kept
// here for boilerplate convenience so no additional native dependency is
// required. Per the project roadmap, this service will be replaced by
// @react-native-clipboard/clipboard once the module is added to the project.

import { Clipboard } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

class ClipboardServiceClass {
  /**
   * Copy a string to the system clipboard.
   *
   * @deprecated The underlying `Clipboard` from 'react-native' is deprecated.
   *   Replace with @react-native-clipboard/clipboard when available.
   */
  copy(text: string): void {
    Clipboard.setString(text);
  }

  /**
   * Read the current string from the clipboard.
   *
   * @deprecated The underlying `Clipboard` from 'react-native' is deprecated.
   */
  async paste(): Promise<string> {
    return Clipboard.getString();
  }
}

export const ClipboardService = new ClipboardServiceClass();

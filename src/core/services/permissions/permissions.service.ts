import { Platform, PermissionsAndroid } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

/** Re-export the typed permission string union from RN for consumers. */
export type AndroidPermission =
  (typeof PermissionsAndroid.PERMISSIONS)[keyof typeof PermissionsAndroid.PERMISSIONS];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps an Android PermissionsAndroid result string to a PermissionStatus.
 */
function mapAndroidResult(result: string): PermissionStatus {
  switch (result) {
    case PermissionsAndroid.RESULTS.GRANTED:
      return 'granted';
    case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
      return 'blocked';
    default:
      return 'denied';
  }
}

/**
 * On iOS there is no built-in JS API to query arbitrary permissions.
 * We return 'unavailable' here. Use a native module (e.g. react-native-permissions)
 * if fine-grained iOS permission status is required.
 */
function iosUnavailable(): Promise<PermissionStatus> {
  return Promise.resolve('unavailable');
}

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

class PermissionsServiceClass {
  /**
   * Request camera permission.
   * On Android uses PermissionsAndroid; on iOS returns true (the OS will prompt
   * natively at the point the camera API is first used, or when AVCaptureDevice
   * requestAccess is called).
   */
  async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Camera Permission',
        message: 'This app needs access to your camera.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
        buttonNeutral: 'Ask Me Later',
      });
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS: the OS handles permission prompting natively.
    return true;
  }

  /**
   * Request microphone permission.
   */
  async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: 'Microphone Permission',
        message: 'This app needs access to your microphone.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
        buttonNeutral: 'Ask Me Later',
      });
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  /**
   * Request photo library (read external storage) permission.
   * On Android 13+ uses READ_MEDIA_IMAGES; on older versions READ_EXTERNAL_STORAGE.
   */
  async requestPhotoLibraryPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const permission: AndroidPermission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const result = await PermissionsAndroid.request(permission, {
        title: 'Photo Library Permission',
        message: 'This app needs access to your photo library.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
        buttonNeutral: 'Ask Me Later',
      });
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  /**
   * Check the status of a specific Android permission.
   * Accepts a typed `AndroidPermission` string on Android.
   * On iOS, returns 'unavailable' (no built-in JS check API).
   */
  async checkPermission(permission: AndroidPermission): Promise<PermissionStatus> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(permission);
      return granted ? 'granted' : 'denied';
    }
    return iosUnavailable();
  }

  /**
   * Request multiple Android permissions at once.
   * Returns a map of permission → status.
   */
  async requestMultiple(
    permissions: AndroidPermission[],
  ): Promise<Record<string, PermissionStatus>> {
    if (Platform.OS !== 'android') {
      const result: Record<string, PermissionStatus> = {};
      permissions.forEach((p) => {
        result[p] = 'unavailable';
      });
      return result;
    }

    const results = await PermissionsAndroid.requestMultiple(permissions);
    const mapped: Record<string, PermissionStatus> = {};
    Object.entries(results).forEach(([perm, value]) => {
      mapped[perm] = mapAndroidResult(value);
    });
    return mapped;
  }
}

export const PermissionsService = new PermissionsServiceClass();

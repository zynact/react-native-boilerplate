import { MMKV } from 'react-native-mmkv';

/**
 * Singleton MMKV storage instance for the entire app.
 * Use this via StorageService — do not import directly in feature code.
 */
export const storage = new MMKV({ id: 'app-storage' });

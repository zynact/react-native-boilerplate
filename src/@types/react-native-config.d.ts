/**
 * Type declarations for react-native-config.
 * Add keys here as your .env files grow.
 */
declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ENV?: string;
    API_BASE_URL?: string;
    API_TIMEOUT?: string;
    ENABLE_STORYBOOK?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

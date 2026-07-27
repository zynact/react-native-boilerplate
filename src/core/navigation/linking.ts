import type { RootStackParamList } from './navigation.types';
import type { LinkingOptions } from '@react-navigation/native';

/**
 * Deep linking configuration.
 *
 * URL scheme:   myapp://
 * Universal:    https://myapp.example.com
 *
 * Update the scheme in:
 *   Android: android/app/src/main/AndroidManifest.xml
 *   iOS:     ios/<AppName>/Info.plist
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.example.com', 'http://myapp.example.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      App: {
        screens: {
          MainTabs: {
            screens: {
              Home: 'home',
              Profile: 'profile',
            },
          },
        },
      },
      // Deep-link into a specific modal
      Modal: {
        screens: {},
      },
    },
  },
};

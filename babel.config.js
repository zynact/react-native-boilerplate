module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    // NativeWind preset – transforms className prop at build time
    // Must come after @react-native/babel-preset
    'nativewind/babel',
  ],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@core': './src/core',
          '@shared': './src/shared',
          '@features': './src/features',
          '@assets': './src/assets',
        },
      },
    ],
    // react-native-reanimated plugin MUST be listed last
    'react-native-reanimated/plugin',
  ],
};

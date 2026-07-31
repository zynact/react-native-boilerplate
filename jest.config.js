module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    '../../node_modules/(?!(react-native|react|@react-native|@react-navigation|@react-native-community|react-clone-referenced-element)/)',
  ],
};

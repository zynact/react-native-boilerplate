import React from 'react';

import { StatusBar, useColorScheme } from 'react-native';

import { ErrorBoundary } from '@core/error';
import { RootNavigator } from '@core/navigation';
import { RootProvider } from '@core/providers';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <RootProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ErrorBoundary>
        <RootNavigator />
      </ErrorBoundary>
    </RootProvider>
  );
}

export default App;

import React, { type ReactNode } from 'react';

import { Provider } from 'react-redux';

import { store } from '@core/store';

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps): React.JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}

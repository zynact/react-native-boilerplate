import { useEffect, useState } from 'react';

import { NetworkService } from '@core/services';

export interface NetworkStatus {
  isConnected: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [isConnected, setIsConnected] = useState<boolean>(NetworkService.isConnected());

  useEffect(() => {
    const unsubscribe = NetworkService.onChange((connected: boolean) => {
      setIsConnected(connected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected };
}

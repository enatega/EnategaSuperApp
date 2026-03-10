import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { RideAddressSelection } from '../api/types';
import { getRecentRideAddresses } from '../storage/recentRideAddresses';

export default function useRecentRideAddresses() {
  const [recentAddresses, setRecentAddresses] = useState<RideAddressSelection[]>([]);
  const [isLoadingRecentAddresses, setIsLoadingRecentAddresses] = useState(true);

  const refreshRecentAddresses = useCallback(async () => {
    setIsLoadingRecentAddresses(true);

    try {
      const recentItems = await getRecentRideAddresses();
      setRecentAddresses(recentItems);
    } finally {
      setIsLoadingRecentAddresses(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshRecentAddresses();
    }, [refreshRecentAddresses]),
  );

  return {
    recentAddresses,
    isLoadingRecentAddresses,
    refreshRecentAddresses,
  };
}

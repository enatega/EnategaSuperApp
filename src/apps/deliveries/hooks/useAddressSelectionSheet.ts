import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

type Params = {
  addressesCount: number;
  isLoading: boolean;
};

export default function useAddressSelectionSheet({
  addressesCount,
  isLoading,
}: Params) {
  const [isVisible, setIsVisible] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      hasAutoOpenedRef.current = false;
    }, []),
  );

  useEffect(() => {
    if (isLoading || isVisible) {
      return;
    }

    if (addressesCount > 0) {
      hasAutoOpenedRef.current = false;
      return;
    }

    if (hasAutoOpenedRef.current) {
      return;
    }

    hasAutoOpenedRef.current = true;
    setIsVisible(true);
  }, [addressesCount, isLoading, isVisible]);

  const open = useCallback(() => {
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    close,
    isVisible,
    open,
  };
}

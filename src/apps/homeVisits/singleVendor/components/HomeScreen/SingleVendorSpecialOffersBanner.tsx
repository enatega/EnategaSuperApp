import React from 'react';
import { View } from 'react-native';
import useSingleVendorBanners from '../../hooks/useSingleVendorBanners';
import Text from '../../../../../general/components/Text';

export default function SingleVendorSpecialOffersBanner() {
  const {
    data: banners = [],
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSingleVendorBanners();
  console.log('banners_____', banners);
  

  const handleIndexChange = React.useCallback(
    (index: number) => {
      const isNearTail = index >= banners.length - 2;

      if (!isNearTail || !hasNextPage || isFetchingNextPage) {
        return;
      }

      void fetchNextPage();
    },
    [banners.length, fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <View style={{ paddingVertical: 8, paddingHorizontal: 2 }}>
      <Text weight="semiBold">Special offers available</Text>
    </View>
  );
}

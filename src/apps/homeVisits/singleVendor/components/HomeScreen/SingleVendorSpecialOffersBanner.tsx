import React from 'react';
import SpecialOffersBanner from '../../../../deliveries/components/specialOffersBanner/SpecialOffersBanner';
import useSingleVendorBanners from '../../hooks/useSingleVendorBanners';

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
    <SpecialOffersBanner
      banners={banners}
      isPending={isPending}
      onIndexChange={handleIndexChange}
    />
  );
}

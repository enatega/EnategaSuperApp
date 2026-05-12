import React from 'react';
import { View } from 'react-native';
import useSingleVendorBanners from '../../hooks/useSingleVendorBanners';
import Text from '../../../../../general/components/Text';

export default function SingleVendorSpecialOffersBanner() {
  const { data: banners = [] } = useSingleVendorBanners();
  if (!banners.length) {
    return null;
  }

  return (
    <View style={{ paddingVertical: 8, paddingHorizontal: 2 }}>
      <Text weight="semiBold">Special offers available</Text>
    </View>
  );
}

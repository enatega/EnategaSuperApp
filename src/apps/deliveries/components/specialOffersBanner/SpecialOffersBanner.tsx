import React, { useCallback, useMemo, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import BannerSwiper from '../../../../general/components/BannerSwiper';
import { useTheme } from '../../../../general/theme/theme';
import type {
  DeliveryBanner,
  DeliveryBannerActionType,
  DeliveryNearbyStore,
} from '../../api/types';
import type { DeliveriesStackParamList } from '../../navigation/types';
import SpecialOffersBannerCard from './SpecialOffersBannerCard';
import SpecialOffersBannerSkeleton from './SpecialOffersBannerSkeleton';

type Props = {
  banners: DeliveryBanner[];
  isPending: boolean;
  onIndexChange?: (index: number) => void;
  layout?: 'swiper' | 'stack';
  maxItems?: number;
};

type BannerActionHandler = (banner: DeliveryBanner) => void;

function toStoreNavigationTarget(banner: DeliveryBanner): DeliveryNearbyStore | null {
  const storeId = banner.relatedStore?.trim() || banner.store?.id?.trim() || '';

  if (!storeId) {
    return null;
  }

  return {
    storeId,
    vendorId: '',
    name: banner.title?.trim() || banner.store?.address?.trim() || storeId,
    address: banner.store?.address ?? null,
    coverImage: banner.store?.coverImage ?? null,
    logo: banner.store?.storeImage ?? null,
  };
}

function resolveShopTypeTitle(banner: DeliveryBanner): string {
  const shopTypeName = banner.shopType?.name?.trim();

  if (shopTypeName) {
    return shopTypeName;
  }

  return (
    banner.title?.trim() ||
    banner.relatedShopType?.trim() ||
    banner.shopType?.id?.trim() ||
    ''
  );
}

export default function SpecialOffersBanner({
  banners,
  isPending,
  onIndexChange,
  layout = 'swiper',
  maxItems,
}: Props) {
  const navigation = useNavigation<NavigationProp<DeliveriesStackParamList>>();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerSidePadding = 20;
  const bannerWidth = width - bannerSidePadding * 2;
  const visibleBanners =
    typeof maxItems === 'number' && maxItems > 0 ? banners.slice(0, maxItems) : banners;
  const activeBannerIndex =
    visibleBanners.length > 0 ? Math.min(bannerIndex, visibleBanners.length - 1) : 0;
  const navigateToStore = useCallback(
    (banner: DeliveryBanner) => {
      const store = toStoreNavigationTarget(banner);

      if (!store) {
        return;
      }

      navigation.navigate('MultiVendor', {
        screen: 'StoreDetails',
        params: { store },
      });
    },
    [navigation],
  );
  const navigateToProduct = useCallback(
    (banner: DeliveryBanner) => {
      const productId = banner.relatedProduct?.trim() || banner.product?.id?.trim() || '';

      if (!productId) {
        return;
      }

      navigation.navigate('ProductInfo', { productId });
    },
    [navigation],
  );
  const navigateToShopType = useCallback(
    (banner: DeliveryBanner) => {
      const shopTypeId = banner.relatedShopType?.trim() || banner.shopType?.id?.trim() || '';

      if (!shopTypeId) {
        return;
      }

      navigation.navigate('SeeAllScreen', {
        queryType: 'shop-type-stores',
        title: resolveShopTypeTitle(banner),
        cardType: 'store',
        shopTypeId,
      });
    },
    [navigation],
  );
  const bannerActionHandlers = useMemo<
    Record<DeliveryBannerActionType, BannerActionHandler>
  >(
    () => ({
      store: navigateToStore,
      product: navigateToProduct,
      shop_type: navigateToShopType,
    }),
    [navigateToProduct, navigateToShopType, navigateToStore],
  );
  const handleBannerPress = useCallback(
    (banner: DeliveryBanner) => {
      const actionType = banner.actionType;

      if (!actionType) {
        return;
      }

      bannerActionHandlers[actionType]?.(banner);
    },
    [bannerActionHandlers],
  );

  if (isPending) {
    return <SpecialOffersBannerSkeleton />;
  }

  if (banners.length === 0) {
    return null;
  }

  if (visibleBanners.length === 0) {
    return null;
  }

  if (layout === 'stack') {
    return (
      <View style={[styles.wrapper, { width: bannerWidth + bannerSidePadding * 2, gap: 12 }]}>
        {visibleBanners.map((banner) => (
          <SpecialOffersBannerCard
            key={banner.id}
            banner={banner}
            onPress={() => handleBannerPress(banner)}
            sidePadding={bannerSidePadding}
            width={bannerWidth}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { width: bannerWidth + bannerSidePadding * 2 }]}>
      <BannerSwiper
        data={visibleBanners}
        onIndexChange={(index) => {
          setBannerIndex(index);
          onIndexChange?.(index);
        }}
        renderItem={({ item }) => (
          <SpecialOffersBannerCard
            banner={item}
            onPress={() => handleBannerPress(item)}
            sidePadding={bannerSidePadding}
            width={bannerWidth}
          />
        )}
      />

      <View style={styles.bannerDots}>
        {visibleBanners.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.bannerDot,
              index === activeBannerIndex
                ? styles.bannerDotActive
                : styles.bannerDotInactive,
              {
                backgroundColor:
                  index === activeBannerIndex
                    ? colors.primary
                    : colors.iconDisabled,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
  },
  bannerDots: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 10,
  },
  bannerDot: {
    borderRadius: 999,
    height: 6,
  },
  bannerDotActive: {
    width: 19,
  },
  bannerDotInactive: {
    width: 6,
  },
});

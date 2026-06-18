import React, { useCallback, useMemo, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppPopup from '../../../../general/components/AppPopup';
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
    isOpen: banner.store?.isOpen,
    isAvailable: banner.store?.isAvailable,
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
}: Props) {
  const navigation = useNavigation<NavigationProp<DeliveriesStackParamList>>();
  const { t } = useTranslation('deliveries');
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedClosedStore, setSelectedClosedStore] = useState<DeliveryNearbyStore | null>(null);
  const bannerSidePadding = 20;
  const bannerWidth = width - bannerSidePadding * 2;
  const activeBannerIndex =
    banners.length > 0 ? Math.min(bannerIndex, banners.length - 1) : 0;
  const closedStoreTypeName = useMemo(
    () => selectedClosedStore?.shopTypeName?.trim() || t('store_details_closed_store_fallback_name'),
    [selectedClosedStore?.shopTypeName, t],
  );
  const navigateToStore = useCallback(
    (banner: DeliveryBanner) => {
      const store = toStoreNavigationTarget(banner);

      if (!store) {
        return;
      }

      if (store.isOpen === false) {
        setSelectedClosedStore(store);
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

  return (
    <View style={[styles.wrapper, { width: bannerWidth + bannerSidePadding * 2 }]}>
      <BannerSwiper
        data={banners}
        onIndexChange={(index) => {
          setBannerIndex(index);
          onIndexChange?.(index);
        }}
        renderItem={({ item }) => (
          <SpecialOffersBannerCard
            banner={item}
            closedLabel={t('store_status_closed')}
            isClosed={item.actionType === 'store' && item.store?.isOpen === false}
            onPress={() => handleBannerPress(item)}
            sidePadding={bannerSidePadding}
            width={bannerWidth}
          />
        )}
      />

      <View style={styles.bannerDots}>
        {banners.map((item, index) => (
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

      <AppPopup
        description={t('store_details_closed_store_description', { shopTypeName: closedStoreTypeName })}
        dismissOnOverlayPress
        onRequestClose={() => setSelectedClosedStore(null)}
        primaryAction={{
          label: t('store_details_close'),
          onPress: () => setSelectedClosedStore(null),
        }}
        secondaryAction={{
          label: t('store_closed_see_menu'),
          onPress: () => {
            if (!selectedClosedStore) {
              return;
            }

            navigation.navigate('MultiVendor', {
              screen: 'StoreDetails',
              params: { store: selectedClosedStore },
            });
            setSelectedClosedStore(null);
          },
          variant: 'secondary',
          labelStyle: { color: colors.primary },
        }}
        title={t('store_closed_modal_title')}
        visible={Boolean(selectedClosedStore)}
      />
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

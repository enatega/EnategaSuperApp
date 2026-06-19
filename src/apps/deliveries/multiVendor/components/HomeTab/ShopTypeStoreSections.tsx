import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import Text from '../../../../../general/components/Text';
import HorizontalList from '../../../../../general/components/HorizontalList';
import AppPopup from '../../../../../general/components/AppPopup';
import { useTheme } from '../../../../../general/theme/theme';
import { useShopTypeStoresSections, useShopTypes } from '../../../hooks';
import StoreCard from '../../../components/storeCard/StoreCard';
import type { DeliveryNearbyStore } from '../../../api/types';
import { DeliveriesStackParamList } from '../../../navigation/types';
import { MultiVendorStackParamList } from '../../navigation/types';
import DeliveriesSectionEmptyState from '../../../components/home/DeliveriesSectionEmptyState';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../components/discovery';

type NavProp = CompositeNavigationProp<
  NativeStackNavigationProp<MultiVendorStackParamList>,
  NativeStackNavigationProp<DeliveriesStackParamList>
>;

function decodeDisplayText(value: string) {
  let decodedValue = value;

  if (decodedValue.includes('%')) {
    try {
      decodedValue = decodeURIComponent(decodedValue);
    } catch {
      decodedValue = value;
    }
  }

  return decodedValue.replace(/%amp;|&amp;|&#38;/gi, '&');
}

export default function ShopTypeStoreSections() {
  const { t } = useTranslation('deliveries');
  const { typography } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { data: shopTypes = [] } = useShopTypes();
  const shopTypeStoreSections = useShopTypeStoresSections(shopTypes);
  const [selectedClosedStore, setSelectedClosedStore] = useState<DeliveryNearbyStore | null>(null);
  const closedStoreTypeName = useMemo(
    () => selectedClosedStore?.shopTypeName?.trim() || t('store_details_closed_store_fallback_name'),
    [selectedClosedStore?.shopTypeName, t],
  );

  const handleShopTypeSeeAll = useCallback(
    (shopTypeId: string, title: string) => {
      navigation.navigate('SeeAllScreen', {
        queryType: 'shop-type-stores',
        title,
        cardType: 'store',
        shopTypeId,
      });
    },
    [navigation],
  );
  const handleCloseClosedStorePopup = useCallback(() => {
    setSelectedClosedStore(null);
  }, []);

  const handleSeeMenu = useCallback(() => {
    if (!selectedClosedStore) {
      return;
    }

    navigation.navigate('StoreDetails', { store: selectedClosedStore });
    setSelectedClosedStore(null);
  }, [navigation, selectedClosedStore]);



  return (
    <View style={styles.container}>
      {shopTypeStoreSections.map(
        ({ shopType, data = [], error, isPending: isStoresPending }) => {
          const resolvedShopTypeName = decodeDisplayText(shopType.name);
          const normalizedShopTypeName = resolvedShopTypeName.trim().toLowerCase();
          const isEmpty = !isStoresPending && !error && data.length === 0;
          const shouldShowSeeAll = !isStoresPending && !error && data.length > 0;
          const trackedSectionNames = new Set([
            'bakery',
            'farmer market',
            'flower and gift',
            'flower and gifts',
            'food deliveries',
          ]);


          return (
            <View key={shopType.id} style={styles.storeSection}>
              {!shouldShowSeeAll ? (
                <Text
                  weight="extraBold"
                  style={{
                    fontSize: typography.size.h5,
                    letterSpacing: -0.36,
                    lineHeight: typography.lineHeight.h5,
                  }}
                >
                  {resolvedShopTypeName}
                </Text>
              ) : (
                <SectionActionHeader
                  title={resolvedShopTypeName}
                  actionLabel={t('multi_vendor_see_all')}
                  onActionPress={() => handleShopTypeSeeAll(shopType.id, resolvedShopTypeName)}
                />
              )}

              {isStoresPending ? (
                <DiscoveryResultsSkeleton />
              ) : error ? (
                <DiscoverySectionState
                  tone="error"
                  title={t('multi_vendor_home_section_error_title')}
                  message={t('multi_vendor_home_section_error_message')}
                />
              ) : isEmpty ? (
                <DeliveriesSectionEmptyState
                  title={t('multi_vendor_home_section_empty_title')}
                  message={t('multi_vendor_shop_type_stores_empty')}
                />
              ) : (
                <HorizontalList
                  data={data}
                  extraData={data.map((item) => `${item.storeId}:${item.isOpen}:${item.isAvailable}`).join('|')}
                  keyExtractor={(item, index) =>
                    `${shopType.id}-${item.storeId}-${item.isOpen === false ? 'closed' : 'open'}-${item.isAvailable === false ? 'unavailable' : 'available'
                    }-${index}`
                  }
                  contentContainerStyle={styles.listContent}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  renderItem={({ item }) => {
                    const isClosedStore = item.isOpen === false || item.isAvailable === false;
                    return (
                      <StoreCard
                        store={item}
                        showClosedOverlay={isClosedStore}
                        onClosedPress={
                          isClosedStore
                            ? () => setSelectedClosedStore(item)
                            : undefined
                        }
                      />
                    );
                  }}
                />
              )}
            </View>
          );
        },
      )}

      <AppPopup
        description={t('store_details_closed_store_description', { shopTypeName: closedStoreTypeName })}
        dismissOnOverlayPress
        onRequestClose={handleCloseClosedStorePopup}
        primaryAction={{
          label: t('store_details_close'),
          onPress: handleCloseClosedStorePopup,
        }}
        secondaryAction={{
          label: t('store_closed_see_menu'),
          onPress: handleSeeMenu,
          variant: 'secondary',
        }}
        title={t('store_closed_modal_title')}
        visible={Boolean(selectedClosedStore)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  storeSection: {
    gap: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});

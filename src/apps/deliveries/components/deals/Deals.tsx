import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import Text from '../../../../general/components/Text';
import AppPopup from '../../../../general/components/AppPopup';
import type { SearchStoreItem } from '../../api/searchServiceTypes';
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../../api/types';
import type { DeliveriesStoreDetailsParamList } from '../../navigation/sharedTypes';
import DeliveriesSectionEmptyState from '../home/DeliveriesSectionEmptyState';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../discovery';
import StoreCard from '../storeCard/StoreCard';

type DealsItem = DeliveryNearbyStore | SearchStoreItem | DeliveryShopTypeProduct;
type NavigationProp = NativeStackNavigationProp<DeliveriesStoreDetailsParamList>;

type Props = {
  title: string;
  items: DealsItem[];
  isPending: boolean;
  isError: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  onItemPress?: (item: DealsItem) => void;
};

function isProductItem(item: DealsItem): item is DeliveryShopTypeProduct {
  return 'productId' in item && 'productName' in item;
}

function getItemKey(item: DealsItem, index: number) {
  if (isProductItem(item)) {
    return `${item.productId}-${item.storeId}`;
  }

  return `${item.storeId}-${item.deal ?? item.dealAmount ?? index}`;
}

export default function Deals({
  title,
  items,
  isPending,
  isError,
  actionLabel,
  onActionPress,
  onItemPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
  const [selectedClosedStore, setSelectedClosedStore] = useState<DeliveryNearbyStore | null>(null);
  const isEmpty = !isPending && !isError && items.length === 0;
  const shouldShowAction = Boolean(actionLabel) && !isPending && !isError && items.length > 0;
  const closedStoreTypeName = useMemo(
    () => selectedClosedStore?.shopTypeName?.trim() || t('store_details_closed_store_fallback_name'),
    [selectedClosedStore?.shopTypeName, t],
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
  const renderItem = useCallback(
    ({ item }: { item: DealsItem }) => {
      const isClosedStore = !isProductItem(item) && item.isOpen === false;

      return (
        <StoreCard
          store={item}
          showClosedOverlay={isClosedStore}
          onClosedPress={isClosedStore ? () => setSelectedClosedStore(item) : undefined}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
        />
      );
    },
    [onItemPress],
  );

  return (
    <View style={styles.section}>
      {shouldShowAction ? (
        <SectionActionHeader
          actionLabel={actionLabel!}
          onActionPress={onActionPress}
          title={title}
        />
      ) : (
        <Text
          weight="extraBold"
          style={{
            fontSize: typography.size.h5,
            letterSpacing: -0.36,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {title}
        </Text>
      )}

      {isPending ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('multi_vendor_home_section_error_title')}
          message={t('multi_vendor_home_section_error_message')}
        />
      ) : isEmpty ? (
        <DeliveriesSectionEmptyState
          title={t('multi_vendor_home_section_empty_title')}
          message={t('multi_vendor_home_section_empty_message')}
        />
      ) : (
        <HorizontalList
          data={items}
          keyExtractor={getItemKey}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={renderItem}
        />
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
          labelStyle: { color: colors.primary },
        }}
        title={t('store_closed_modal_title')}
        visible={Boolean(selectedClosedStore)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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

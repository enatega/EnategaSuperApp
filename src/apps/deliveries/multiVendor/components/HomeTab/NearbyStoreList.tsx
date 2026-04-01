import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { useNearbyStores } from '../../../hooks';
import type { DeliveryNearbyStore } from '../../../api/types';
import StoreCard from '../../../components/storeCard/StoreCard';
import NearbyStoreListSkeleton from './HomeTabSkeletons/NearbyStoreListSkeleton';
import type { MultiVendorStackParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  "SeeAllScreen"
>;

export default function NearbyStoreList() {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavProp>();
  const { colors, typography } = useTheme();
  const { data: nearbyStoresData = [], isPending: isNearbyStoresPending } = useNearbyStores();
  const isEmpty = !isNearbyStoresPending && nearbyStoresData.length === 0;

  const handleSeeAllNearbyRestaurants = useCallback(() => {
    navigation.navigate('SeeAllScreen', {
      queryType: 'nearby-stores',
      title: t('multi_vendor_nearby_store_title'),
      cardType: 'store',
    });
  }, [navigation, t]);

  const renderItem = ({ item }: { item: DeliveryNearbyStore }) => (
    <StoreCard store={item} />
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_nearby_store_title')}
        onActionPress={handleSeeAllNearbyRestaurants}
      />

      {isNearbyStoresPending ? (
        <NearbyStoreListSkeleton />
      ) : isEmpty ? (
        <View
          style={[
            styles.messageContainer,
            { backgroundColor: colors.blue50 },
          ]}
        >
          <Text
            weight="medium"
            style={[
              styles.messageText,
              {
                color: colors.mutedText,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.sm2,
              },
            ]}
          >
            {t('multi_vendor_location_stores_empty')}
          </Text>
        </View>
      ) : (
        <HorizontalList
          data={nearbyStoresData}
          keyExtractor={(item) => item.storeId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  messageText: {
    textAlign: "center",
  },
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

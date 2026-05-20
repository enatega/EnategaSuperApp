import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../general/components/Text';
import Image from '../../../general/components/Image';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { usePublicShopTypes } from '../../deliveries/hooks';
import type { ImageSourcePropType } from 'react-native';
import DeliveriesSectionEmptyState from '../../deliveries/components/home/DeliveriesSectionEmptyState';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../deliveries/components/discovery';

type DeliveryService = {
  id: string;
  title: string;
  imageUrl?: string | null;
  imageSource?: ImageSourcePropType;
  cardWidth: number;
};

type Props = {
  onSelectService?: (shopTypeId: string) => void;
};

export default function DeliveryServicesSection({ onSelectService }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation(['rideSharing', 'deliveries']);
  const { data: shopTypes = [], isLoading, isError } = usePublicShopTypes();

  const dynamicItems: DeliveryService[] = shopTypes.slice(0, 8).map((shopType) => ({
    id: shopType.id,
    title: shopType.name,
    imageUrl: shopType.image ?? null,
    cardWidth: 152,
  }));
  const items: DeliveryService[] = dynamicItems;
  const isEmpty = !isLoading && !isError && items.length === 0;

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={[
          styles.sectionTitle,
          {
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.md,
            color: colors.text,
          },
        ]}
      >
        {t('delivery_services_title')}
      </Text>

      {isLoading ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('multi_vendor_home_section_error_title', { ns: 'deliveries' })}
          message={t('multi_vendor_home_section_error_message', { ns: 'deliveries' })}
        />
      ) : isEmpty ? (
        <DeliveriesSectionEmptyState
          title={t('multi_vendor_home_section_empty_title', { ns: 'deliveries' })}
          message={t('multi_vendor_shop_types_empty', { ns: 'deliveries' })}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowContent}
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.card,
                {
                  width: item.cardWidth,
                  backgroundColor: colors.blue50,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={() => onSelectService?.(item.id)}
            >
              <Text
                weight="semiBold"
                style={[
                  styles.cardTitle,
                  {
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.xs2,
                    color: colors.text,
                  },
                ]}
              >
                {item.title}
              </Text>
              {item.imageSource ? (
                <Image source={item.imageSource} style={styles.image} />
              ) : item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.imageFallback, { backgroundColor: colors.border }]} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  sectionTitle: {
  },
  rowContent: {
    gap: 12,
    paddingRight: 12,
  },
  card: {
    height: 81,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardTitle: {
    maxWidth: 74,
  },
  image: {
    width: 48,
    height: 48,
  },
  imageFallback: {
    width: 48,
    height: 48,
  },
});

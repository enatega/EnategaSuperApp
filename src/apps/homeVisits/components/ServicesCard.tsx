import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Image from '../../../general/components/Image';
import Text from '../../../general/components/Text';
import Icon from '../../../general/components/Icon';
import { useTheme } from '../../../general/theme/theme';
import type {
  HomeVisitsSingleVendorCategoryService,
  HomeVisitsSingleVendorDeal,
} from '../singleVendor/api/types';

interface DealCardProps {
  item: HomeVisitsSingleVendorDeal | HomeVisitsSingleVendorCategoryService;
  onPress?: () => void;
}

export default function ServicesCard({ item, onPress }: DealCardProps) {
  const { colors, typography } = useTheme();
  const imageUrl =
    item.productImage || item.storeImage || item.storeLogo || 'https://placehold.co/400x400.png';

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {item.deal && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Ionicons name="pricetag" size={12} color={colors.white} style={styles.badgeIcon} />
            <Text variant="caption" weight="semiBold" style={{ color: colors.white, fontSize: 12 }}>
              {item.deal}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text
          variant="subtitle"
          weight="semiBold"
          numberOfLines={1}
          style={{ color: colors.text, fontSize: 14, lineHeight: 22 }}
        >
          {item.productName}
        </Text>

        <View style={styles.row}>
          {item.averageRating != null && (
            <View style={styles.ratingRow}>
              <Icon type="AntDesign" name="star" size={14} color={colors.yellow500} />
              <Text weight="semiBold" style={{ color: colors.text, marginLeft: 4 }}>
                {item.averageRating.toFixed(1)}
              </Text>
            </View>
          )}
          {item.reviewCount != null && (
            <Text weight="regular" style={{ color: colors.mutedText, fontSize: 12, lineHeight: 18, marginRight: 6 }}>
              ({item.reviewCount.toLocaleString()}+)
            </Text>
          )}
          {item.storeName && (
            <Text weight="medium" style={{ color: colors.mutedText, fontSize: 12, lineHeight: 18 }}>
              {item.storeName}
            </Text>
          )}
        </View>

        <View style={[styles.line, { backgroundColor: colors.border }]} />

        <View style={styles.row}>
          {item.price != null && (
            <View style={styles.infoItem}>
              <Icon type="MaterialIcons" name="attach-money" size={16} color={colors.mutedText} />
              <Text weight="medium" style={{ color: colors.mutedText, fontSize: 12, lineHeight: 18 }}>
                {item.price.toFixed(2)}
              </Text>
            </View>
          )}
          {item.dealAmount != null && (
            <>
              <Icon type="Entypo" name="dot-single" size={16} color={colors.border} />
              <View style={styles.infoItem}>
                <Icon type="MaterialIcons" name="local-offer" size={14} color={colors.mutedText} />
                <Text weight="medium" style={{ color: colors.mutedText, fontSize: 12, lineHeight: 18 }}>
                  {item.dealType === 'percentage' ? `${item.dealAmount}% off` : `-$${item.dealAmount}`}
                </Text>
              </View>
            </>
          )}
          {item.priceTier && (
            <>
              <Icon type="Entypo" name="dot-single" size={16} color={colors.border} />
              <Text weight="medium" style={{ color: colors.mutedText, fontSize: 12, lineHeight: 18 }}>
                {item.priceTier}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeIcon: {
    marginRight: 4,
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  line: {
    height: 1,
    marginVertical: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

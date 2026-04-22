import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Image from '../../../general/components/Image';
import Text from '../../../general/components/Text';
import Icon from '../../../general/components/Icon';
import { useTheme } from '../../../general/theme/theme';
import type {
  HomeVisitsSingleVendorCategoryService,
  HomeVisitsSingleVendorDeal,
  HomeVisitsSingleVendorMostPopularService,
  HomeVisitsSingleVendorNearbyService,
} from '../singleVendor/api/types';
import type { SearchServiceItem } from '../api/searchServiceTypes';
import type { HomeVisitsSingleVendorNavigationParamList } from '../singleVendor/navigation/types';

interface DealCardProps {
  item:
    | HomeVisitsSingleVendorDeal
    | HomeVisitsSingleVendorCategoryService
    | HomeVisitsSingleVendorMostPopularService
    | HomeVisitsSingleVendorNearbyService
    | SearchServiceItem;
  onPress?: () => void;
  layout?: 'compact' | 'fullWidth';
}

export default function ServicesCard({
  item,
  onPress,
  layout = 'compact',
}: DealCardProps) {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const imageUrl =
    item.productImage || item.storeImage || item.storeLogo || 'https://placehold.co/400x400.png';
  const shouldShowFavoriteIcon = typeof item.isFavorite === 'boolean';
  const favoriteIconName = item.isFavorite ? 'heart' : 'heart-outline';

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    navigation.navigate('ServiceDetailsPage', { serviceId: item.productId });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.container,
        layout === 'fullWidth' ? styles.fullWidthContainer : styles.compactContainer,
        { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {shouldShowFavoriteIcon ? (
          <View
            style={[
              styles.favoriteBadge,
              { backgroundColor: colors.white, shadowColor: colors.shadowColor },
            ]}
          >
            <Ionicons
              name={favoriteIconName}
              size={20}
              color={item.isFavorite ? colors.danger : colors.text}
            />
          </View>
        ) : null}
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
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  compactContainer: {
    width: 280,
  },
  fullWidthContainer: {
    width: '100%',
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
  favoriteBadge: {
    alignItems: 'center',
    borderRadius: 22,
    elevation: 3,
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    top: 10,
    width: 44,
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

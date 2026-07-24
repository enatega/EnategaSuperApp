import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../general/components/Icon';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentStoreCategory } from '../../api/types';
import AppointmentDetailTabs from './AppointmentDetailTabs';
import AppointmentDetailsCircleButton from './AppointmentDetailsCircleButton';
import AppointmentDetailsSectionHeader from './AppointmentDetailsSectionHeader';

type Props = {
  title: string;
  address: string;
  coverImageUrl: string;
  isFavourite: boolean;
  openUntilLabel: string;
  insets: EdgeInsets;
  categories: AppointmentStoreCategory[];
  visibleSubcategories: AppointmentStoreCategory[];
  selectedCategoryId: string | null;
  selectedSubcategoryId: string | null;
  onBackPress: () => void;
  onFavouritePress: () => void;
  onSharePress: () => void;
  onContactPress: () => void;
  onCategorySelect: (value: string | null) => void;
  onSubcategorySelect: (value: string | null) => void;
  ratingLabel: string;
};

export default function AppointmentDetailsHeader({
  title,
  address,
  categories,
  coverImageUrl,
  insets,
  isFavourite,
  onBackPress,
  onCategorySelect,
  onContactPress,
  onFavouritePress,
  onSharePress,
  onSubcategorySelect,
  openUntilLabel,
  ratingLabel,
  selectedCategoryId,
  selectedSubcategoryId,
  visibleSubcategories,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeVisibleSubcategories = Array.isArray(visibleSubcategories)
    ? visibleSubcategories
    : [];

  return (
    <View>
      <View style={styles.heroContainer}>
        <Image resizeMode="cover" source={{ uri: coverImageUrl }} style={styles.heroImage} />
        <LinearGradient
          colors={['rgba(17, 24, 39, 0.05)', 'rgba(17, 24, 39, 0.45)']}
          style={styles.heroOverlay}
        />

        <View style={[styles.heroActions, { paddingTop: insets.top + 10 }]}>
          <AppointmentDetailsCircleButton
            icon="chevron-back"
            label={t('details_action_back')}
            onPress={onBackPress}
          />
          <AppointmentDetailsCircleButton
            icon={isFavourite ? 'heart' : 'heart-outline'}
            iconColor={isFavourite ? colors.primary : colors.text}
            label={t('favourites_title')}
            onPress={onFavouritePress}
          />
        </View>
      </View>

      <View
        style={[
          styles.surfaceCard,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={[styles.heroHandle, { backgroundColor: colors.primary }]} />

        <View style={styles.titleRow}>
          <View style={styles.titleContent}>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.lg,
              }}
              weight="extraBold"
            >
              {title}
            </Text>

            <View style={styles.ratingRow}>
              <Icon color={colors.warning} name="star" size={16} />
              <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
                {ratingLabel}
              </Text>
            </View>

            <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
              {address}
            </Text>
            <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
              {openUntilLabel}
            </Text>
          </View>

          <Pressable
            accessibilityLabel={t('details_action_share')}
            onPress={onSharePress}
            style={[styles.inlineShareButton, { backgroundColor: colors.surfaceSoft }]}
          >
            <Icon color={colors.mutedText} name="share-outline" size={18} />
          </Pressable>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Pressable onPress={onContactPress} style={styles.contactRow}>
          <View style={styles.contactRowLeft}>
            <Icon color={colors.text} name="chatbox-ellipses-outline" size={20} />
            <Text style={{ color: colors.text, fontSize: typography.size.md }} weight="semiBold">
              {t('details_get_in_touch')}
            </Text>
          </View>
          <Icon color={colors.mutedText} name="chevron-forward" size={20} />
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <AppointmentDetailsSectionHeader title={t('details_our_services')} />

        <AppointmentDetailTabs
          activeCategoryId={selectedCategoryId}
          categories={safeCategories}
          disabled={false}
          onSelect={onCategorySelect}
          titleAll={t('details_tab_all')}
        />

        {selectedCategoryId && safeVisibleSubcategories.length > 0 ? (
          <AppointmentDetailTabs
            activeCategoryId={selectedSubcategoryId}
            categories={safeVisibleSubcategories}
            disabled={false}
            onSelect={onSubcategorySelect}
            titleAll={t('details_tab_all')}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contactRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  contactRowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 18,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  heroContainer: {
    height: 260,
    overflow: 'hidden',
  },
  heroHandle: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 4,
    marginBottom: 16,
    width: 28,
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  inlineShareButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginTop: 4,
    width: 32,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  surfaceCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -22,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  titleContent: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
});

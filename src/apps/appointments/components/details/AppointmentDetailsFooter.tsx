import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import AppointmentDetailsReviewCard from './AppointmentDetailsReviewCard';
import AppointmentDetailsSectionHeader from './AppointmentDetailsSectionHeader';
import AppointmentDetailsTeamMemberCard from './AppointmentDetailsTeamMemberCard';
import type { AdditionalInfoItem, OpeningDay, ReviewPreview, TeamMember } from './detailTypes';

type Props = {
  servicesCount: number;
  canShowSeeAllServices: boolean;
  onShowAllServices: () => void;
  onShowAllTeam?: () => void;
  teamMembers: TeamMember[];
  reviewCount: number;
  rating: string | null;
  reviewPreviews: ReviewPreview[];
  about: string;
  openingDays: OpeningDay[];
  hoursFallback: string;
  additionalInfoItems: AdditionalInfoItem[];
  address: string;
  onOpenDirections: () => void;
  isFetchingNextPage: boolean;
};

export default function AppointmentDetailsFooter({
  about,
  additionalInfoItems,
  address,
  canShowSeeAllServices,
  hoursFallback,
  isFetchingNextPage,
  onOpenDirections,
  onShowAllServices,
  onShowAllTeam,
  openingDays,
  rating,
  reviewCount,
  reviewPreviews,
  servicesCount,
  teamMembers,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const visibleTeamMembers = teamMembers.slice(0, 4);
  const canShowAllTeam = teamMembers.length > 4;

  return (
    <View style={[styles.sections, { backgroundColor: colors.surface }]}>
      {servicesCount > 0 && canShowSeeAllServices ? (
        <Pressable
          onPress={onShowAllServices}
          style={[
            styles.secondaryCta,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text style={{ color: colors.text, fontSize: typography.size.sm }} weight="semiBold">
            {t('multi_vendor_see_all')}
          </Text>
        </Pressable>
      ) : null}

      {teamMembers.length > 0 ? (
        <View style={styles.sectionNoDivider}>
          <AppointmentDetailsSectionHeader
            actionLabel={canShowAllTeam ? t('multi_vendor_see_all') : undefined}
            onPress={canShowAllTeam ? onShowAllTeam : undefined}
            title={t('details_team')}
          />
          <View style={styles.teamRow}>
            {visibleTeamMembers.map((member) => (
              <AppointmentDetailsTeamMemberCard key={member.id} item={member} />
            ))}
          </View>
        </View>
      ) : null}

      {reviewCount > 0 ? (
        <View style={styles.sectionNoDivider}>
          <AppointmentDetailsSectionHeader title={t('details_reviews')} />
          <View style={styles.reviewSummary}>
            <View style={styles.reviewStarsRow}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Icon key={`summary-star-${index}`} color={colors.warning} name="star" size={18} />
              ))}
            </View>
            <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
              {rating
                ? t('details_rating_with_count', { rating, count: reviewCount })
                : t('details_reviews_count', { count: reviewCount })}
            </Text>
          </View>
          {reviewPreviews.map((review) => (
            <AppointmentDetailsReviewCard key={review.id} item={review} />
          ))}
        </View>
      ) : null}

      <View style={styles.sectionNoDivider}>
        <AppointmentDetailsSectionHeader title={t('details_about_title')} />
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.sm,
            lineHeight: typography.lineHeight.md + 2,
          }}
        >
          {about}
        </Text>
      </View>

      <View style={styles.sectionNoDivider}>
        <AppointmentDetailsSectionHeader title={t('details_opening_times')} />
        <View style={styles.hoursList}>
          {openingDays.length > 0 ? (
            openingDays.map((item) => (
              <View key={item.day} style={styles.hoursRow}>
                <Text
                  style={{
                    color: item.isActive ? colors.text : colors.mutedText,
                    fontSize: typography.size.sm,
                  }}
                  weight={item.isActive ? 'semiBold' : 'regular'}
                >
                  {item.day}
                </Text>
                <Text
                  style={{
                    color: item.isActive ? colors.text : colors.mutedText,
                    fontSize: typography.size.sm,
                  }}
                  weight={item.isActive ? 'semiBold' : 'regular'}
                >
                  {item.value}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
              {hoursFallback}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.sectionNoDivider}>
        <AppointmentDetailsSectionHeader title={t('details_additional_info')} />
        <View style={styles.additionalInfoList}>
          {additionalInfoItems.map((item) => (
            <View key={item.id} style={styles.additionalInfoRow}>
              <Icon
                color={colors.mutedText}
                name={item.icon}
                size={18}
                type={item.iconType ?? 'Ionicons'}
              />
              <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.sectionNoDivider, styles.locationBlock]}>
        <Pressable onPress={onOpenDirections} style={styles.mapCard}>
          <LinearGradient
            colors={['#F4F1FF', '#F7F7F8']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.mapCardGradient}
          >
            <View style={styles.mapRoadHorizontal} />
            <View style={styles.mapRoadVertical} />
            <View style={[styles.mapPin, { backgroundColor: colors.primary }]}>
              <Icon color={colors.surface} name="navigate" size={18} />
            </View>
          </LinearGradient>
        </Pressable>

        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.md,
            lineHeight: typography.lineHeight.md + 2,
          }}
          weight="semiBold"
        >
          {address}
        </Text>

        <Pressable onPress={onOpenDirections}>
          <Text style={{ color: colors.text, fontSize: typography.size.sm }} weight="semiBold">
            {t('details_get_directions')}
          </Text>
        </Pressable>
      </View>

      {isFetchingNextPage ? (
        <View style={styles.footerLoader}>
          <ActivityIndicator color={colors.primary} size="small" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  additionalInfoList: {
    gap: 12,
  },
  additionalInfoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  hoursList: {
    gap: 8,
  },
  hoursRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationBlock: {
    paddingBottom: 8,
  },
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapCardGradient: {
    alignItems: 'center',
    height: 170,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  mapPin: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  mapRoadHorizontal: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 999,
    height: 16,
    left: -20,
    position: 'absolute',
    right: -20,
    top: 80,
    transform: [{ rotate: '-10deg' }],
  },
  mapRoadVertical: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    bottom: -10,
    position: 'absolute',
    right: 90,
    top: -10,
    transform: [{ rotate: '18deg' }],
    width: 18,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewSummary: {
    gap: 8,
  },
  sectionNoDivider: {
    gap: 16,
    paddingTop: 24,
  },
  sections: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionWithDivider: {
    borderTopWidth: 1,
    gap: 16,
    paddingTop: 24,
  },
  secondaryCta: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 18,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

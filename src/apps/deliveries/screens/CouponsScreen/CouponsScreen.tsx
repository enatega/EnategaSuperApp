import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import Button from '../../../../general/components/Button';
import { showToast } from '../../../../general/components/AppToast';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { typography } from '../../../../general/theme/typography';
import type { ApiError } from '../../../../general/api/apiClient';
import { useClaimedCouponsQuery } from '../../hooks/useClaimedCouponsQuery';
import { useClaimCouponMutation } from '../../hooks/useClaimCouponMutation';
import { useUseCouponMutation } from '../../hooks/useUseCouponMutation';
import { useCheckoutCouponStore } from '../../stores/useCheckoutCouponStore';
import { deliveryKeys } from '../../api/queryKeys';
import type { Coupon } from '../../types/coupon';

const CLAIM_SUCCESS_IMAGE =
  'http://localhost:3845/assets/abc5efd0d6b50776e0ef97d3deb08ec78980372a.png';

function toDayMonthYear(dateIso: string) {
  const date = new Date(dateIso);

  if (Number.isNaN(date.getTime())) {
    return dateIso;
  }

  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function CouponsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');
  const [hasClaimSuccessState, setHasClaimSuccessState] = useState(false);
  const setCheckoutCoupon = useCheckoutCouponStore((state) => state.setCoupon);
  const clearCheckoutCoupon = useCheckoutCouponStore((state) => state.clearCoupon);
  const selectedCheckoutCoupon = useCheckoutCouponStore((state) => state.selectedCoupon);
  const claimedCouponsQuery = useClaimedCouponsQuery();
  const claimCouponMutation = useClaimCouponMutation();
  const useCouponMutation = useUseCouponMutation();
  const trimmedCode = code.trim();
  const isClaimDisabled = trimmedCode.length === 0 || claimCouponMutation.isPending;
  const coupons = useMemo<Coupon[]>(
    () => (claimedCouponsQuery.data?.data ?? []).map((item) => ({
      offeredBy: (item.offered_by ?? []).map((store) => ({
        storeId: store.store_id,
        storeImageUrl: store.store_image ?? null,
        storeName: store.store_name,
      })),
      amountLabel:
        item.discount_type === 'PERCENTAGE'
          ? `${item.discount_value}%`
          : `€${item.discount_value}`,
      badgeLabel: item.status.toLowerCase() === 'expired'
        ? t('coupon_status_expired')
        : t('coupon_valid_until', { date: toDayMonthYear(item.end_date) }),
      code: item.code,
      isActive: item.is_active,
      isExpired: item.status.toLowerCase() === 'expired',
      id: item.id,
      minOrderLabel: t('coupon_min_order', { value: item.min_order_value }),
      status: item.status,
      subtitle: item.description,
      title: item.name,
      validUntil: toDayMonthYear(item.end_date),
    })),
    [claimedCouponsQuery.data?.data, t],
  );

  const keyExtractor = useCallback((item: Coupon) => item.id, []);

  const handleClaim = useCallback(async () => {
    if (!trimmedCode) {
      return;
    }

    try {
      const response = await claimCouponMutation.mutateAsync({ code: trimmedCode });
      showToast.success(t('coupon_claim_success_title'), response.message);
      setCode('');
      setHasClaimSuccessState(true);
      await claimedCouponsQuery.refetch();
    } catch (error) {
      const apiError = error as ApiError;
      showToast.error(
        t('coupon_claim_error_title'),
        apiError.message || t('coupon_claim_error_fallback'),
      );
    }
  }, [claimCouponMutation, claimedCouponsQuery, t, trimmedCode]);

  const handleUseCoupon = useCallback(async (coupon: Coupon) => {
    try {
      const nextActiveState = !coupon.isActive;
      await useCouponMutation.mutateAsync({ id: coupon.id, isActive: nextActiveState });

      if (nextActiveState) {
        setCheckoutCoupon({
          id: coupon.id,
          code: coupon.code,
          title: coupon.title,
        });
        showToast.success(
          t('coupon_use_success_title'),
          t('coupon_use_success_message'),
        );
      } else {
        if (selectedCheckoutCoupon?.id === coupon.id) {
          clearCheckoutCoupon();
        }
        showToast.success(
          t('coupon_deactivate_success_title'),
          t('coupon_deactivate_success_message'),
        );
      }

      await claimedCouponsQuery.refetch();
      void queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
      void queryClient.invalidateQueries({ queryKey: [...deliveryKeys.all, 'checkout-preview'] });
    } catch (error) {
      const apiError = error as ApiError;
      showToast.error(
        coupon.isActive ? t('coupon_deactivate_error_title') : t('coupon_use_error_title'),
        apiError.message || (coupon.isActive ? t('coupon_deactivate_error_fallback') : t('coupon_use_error_fallback')),
      );
    }
  }, [
    claimedCouponsQuery,
    clearCheckoutCoupon,
    selectedCheckoutCoupon?.id,
    setCheckoutCoupon,
    t,
    useCouponMutation,
    queryClient,
  ]);

  const renderCoupon = useCallback(({ item }: { item: Coupon }) => (
    <View style={[styles.couponCard, { backgroundColor: colors.gray100 }]}>
      <View style={[styles.valueBlock, { backgroundColor: colors.blue800 }]}>
        <Text
          color={colors.white}
          weight="bold"
          style={styles.valueAmount}
        >
          {item.amountLabel}
        </Text>
        <Text
          color={colors.white}
          weight="bold"
          style={styles.valueOff}
        >
          {t('coupon_off')}
        </Text>
      </View>

      <View style={[styles.separator, { borderColor: colors.border }]} />

      <View style={styles.couponContent}>
        {item.offeredBy.length > 0 ? (
          <View style={styles.storeRow}>
            <View style={styles.storeAvatars}>
              {item.offeredBy.slice(0, 3).map((store, index) => (
                <View
                  key={`${item.id}-${store.storeId}-${index}`}
                  style={[
                    styles.storeAvatarWrap,
                    {
                      borderColor: colors.gray100,
                      marginLeft: index === 0 ? 0 : -10,
                      zIndex: 10 - index,
                    },
                  ]}
                >
                  {store.storeImageUrl ? (
                    <Image source={{ uri: store.storeImageUrl }} style={styles.storeAvatar} />
                  ) : (
                    <View
                      style={[styles.storeAvatarFallback, { backgroundColor: colors.blue100 }]}
                    />
                  )}
                </View>
              ))}
              {item.offeredBy.length > 3 ? (
                <View
                  style={[
                    styles.moreStoresPill,
                    {
                      backgroundColor: colors.blue100,
                      borderColor: colors.gray100,
                      marginLeft: -10,
                    },
                  ]}
                >
                  <Text color={colors.gray700} weight="medium" style={styles.moreStoresText}>
                    +{item.offeredBy.length - 3}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text color={colors.text} weight="medium" numberOfLines={1} style={styles.storeName}>
              {item.offeredBy.map((store) => store.storeName).join(', ')}
            </Text>
          </View>
        ) : null}
        <Text color={colors.text} weight="semiBold" style={styles.couponTitle}>
          {item.title}
        </Text>
        <Text color={colors.mutedText} weight="medium" style={styles.couponSubtitle}>
          {item.subtitle}
        </Text>
        <View style={styles.couponFooter}>
          <View style={styles.minOrderRow}>
            <Ionicons name="bag-handle-outline" size={12} color={colors.iconMuted} />
            <Text color={colors.iconMuted} weight="medium" style={styles.validText}>
              {item.minOrderLabel}
            </Text>
          </View>
          <View
            style={[
              styles.validBadge,
              { backgroundColor: item.isExpired ? colors.red100 : colors.warningSoft },
            ]}
          >
            <Text
              color={item.isExpired ? colors.danger : colors.warningText}
              weight="medium"
              style={styles.validText}
            >
              {item.badgeLabel}
            </Text>
          </View>
        </View>
        <View style={[styles.useButtonWrap, { borderColor: colors.border }]}>
          <Pressable
            accessibilityRole="button"
            disabled={useCouponMutation.isPending || item.isExpired}
            style={({ pressed }) => [
              styles.useButton,
              {
                backgroundColor: 'transparent',
                opacity: pressed ? 0.85 : item.isExpired ? 0.5 : 1,
              },
            ]}
            onPress={() => {
              void handleUseCoupon(item);
            }}
          >
            <Text color={colors.blue800} weight="semiBold" style={styles.useButtonText}>
              {item.isActive ? t('coupon_deactivate') : t('coupon_use')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  ), [colors, handleUseCoupon, t, useCouponMutation.isPending]);

  const renderEmptyCouponsState = useCallback(() => {
    if (claimedCouponsQuery.isPending || claimedCouponsQuery.isError) {
      return null;
    }

    return (
      <View style={styles.emptyStateContainer}>
        <View style={[styles.emptyIllustrationWrap, { backgroundColor: colors.blue50 }]}>
          <Ionicons color={colors.blue800} name="ticket-outline" size={44} />
          <View style={[styles.emptyIllustrationBadge, { backgroundColor: colors.warningSoft }]}>
            <Text color={colors.warningText} weight="medium" style={styles.emptyIllustrationBadgeText}>
              6%
            </Text>
          </View>
        </View>
        <Text color={colors.text} weight="semiBold" style={styles.emptyTitle}>
          {t('coupon_empty_title')}
        </Text>
        <Text color={colors.mutedText} style={styles.emptyDescription}>
          {t('coupon_empty_description')}
        </Text>
      </View>
    );
  }, [claimedCouponsQuery.isError, claimedCouponsQuery.isPending, colors.blue50, colors.blue800, colors.mutedText, colors.text, colors.warningSoft, colors.warningText, t]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t('coupon_title')}
        onBack={hasClaimSuccessState ? () => setHasClaimSuccessState(false) : undefined}
      />
      {hasClaimSuccessState ? (
        <View style={styles.successStateContainer}>
          <Image source={{ uri: CLAIM_SUCCESS_IMAGE }} style={styles.successStateImage} />
          <Text color={colors.text} weight="extraBold" style={styles.successStateTitle}>
            {t('coupon_claimed_state_title')}
          </Text>
          <Text color={colors.text} weight="medium" style={styles.successStateBody}>
            {t('coupon_claimed_state_body_line_one')}
          </Text>
          <Text color={colors.text} weight="medium" style={styles.successStateBody}>
            {t('coupon_claimed_state_body_line_two')}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={coupons}
            keyExtractor={keyExtractor}
            renderItem={renderCoupon}
            ListEmptyComponent={renderEmptyCouponsState}
            refreshing={claimedCouponsQuery.isRefetching}
            onRefresh={() => {
              void claimedCouponsQuery.refetch();
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={(
              <View style={styles.headerContent}>
                <Text color={colors.mutedText} style={styles.description}>
                  {t('coupon_description')}
                </Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder={t('coupon_input_placeholder')}
                  placeholderTextColor={colors.mutedText}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                />
                {claimedCouponsQuery.isError ? (
                  <Text color={colors.dangerText} style={styles.errorText}>
                    {claimedCouponsQuery.error.message || t('coupon_list_error_fallback')}
                  </Text>
                ) : null}
              </View>
            )}
          />
          <View style={[styles.bottomBar, { backgroundColor: colors.background }]}>
            <Button
              label={t('coupon_claim')}
              style={styles.submitButton}
              disabled={isClaimDisabled}
              isLoading={claimCouponMutation.isPending}
              onPress={() => {
                void handleClaim();
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    gap: 14,
    paddingBottom: 16,
  },
  couponCard: {
    borderRadius: 12,
    flexDirection: 'row',
    marginHorizontal: 16,
    minHeight: 186,
    overflow: 'hidden',
  },
  couponContent: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  couponFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  couponSubtitle: {
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
  },
  couponTitle: {
    fontSize: typography.size.md2,
    lineHeight: typography.lineHeight.md2,
  },
  description: {
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
  },
  emptyDescription: {
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
    maxWidth: 270,
    textAlign: 'center',
  },
  emptyIllustrationBadge: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
    right: -4,
    top: -6,
  },
  emptyIllustrationBadgeText: {
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
  },
  emptyIllustrationWrap: {
    alignItems: 'center',
    borderRadius: 500,
    height: 112,
    justifyContent: 'center',
    marginBottom: 4,
    width: 112,
  },
  emptyStateContainer: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 110,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: typography.size.md2,
    lineHeight: typography.lineHeight.md2,
    textAlign: 'center',
  },
  headerContent: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    fontSize: typography.size.md2,
    lineHeight: typography.lineHeight.md2,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  separator: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  submitButton: {
    borderRadius: 6,
    height: 44,
  },
  successStateBody: {
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
    textAlign: 'center',
    width: 318,
  },
  successStateContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 44,
  },
  successStateImage: {
    height: 150,
    width: 150,
  },
  successStateTitle: {
    fontSize: typography.size.h5,
    lineHeight: 38,
    textAlign: 'center',
  },
  useButton: {
    alignItems: 'center',
    borderRadius: 24,
    justifyContent: 'center',
    minHeight: 34,
    width: '100%',
  },
  useButtonText: {
    fontSize: typography.size.sm2,
    lineHeight: 20,
  },
  useButtonWrap: {
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 2,
    overflow: 'hidden',
  },
  validBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  validText: {
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
  valueAmount: {
    fontSize: typography.size.xl2,
    lineHeight: typography.lineHeight.xl2,
  },
  valueBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  valueOff: {
    fontSize: typography.size.xl2,
    lineHeight: typography.lineHeight.xl2,
  },
  minOrderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  storeAvatar: {
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  storeAvatarFallback: {
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  storeAvatarWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
  },
  storeAvatars: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  moreStoresPill: {
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 1.5,
    height: 28,
    justifyContent: 'center',
    minWidth: 28,
    paddingHorizontal: 6,
  },
  moreStoresText: {
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.sm,
  },
  storeName: {
    flex: 1,
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
  },
  storeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});

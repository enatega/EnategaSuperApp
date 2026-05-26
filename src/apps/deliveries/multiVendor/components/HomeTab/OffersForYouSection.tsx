import React, { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../../../../general/components/AppToast';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { ApiError } from '../../../../../general/api/apiClient';
import { useDeliveriesCurrencyLabel } from '../../../../../general/stores/useAppConfigStore';
import { deliveryKeys } from '../../../api/queryKeys';
import { claimedCouponsKeys, useClaimedCouponsQuery } from '../../../hooks/useClaimedCouponsQuery';
import { useClaimCouponMutation } from '../../../hooks/useClaimCouponMutation';
import { useUseCouponMutation } from '../../../hooks/useUseCouponMutation';
import { useCheckoutCouponStore } from '../../../stores/useCheckoutCouponStore';
import { useOffersForYou } from '../../../hooks';
import type { DeliveryOfferForYouItem } from '../../../api/types';
import type { DeliveriesStackParamList } from '../../../navigation/types';

type NavigationProp = NativeStackNavigationProp<DeliveriesStackParamList>;

type OfferCardTheme = {
  backgroundColor: string;
  borderColor: string;
  buttonColor: string;
};

function normalizeOffer(
  item: DeliveryOfferForYouItem,
  defaultTitle: string,
  percentageOffTemplate: string,
  fixedOffTemplate: string,
  applyNowLabel: string,
  shopNowLabel: string,
  currencyLabel: string,
) {
  const normalizedDiscountType = item.discountType?.trim().toLowerCase();
  const discountValue =
    typeof item.discountValue === 'number' && Number.isFinite(item.discountValue)
      ? item.discountValue
      : undefined;

  const generatedDiscountTitle =
    discountValue && normalizedDiscountType === 'percentage'
      ? percentageOffTemplate.replace('{{value}}', String(discountValue))
      : discountValue
        ? fixedOffTemplate
            .replace('{{currency}}', currencyLabel)
            .replace('{{value}}', String(discountValue))
        : undefined;

  const resolvedTitle = generatedDiscountTitle ||
    (typeof item.offerLabel === 'string' && item.offerLabel.trim()) ||
    (typeof item.title === 'string' && item.title.trim()) ||
    defaultTitle;

  const fallbackSubtitle =
    (typeof item.offerSubLabel === 'string' && item.offerSubLabel.trim()) ||
    (typeof item.subtitle === 'string' && item.subtitle.trim()) ||
    (typeof item.description === 'string' && item.description.trim()) ||
    '';

  const codeText = typeof item.code === 'string' && item.code.trim().length > 0 ? item.code.trim() : undefined;

  const actionLabel =
    (typeof item.actionLabel === 'string' && item.actionLabel.trim()) ||
    (item.offerType?.toLowerCase() === 'coupon' || codeText ? applyNowLabel : shopNowLabel);

  return {
    id: item.id,
    title: resolvedTitle,
    subtitle: fallbackSubtitle,
    code: codeText,
    discountType: item.discountType ?? undefined,
    discountValue: item.discountValue ?? undefined,
    minOrderValue: item.minOrderValue ?? undefined,
    maxDiscountCap: item.maxDiscountCap ?? undefined,
    offerType: item.offerType ?? undefined,
    actionType: item.actionType ?? undefined,
    actionTargetId: item.actionTargetId ?? undefined,
    storeId: item.storeId ?? undefined,
    storeName: item.storeName ?? undefined,
    productId: item.productId ?? undefined,
    couponId: item.couponId ?? undefined,
    actionLabel,
    image:
      (typeof item.imageUrl === 'string' && item.imageUrl.trim()) ||
      (typeof item.image === 'string' && item.image.trim()) ||
      undefined,
  };
}

export default function OffersForYouSection() {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
  const { colors, typography } = useTheme();
  const queryClient = useQueryClient();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const setCheckoutCoupon = useCheckoutCouponStore((state) => state.setCoupon);
  const claimCouponMutation = useClaimCouponMutation();
  const useCouponMutation = useUseCouponMutation();
  const claimedCouponsQuery = useClaimedCouponsQuery(0, 50);
  const { data: offersData = [] } = useOffersForYou();

  const offerCardThemes = useMemo<OfferCardTheme[]>(
    () => [
      {
        backgroundColor: colors.cardMint,
        borderColor: colors.success,
        buttonColor: colors.success,
      },
      {
        backgroundColor: colors.blue100,
        borderColor: colors.blue500,
        buttonColor: colors.primary,
      },
      {
        backgroundColor: colors.cardPeach,
        borderColor: colors.warning,
        buttonColor: colors.warning,
      },
      {
        backgroundColor: colors.cardLavender,
        borderColor: colors.secondary,
        buttonColor: colors.secondary,
      },
    ],
    [colors.blue100, colors.blue500, colors.cardLavender, colors.cardMint, colors.cardPeach, colors.primary, colors.secondary, colors.success, colors.warning],
  );

  const offers = useMemo(
    () =>
      offersData.map((item) =>
        normalizeOffer(
          item,
          t('multi_vendor_offer_default_title'),
          t('multi_vendor_offer_percentage_off'),
          t('multi_vendor_offer_fixed_off'),
          t('multi_vendor_offer_apply_now'),
          t('multi_vendor_offer_shop_now'),
          currencyLabel,
        ),
      ),
    [currencyLabel, offersData, t],
  );
  const homeOffers = useMemo(() => offers.slice(0, 3), [offers]);

  if (homeOffers.length === 0) {
    return null;
  }

  const handleOfferAction = async (offer: (typeof offers)[number]) => {
    const normalizedActionType = offer.actionType
      ?.trim()
      .toLowerCase()
      .replace(/-/g, '_');
    const isCouponAction =
      normalizedActionType === 'claim_coupon' ||
      offer.offerType?.toLowerCase() === 'coupon' ||
      Boolean(offer.code) ||
      Boolean(offer.couponId);
    console.log('[deliveries][offers-for-you] action-pressed', {
      offerId: offer.id,
      actionType: offer.actionType,
      normalizedActionType,
      isCouponAction,
      actionTargetId: offer.actionTargetId,
      code: offer.code,
      couponId: offer.couponId,
      storeId: offer.storeId,
      productId: offer.productId,
    });

    if (normalizedActionType === 'open_product' && offer.productId) {
      navigation.navigate('ProductInfo', { productId: offer.productId });
      return;
    }

    if (normalizedActionType === 'open_store' && offer.storeId) {
      const storePayload = {
        storeId: offer.storeId,
        vendorId: '',
        name: offer.storeName ?? '',
      };

      if (navigation.getState().routeNames.includes('StoreDetails')) {
        navigation.navigate('StoreDetails' as never, { store: storePayload } as never);
      } else {
        navigation.navigate('MultiVendor' as never, {
          screen: 'StoreDetails',
          params: { store: storePayload },
        } as never);
      }
      return;
    }

    if (isCouponAction) {
      try {
        console.log('[deliveries][offers-for-you] claim-coupon-start', {
          offerId: offer.id,
          code: offer.code,
          couponId: offer.couponId,
          actionTargetId: offer.actionTargetId,
        });
        if (offer.code) {
          try {
            console.log('[deliveries][offers-for-you] claim-coupon-request', {
              code: offer.code,
            });
            await claimCouponMutation.mutateAsync({ code: offer.code });
            console.log('[deliveries][offers-for-you] claim-coupon-success', {
              code: offer.code,
            });
          } catch (claimError) {
            const apiClaimError = claimError as ApiError;
            const claimMessage = apiClaimError?.message?.toLowerCase() ?? '';
            const isAlreadyClaimed = claimMessage.includes('already claimed');

            console.log('[deliveries][offers-for-you] claim-coupon-non-fatal-error', {
              code: offer.code,
              errorMessage: apiClaimError?.message,
              isAlreadyClaimed,
            });

            if (!isAlreadyClaimed) {
              throw claimError;
            }
          }
        }

        const refreshed = await claimedCouponsQuery.refetch();
        console.log('[deliveries][offers-for-you] claimed-coupons-refetched', {
          total: refreshed.data?.total ?? 0,
          count: refreshed.data?.data?.length ?? 0,
        });
        const matchedCoupon = refreshed.data?.data.find(
          (coupon) =>
            (offer.couponId && coupon.id === offer.couponId) ||
            (offer.code && coupon.code.toLowerCase() === offer.code.toLowerCase()),
        );
        console.log('[deliveries][offers-for-you] matched-coupon', {
          matchedCouponId: matchedCoupon?.id,
          matchedCouponCode: matchedCoupon?.code,
          matchedCouponActive: matchedCoupon?.is_active,
        });

        const couponId = offer.couponId ?? offer.actionTargetId ?? matchedCoupon?.id;
        console.log('[deliveries][offers-for-you] resolved-coupon-id', {
          couponId,
          offerCouponId: offer.couponId,
          actionTargetId: offer.actionTargetId,
          matchedCouponId: matchedCoupon?.id,
        });

        if (!couponId) {
          throw new Error(t('coupon_use_error_fallback'));
        }

        const checkoutCouponPayload = {
          id: couponId,
          code: offer.code ?? matchedCoupon?.code ?? '',
          title: offer.subtitle || offer.title,
          discountType: offer.discountType ?? matchedCoupon?.discount_type,
          discountValue: offer.discountValue ?? matchedCoupon?.discount_value,
          maxDiscountCap: offer.maxDiscountCap ?? matchedCoupon?.max_discount_cap,
          minOrderValue: offer.minOrderValue ?? matchedCoupon?.min_order_value,
        };

        console.log('[deliveries][offers-for-you] activate-coupon-request', {
          couponId,
        });
        try {
          await useCouponMutation.mutateAsync({ id: couponId, isActive: true });
          console.log('[deliveries][offers-for-you] activate-coupon-success', {
            couponId,
          });
          setCheckoutCoupon(checkoutCouponPayload);
          console.log('[deliveries][offers-for-you] checkout-coupon-updated', {
            couponId,
            code: checkoutCouponPayload.code,
            mode: 'activated',
          });
        } catch (activateError) {
          const apiActivateError = activateError as ApiError;
          const activateMessage = apiActivateError?.message?.toLowerCase() ?? '';
          const isMinimumOrderValidation = activateMessage.includes('minimum order value');

          console.log('[deliveries][offers-for-you] activate-coupon-error', {
            couponId,
            errorMessage: apiActivateError?.message,
            isMinimumOrderValidation,
          });

          if (!isMinimumOrderValidation) {
            throw activateError;
          }

          setCheckoutCoupon(checkoutCouponPayload);
          console.log('[deliveries][offers-for-you] checkout-coupon-updated', {
            couponId,
            code: checkoutCouponPayload.code,
            mode: 'pending-checkout-validation',
          });
          showToast.success(
            t('coupon_use_success_title'),
            t('coupon_use_pending_checkout_message'),
          );
          void queryClient.invalidateQueries({ queryKey: claimedCouponsKeys.all });
          void queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
          return;
        }

        showToast.success(
          t('coupon_use_success_title'),
          t('coupon_use_success_message'),
        );
        void queryClient.invalidateQueries({ queryKey: claimedCouponsKeys.all });
        void queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
      } catch (error) {
        const apiError = error as ApiError;
        console.log('[deliveries][offers-for-you] claim-coupon-error', {
          offerId: offer.id,
          errorMessage: apiError?.message,
          rawError: error,
        });
        showToast.error(
          t('coupon_use_error_title'),
          apiError.message || t('coupon_use_error_fallback'),
        );
      }
      return;
    }

    navigation.navigate('DealsSeeAll');
  };

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_offers_for_you_title')}
        onActionPress={() => navigation.navigate('DealsSeeAll')}
      />

      <HorizontalList
        data={homeOffers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => {
          const palette = offerCardThemes[index % offerCardThemes.length];

          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: palette.backgroundColor,
                  borderColor: palette.borderColor,
                },
              ]}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}

              <Text
                weight="extraBold"
                numberOfLines={1}
                style={{
                  color: colors.text,
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md,
                  textAlign: 'center',
                }}
              >
                {item.title}
              </Text>

              {item.code ? (
                <View style={[styles.codePill, { backgroundColor: colors.text }]}> 
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.white,
                      fontSize: typography.size.xxs,
                      lineHeight: typography.lineHeight.xxs,
                    }}
                  >
                    {t('multi_vendor_offer_use_code', { code: item.code })}
                  </Text>
                </View>
              ) : (
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.text,
                    fontSize: typography.size.sm,
                    lineHeight: typography.lineHeight.sm,
                    opacity: 0.9,
                  }}
                >
                  {item.subtitle}
                </Text>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.button, { backgroundColor: palette.buttonColor }]}
                disabled={claimCouponMutation.isPending || useCouponMutation.isPending}
                onPress={() => {
                  void handleOfferAction(item);
                }}
              >
                <Text
                  weight="semiBold"
                  style={{
                    color: colors.white,
                    fontSize: typography.size.sm,
                    lineHeight: typography.lineHeight.sm,
                  }}
                >
                  {item.actionLabel}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
  card: {
    borderRadius: 26,
    borderWidth: 2,
    minHeight: 190,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: 170,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    height: 56,
    width: 56,
  },
  imagePlaceholder: {
    height: 56,
    width: 56,
  },
  codePill: {
    borderRadius: 8,
    maxWidth: '100%',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  button: {
    borderRadius: 10,
    minHeight: 36,
    minWidth: 100,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

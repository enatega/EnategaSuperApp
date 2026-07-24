import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { extractApiErrorMessage } from "../../../general/api/apiClient";
import AppPopup from "../../../general/components/AppPopup";
import { showToast } from "../../../general/components/AppToast";
import Icon from "../../../general/components/Icon";
import ScreenHeader from "../../../general/components/ScreenHeader";
import Text from "../../../general/components/Text";
import { useTheme } from "../../../general/theme/theme";
import type { AppointmentBookingConfirmRequest } from "../api/types";
import { appointmentBookingService } from "../api/appointmentBookingService";
import AppointmentBookingFooter from "../components/booking/AppointmentBookingFooter";
import AppointmentBookingLineItem from "../components/booking/AppointmentBookingLineItem";
import AppointmentBookingStoreSummary from "../components/booking/AppointmentBookingStoreSummary";
import { formatPrice } from "../components/details/detailHelpers";
import { useAppointmentCart } from "../hooks/useAppointmentCart";
import {
  useAppointmentConfirmMutation,
  useAppointmentReviewMutation,
} from "../hooks/useAppointmentBookingMutations";
import type { AppointmentBookingFlowParamList } from "../navigation/bookingFlowTypes";
import type { AppointmentsStackParamList } from "../navigation/types";
import { useAppointmentCouponStore } from "../stores/useAppointmentCouponStore";
import {
  formatAppointmentScheduledDate,
  formatAppointmentTimeRange,
} from "../utils/appointmentBooking";

type ReviewRouteProp = RouteProp<AppointmentBookingFlowParamList, "ReviewConfirm">;
type NavigationProp = NativeStackNavigationProp<AppointmentBookingFlowParamList>;
const SLOT_UNAVAILABLE_MESSAGE =
  "No eligible professional is available for the selected slot";
const SLOT_HOLD_EXPIRED_MESSAGE =
  "The selected slot hold has expired. Please select the time again";

export default function AppointmentReviewConfirmScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReviewRouteProp>();
  const confirmMutation = useAppointmentConfirmMutation();
  const reviewMutation = useAppointmentReviewMutation();
  const selectedCoupon = useAppointmentCouponStore(
    (state) => state.selectedCoupon,
  );
  const clearCoupon = useAppointmentCouponStore((state) => state.clearCoupon);
  const { clearCart, replaceItems, setReviewDraft, setStoreContext } =
    useAppointmentCart();
  const [isPolicyPopupVisible, setIsPolicyPopupVisible] = useState(false);
  const [customerNote, setCustomerNote] = useState(
    route.params.review.customerNote ?? "",
  );
  const [review, setReview] = useState(route.params.review);

  const scheduledDateLabel = useMemo(
    () => formatAppointmentScheduledDate(route.params.scheduledAt),
    [route.params.scheduledAt],
  );
  const scheduledTimeLabel = useMemo(
    () =>
      formatAppointmentTimeRange({
        startAt: route.params.scheduledAt,
        durationMinutes: review.appointment.durationMinutes,
      }),
    [review.appointment.durationMinutes, route.params.scheduledAt],
  );
  const totalLabel = formatPrice(review.totals.total) ?? "$0";
  const reviewLabel = t("details_reviews_count", {
    count: review.store.reviewCount,
  });
  const canConfirm = review.payment.codAllowed || review.payment.stripeAllowed;
  const paymentLabel = review.payment.codAllowed
    ? t("review_confirm_payment_cash")
    : t("review_confirm_payment_stripe");
  const workerLabel =
    review.worker?.name?.trim() || t("review_confirm_any_professional");
  const workerMetaLabel =
    review.worker?.profession?.trim() || t("team_any_professional_subtitle");
  const totalSubtitle = t("review_confirm_total_subtitle");
  const countLabel =
    review.totals.serviceCount === 1
      ? t("services_selected_count_one", { count: review.totals.serviceCount })
      : t("services_selected_count_other", {
          count: review.totals.serviceCount,
        });

  useEffect(() => {
    setStoreContext({
      storeId: route.params.storeId,
      title: route.params.title,
    });

    replaceItems(
      review.items.map((item) => ({
        id: item.serviceId,
        name: item.name,
        price: item.price,
        estimatedDurationMinutes: item.durationMinutes,
        durationLabel: item.durationLabel,
      })),
    );
    setReviewDraft({
      review,
      scheduledAt: route.params.scheduledAt,
      selections: route.params.selections,
      storeId: route.params.storeId,
      title: route.params.title,
      team: route.params.team,
      selectedServices: route.params.selectedServices,
      workerId: route.params.workerId,
      workerMode: route.params.workerMode,
    });
  }, [
    replaceItems,
    review.items,
    review,
    route.params.scheduledAt,
    route.params.selections,
    route.params.selectedServices,
    route.params.storeId,
    route.params.team,
    route.params.title,
    route.params.workerId,
    route.params.workerMode,
    setReviewDraft,
    setStoreContext,
  ]);

  useEffect(
    () => () => {
      void appointmentBookingService.releaseHold(review.hold.token);
    },
    [review.hold.token],
  );

  useEffect(() => {
    const selectedCode = selectedCoupon?.code;
    const appliedCode = review.coupon?.code;

    if (selectedCode === appliedCode) {
      return;
    }

    let isCurrent = true;

    void reviewMutation
      .mutateAsync({
        couponCode: selectedCode,
        scheduledAt: route.params.scheduledAt,
        selections: route.params.selections,
        storeId: route.params.storeId,
        workerId: route.params.workerId,
        workerMode: route.params.workerMode,
      })
      .then((nextReview) => {
        if (isCurrent) {
          setReview(nextReview);
        }
      })
      .catch((error) => {
        if (!isCurrent) {
          return;
        }

        showToast.error(
          t("coupons_error_title"),
          extractApiErrorMessage(error) ?? t("coupons_error_body"),
        );
        clearCoupon();
      });

    return () => {
      isCurrent = false;
    };
  }, [
    review.coupon?.code,
    reviewMutation.mutateAsync,
    clearCoupon,
    route.params.scheduledAt,
    route.params.selections,
    route.params.storeId,
    route.params.workerId,
    route.params.workerMode,
    selectedCoupon?.code,
    t,
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOpenConfirm = () => {
    if (reviewMutation.isPending) {
      return;
    }

    if (!canConfirm) {
      showToast.error(
        t("review_confirm_payment_missing_title"),
        t("review_confirm_payment_missing_body"),
      );
      return;
    }

    setIsPolicyPopupVisible(true);
  };

  const handleConfirmBooking = async () => {
    const payload: AppointmentBookingConfirmRequest = {
      customerNote: customerNote.trim() || undefined,
      couponCode: selectedCoupon?.code,
      holdToken: review.hold.token,
      paymentMethod: review.payment.codAllowed ? "cod" : "stripe",
      scheduledAt: route.params.scheduledAt,
      selections: route.params.selections,
      storeId: route.params.storeId,
      workerId: route.params.workerId,
      workerMode: route.params.workerMode,
    };

    try {
      const response = await confirmMutation.mutateAsync(payload);
      clearCart();
      clearCoupon();
      setIsPolicyPopupVisible(false);
      navigation.replace("BookingSuccess", {
        orderId: response.orderId,
        storeName: review.store.name,
      });
    } catch (error) {
      const errorMessage =
        extractApiErrorMessage(error) ??
        t("review_confirm_place_order_error_body");

      if (
        errorMessage === SLOT_UNAVAILABLE_MESSAGE ||
        errorMessage === SLOT_HOLD_EXPIRED_MESSAGE
      ) {
        setIsPolicyPopupVisible(false);
        navigation.replace("Team", {
          storeId: route.params.storeId,
          title: route.params.title,
          team: route.params.team,
          selectedServices: route.params.selectedServices,
          retrySelection: {
            mode: route.params.workerMode,
            workerId: route.params.workerId,
          },
          retryErrorMessage: t("team_schedule_unavailable_body"),
        });
        return;
      }

      showToast.error(
        t("review_confirm_place_order_error_title"),
        errorMessage,
      );
    }
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScreenHeader
        onBack={handleBack}
        showBack
        title={t("review_confirm_title")}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppointmentBookingStoreSummary
          address={review.store.address}
          image={review.store.image}
          reviewLabel={reviewLabel}
          title={review.store.name}
        />

        <View style={styles.scheduleSection}>
          <View style={styles.metaRow}>
            <Icon color={colors.mutedText} name="calendar-outline" size={22} />
            <Text
              style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}
            >
              {scheduledDateLabel}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Icon color={colors.mutedText} name="time-outline" size={22} />
            <Text
              style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}
            >
              {`${scheduledTimeLabel} (${review.appointment.durationLabel})`}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="extraBold"
          >
            {workerLabel}
          </Text>
          {review.items.map((item) => (
            <AppointmentBookingLineItem
              key={item.serviceId}
              dealLabel={item.deal?.name}
              durationLabel={item.durationLabel}
              metaLabel={
                item.selectedOptions.length > 0
                  ? item.selectedOptions
                      .map((option) => option.optionName)
                      .join(", ")
                  : workerMetaLabel
              }
              originalPriceLabel={
                item.discountedPrice !== null
                  ? formatPrice(item.originalPrice)
                  : null
              }
              priceLabel={formatPrice(item.price) ?? "$0"}
              title={item.name}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="extraBold"
          >
            {t("review_confirm_payment_title")}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleOpenConfirm}
            style={[styles.preferenceRow, { borderColor: colors.border }]}
          >
            <View style={styles.preferenceIconWrap}>
              <Icon color={colors.success} name="cash-outline" size={24} />
            </View>
            <View style={styles.preferenceCopy}>
              <Text
                style={{ color: colors.text, fontSize: typography.size.lg }}
                weight="medium"
              >
                {paymentLabel}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                }}
              >
                {t("review_confirm_payment_change_hint")}
              </Text>
            </View>
            <Icon color={colors.text} name="chevron-forward" size={22} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={reviewMutation.isPending}
            onPress={() => {
              navigation
                .getParent<
                  NativeStackNavigationProp<AppointmentsStackParamList>
                >()
                ?.navigate("AppointmentCoupons");
            }}
            style={[styles.preferenceRow, { borderColor: colors.border }]}
          >
            <View style={styles.preferenceIconWrap}>
              <Icon color={colors.text} name="ticket-outline" size={22} />
            </View>
            <View style={styles.preferenceCopy}>
              <Text
                style={{ color: colors.text, fontSize: typography.size.lg }}
                weight="medium"
              >
                {t("review_confirm_discount_title")}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                }}
              >
                {reviewMutation.isPending
                  ? t("review_confirm_discount_refreshing")
                  : review.coupon
                    ? t("review_confirm_discount_applied", {
                        code: review.coupon.code,
                        value:
                          formatPrice(review.coupon.discountAmount) ?? "$0",
                      })
                    : selectedCoupon
                      ? t("review_confirm_discount_selected", {
                          code: selectedCoupon.code,
                        })
                      : t("review_confirm_discount_hint")}
              </Text>
            </View>
            <Icon color={colors.text} name="chevron-forward" size={24} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="extraBold"
          >
            {t("review_confirm_notes_title")}
            <Text
              style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}
            >
              {`  ${t("review_confirm_notes_optional")}`}
            </Text>
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TextInput
              multiline
              onChangeText={setCustomerNote}
              placeholder={t("review_confirm_notes_placeholder")}
              placeholderTextColor={colors.mutedText}
              style={[
                styles.notesInput,
                {
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.xl2,
                },
              ]}
              value={customerNote}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="extraBold"
          >
            {t("review_confirm_cancellation_title")}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
            }}
          >
            {review.cancellationPolicy}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="extraBold"
          >
            {t("review_confirm_total_title")}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
            }}
          >
            {totalSubtitle}
          </Text>
          <View style={styles.totalsList}>
            {review.items.map((item) => (
              <View key={`${item.serviceId}-total`} style={styles.totalRow}>
                <Text
                  style={{
                    color: colors.mutedText,
                    flex: 1,
                    fontSize: typography.size.md2,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: colors.mutedText,
                    fontSize: typography.size.md2,
                  }}
                >
                  {formatPrice(item.price) ?? "$0"}
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text
                style={{
                  color: colors.mutedText,
                  flex: 1,
                  fontSize: typography.size.md2,
                }}
              >
                {t("review_confirm_discount_title")}
              </Text>
              <Text
                style={{ color: colors.primary, fontSize: typography.size.md2 }}
              >
                {review.totals.discount > 0
                  ? `-${formatPrice(review.totals.discount) ?? "$0"}`
                  : "$0"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <AppointmentBookingFooter
        buttonLabel={t("review_confirm_footer_cta")}
        buttonStyle={{ borderRadius: 14 }}
        countLabel={countLabel}
        disabled={!canConfirm || reviewMutation.isPending}
        durationLabel={review.totals.durationLabel}
        insets={insets}
        isLoading={confirmMutation.isPending || reviewMutation.isPending}
        onPress={handleOpenConfirm}
        subtitleLabel={totalSubtitle}
        totalLabel={totalLabel}
      />

      <AppPopup
        description={review.cancellationPolicy}
        onRequestClose={() => setIsPolicyPopupVisible(false)}
        primaryAction={{
          disabled: confirmMutation.isPending,
          isLoading: confirmMutation.isPending,
          label: t("review_confirm_popup_accept"),
          onPress: () => {
            void handleConfirmBooking();
          },
        }}
        secondaryAction={{
          disabled: confirmMutation.isPending,
          label: t("details_close"),
          onPress: () => setIsPolicyPopupVisible(false),
          variant: "secondary",
        }}
        title={t("review_confirm_popup_title")}
        visible={isPolicyPopupVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
  },
  content: {
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  notesInput: {
    minHeight: 48,
    padding: 0,
    textAlignVertical: "top",
  },
  preferenceCopy: {
    flex: 1,
    gap: 2,
  },
  preferenceIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
  },
  preferenceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    paddingVertical: 6,
  },
  screen: {
    flex: 1,
  },
  scheduleSection: {
    gap: 12,
  },
  section: {
    gap: 10,
  },
  totalRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  totalsList: {
    gap: 10,
  },
});

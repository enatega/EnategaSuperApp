import React, { useState } from "react";
import * as Calendar from "expo-calendar";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Image from "../../../general/components/Image";
import Icon from "../../../general/components/Icon";
import Text from "../../../general/components/Text";
import { useTheme } from "../../../general/theme/theme";
import { extractApiErrorMessage } from "../../../general/api/apiClient";
import { showToast } from "../../../general/components/AppToast";
import { formatPrice } from "../components/details/detailHelpers";
import AppointmentAvailabilityBottomSheet from "../components/team/AppointmentAvailabilityBottomSheet";
import AppointmentRatingBottomSheet from "../components/details/AppointmentRatingBottomSheet";
import type { AppointmentBookingAvailabilitySlot } from "../api/types";
import { useScheduledAppointmentBookingDetail } from "../hooks/useAppointmentBookings";
import {
  useAppointmentAvailabilityMutation,
  useAppointmentCancelMutation,
  useAppointmentRatingMutation,
  useAppointmentRescheduleMutation,
} from "../hooks/useAppointmentBookingMutations";
import type { MultiVendorStackParamList } from "../multiVendor/navigation/types";

const FALLBACK_IMAGE = require("../../../general/assets/images/400x400.png");

type DetailRoute = RouteProp<
  MultiVendorStackParamList,
  "AppointmentBookingDetail"
>;
type DetailNavigation = NativeStackNavigationProp<MultiVendorStackParamList>;

function formatSchedule(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(minutes: number) {
  const normalized = Math.max(0, Math.round(minutes));
  const hours = Math.floor(normalized / 60);
  const remainder = normalized % 60;

  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type ActionRowProps = {
  disabled?: boolean;
  icon: string;
  onPress: () => void;
  subtitle: string;
  title: string;
  tone?: "default" | "danger";
};

function ActionRow({
  disabled = false,
  icon,
  onPress,
  subtitle,
  title,
  tone = "default",
}: ActionRowProps) {
  const { colors, typography } = useTheme();
  const isDanger = tone === "danger";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.actionRow,
        { borderBottomColor: colors.border, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor: isDanger ? colors.dangerSoft : colors.warningSoft,
          },
        ]}
      >
        <Icon
          color={isDanger ? colors.danger : colors.warning}
          name={icon}
          size={25}
        />
      </View>
      <View style={styles.actionCopy}>
        <Text
          style={{
            color: isDanger ? colors.danger : colors.text,
            fontSize: typography.size.md2,
          }}
          weight="semiBold"
        >
          {title}
        </Text>
        <Text
          style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}
        >
          {subtitle}
        </Text>
      </View>
      <Icon color={colors.mutedText} name="chevron-forward" size={20} />
    </Pressable>
  );
}

export default function AppointmentBookingDetailScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DetailNavigation>();
  const route = useRoute<DetailRoute>();
  const detailQuery = useScheduledAppointmentBookingDetail(
    route.params.orderId,
  );
  const booking = detailQuery.data;
  const availabilityMutation = useAppointmentAvailabilityMutation();
  const cancelMutation = useAppointmentCancelMutation();
  const rescheduleMutation = useAppointmentRescheduleMutation();
  const ratingMutation = useAppointmentRatingMutation();
  const [isRescheduleVisible, setIsRescheduleVisible] = useState(false);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(() => new Date());
  const [availableSlots, setAvailableSlots] = useState<
    AppointmentBookingAvailabilitySlot[]
  >([]);

  const loadRescheduleAvailability = async (date: Date) => {
    if (!booking) return;

    setRescheduleDate(date);
    setAvailableSlots([]);
    try {
      const result = await availabilityMutation.mutateAsync({
        storeId: booking.storeId,
        date: date.toISOString(),
        selections: booking.selections,
        excludeOrderId: route.params.orderId,
      });
      setAvailableSlots(Array.isArray(result.slots) ? result.slots : []);
    } catch (error) {
      showToast.error(
        t("team_schedule_error_title"),
        extractApiErrorMessage(error) ?? t("team_schedule_error_body"),
      );
    }
  };

  const openReschedule = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    setIsRescheduleVisible(true);
    void loadRescheduleAvailability(date);
  };

  const confirmReschedule = async (
    slot: AppointmentBookingAvailabilitySlot,
  ) => {
    try {
      await rescheduleMutation.mutateAsync({
        orderId: route.params.orderId,
        scheduledAt: slot.startAt,
      });
      setIsRescheduleVisible(false);
      setAvailableSlots([]);
      await detailQuery.refetch();
      showToast.success(
        t("booking_detail_reschedule_success_title"),
        t("booking_detail_reschedule_success_body"),
      );
    } catch (error) {
      showToast.error(
        t("booking_detail_reschedule_error_title"),
        extractApiErrorMessage(error) ??
        t("booking_detail_reschedule_error_body"),
      );
      await loadRescheduleAvailability(rescheduleDate);
    }
  };

  const addToCalendar = async () => {
    if (!booking) return;

    try {
      const permission = await Calendar.requestCalendarPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          t("booking_detail_calendar_permission_title"),
          t("booking_detail_calendar_permission_body"),
        );
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT,
      );
      const writableCalendar = calendars.find(
        (calendar) => calendar.allowsModifications,
      );
      if (!writableCalendar) {
        throw new Error("No writable calendar is available");
      }

      const startDate = new Date(booking.scheduledAt);
      const endDate = new Date(
        startDate.getTime() + booking.durationMinutes * 60 * 1000,
      );
      await Calendar.createEventAsync(writableCalendar.id, {
        title: booking.storeName,
        location: booking.storeAddress,
        notes: booking.items.map((item) => item.name).join(", "),
        startDate,
        endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      showToast.success(
        t("booking_detail_calendar_success_title"),
        t("booking_detail_calendar_success_body"),
      );
    } catch {
      showToast.error(
        t("booking_detail_calendar_error_title"),
        t("booking_detail_calendar_error_body"),
      );
    }
  };

  const openDirections = async () => {
    if (!booking) return;

    const hasCoordinates =
      typeof booking.storeLatitude === "number" &&
      Number.isFinite(booking.storeLatitude) &&
      typeof booking.storeLongitude === "number" &&
      Number.isFinite(booking.storeLongitude);
    const destination = hasCoordinates
      ? `${booking.storeLatitude},${booking.storeLongitude}`
      : encodeURIComponent(booking.storeAddress);

    if (!destination) {
      Alert.alert(
        t("booking_detail_getting_there"),
        t("bookings_location_unavailable"),
      );
      return;
    }

    const nativeUrl =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${destination}&dirflg=d`
        : hasCoordinates
          ? `geo:${booking.storeLatitude},${booking.storeLongitude}?q=${destination}`
          : `geo:0,0?q=${destination}`;
    const webUrl = `https://www.google.com/maps?q=${destination}`;

    await Linking.openURL(
      (await Linking.canOpenURL(nativeUrl)) ? nativeUrl : webUrl,
    );
  };

  const submitRating = async (values: {
    storeRating: number;
    storeReview?: string;
    workerRating: number;
    workerReview?: string;
  }) => {
    try {
      await ratingMutation.mutateAsync({
        orderId: route.params.orderId,
        ...values,
      });
      setIsRatingVisible(false);
      await detailQuery.refetch();
      showToast.success(
        t("booking_rating_success_title"),
        t("booking_rating_success_body"),
      );
    } catch (error) {
      showToast.error(
        t("booking_rating_error_title"),
        extractApiErrorMessage(error) ?? t("booking_rating_error_body"),
      );
    }
  };

  const cancelBooking = () => {
    if (!booking?.canCancel || cancelMutation.isPending) return;

    Alert.alert(
      t("booking_detail_cancel_confirm_title"),
      t("booking_detail_cancel_confirm_body"),
      [
        { style: "cancel", text: t("details_close") },
        {
          style: "destructive",
          text: t("booking_detail_cancel_confirm_action"),
          onPress: () => {
            void (async () => {
              try {
                await cancelMutation.mutateAsync(route.params.orderId);
                await detailQuery.refetch();
                showToast.success(
                  t("booking_detail_cancel_success_title"),
                  t("booking_detail_cancel_success_body"),
                );
              } catch (error) {
                showToast.error(
                  t("booking_detail_cancel_error_title"),
                  extractApiErrorMessage(error) ??
                  t("booking_detail_cancel_error_body"),
                );
              }
            })();
          },
        },
      ],
    );
  };

  if (detailQuery.isPending) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text
          style={{ color: colors.text, fontSize: typography.size.lg }}
          weight="bold"
        >
          {t("booking_detail_error_title")}
        </Text>
        <Pressable onPress={() => void detailQuery.refetch()}>
          <Text
            style={{ color: colors.primary, fontSize: typography.size.md }}
            weight="semiBold"
          >
            {t("bookings_retry")}
          </Text>
        </Pressable>
      </View>
    );
  }

  const hasDiscount = booking.items.some(
    (item) => item.originalPrice > item.price,
  );
  const dealSavings = booking.items.reduce(
    (total, item) =>
      total + Math.max(0, item.originalPrice - item.price) * item.quantity,
    0,
  );
  const canRate =
    booking.orderStatus.toLowerCase() === "completed" &&
    !booking.hasReview &&
    Boolean(booking.assignedWorker);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            resizeMode="cover"
            source={
              booking.storeImage ? { uri: booking.storeImage } : FALLBACK_IMAGE
            }
            style={styles.heroImage}
          />
          <View style={styles.heroShade} />
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              { backgroundColor: colors.surface, top: insets.top + 10 },
            ]}
          >
            <Icon color={colors.text} name="arrow-back" size={22} />
          </Pressable>
          <Text
            numberOfLines={2}
            style={[
              styles.heroTitle,
              { color: colors.white, fontSize: typography.size.xl },
            ]}
            weight="extraBold"
          >
            {booking.storeName}
          </Text>
        </View>

        <View style={styles.content}>
          <View
            style={[styles.statusBadge, { backgroundColor: colors.success }]}
          >
            <Icon
              color={colors.white}
              name="checkmark-circle-outline"
              size={17}
            />
            <Text
              style={{ color: colors.white, fontSize: typography.size.sm }}
              weight="semiBold"
            >
              {formatStatus(booking.orderStatus)}
            </Text>
          </View>

          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="extraBold"
          >
            {formatSchedule(booking.scheduledAt)}
          </Text>
          <Text
            style={{ color: colors.mutedText, fontSize: typography.size.md }}
          >
            {t("booking_detail_duration", {
              duration: formatDuration(booking.durationMinutes),
            })}
          </Text>

          {booking.isCompleted ? (
            <View style={styles.completedActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  navigation.navigate("Services", {
                    storeId: booking.storeId,
                    title: booking.storeName,
                  })
                }
                style={[
                  styles.bookAgainButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={{ color: colors.white, fontSize: typography.size.md2 }}
                  weight="semiBold"
                >
                  {t("bookings_book_again")}
                </Text>
              </Pressable>
              {canRate ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsRatingVisible(true)}
                  style={[styles.ratingButton, { borderColor: colors.primary }]}
                >
                  <Icon color={colors.primary} name="star-outline" size={20} />
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: typography.size.md2,
                    }}
                    weight="semiBold"
                  >
                    {t("booking_rating_action")}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <View style={styles.actions}>
              <ActionRow
                icon="calendar-outline"
                onPress={() => void addToCalendar()}
                subtitle={t("booking_detail_add_calendar_subtitle")}
                title={t("booking_detail_add_calendar")}
              />
              <ActionRow
                icon="navigate-outline"
                onPress={() => void openDirections()}
                subtitle={booking.storeAddress}
                title={t("booking_detail_getting_there")}
              />
              {booking.canReschedule ? (
                <ActionRow
                  icon="create-outline"
                  onPress={openReschedule}
                  subtitle={t("booking_detail_manage_subtitle")}
                  title={t("booking_detail_manage")}
                />
              ) : null}
              {booking.orderStatus.toLowerCase() === "confirmed" ? (
                <ActionRow
                  disabled={!booking.canCancel || cancelMutation.isPending}
                  icon="close-circle-outline"
                  onPress={cancelBooking}
                  subtitle={t(
                    booking.canCancel
                      ? "booking_detail_cancel_available"
                      : "booking_detail_cancel_unavailable",
                  )}
                  title={t("booking_detail_cancel")}
                  tone="danger"
                />
              ) : null}
              <ActionRow
                icon="storefront-outline"
                onPress={() => void openDirections()}
                subtitle={booking.storeName}
                title={t("booking_detail_venue")}
              />
            </View>
          )}

          <View style={styles.section}>
            <Text
              style={{ color: colors.text, fontSize: typography.size.lg }}
              weight="extraBold"
            >
              {t("booking_detail_overview")}
            </Text>
            {booking.items.map((item, index) => (
              <View key={`${item.name}-${index}`} style={styles.itemRow}>
                <View style={styles.itemCopy}>
                  <Text
                    style={{ color: colors.text, fontSize: typography.size.md }}
                    weight="medium"
                  >
                    {item.quantity > 1
                      ? `${item.quantity} × ${item.name}`
                      : item.name}
                  </Text>
                  <Text
                    style={{
                      color: colors.mutedText,
                      fontSize: typography.size.sm2,
                    }}
                  >
                    {formatDuration(item.durationMinutes)}
                  </Text>
                </View>
                <View style={styles.itemPrice}>
                  {item.originalPrice > item.price ? (
                    <Text
                      style={[
                        styles.strike,
                        {
                          color: colors.mutedText,
                          fontSize: typography.size.sm,
                        },
                      ]}
                    >
                      {formatPrice(item.originalPrice * item.quantity)}
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      color:
                        item.originalPrice > item.price
                          ? colors.primary
                          : colors.text,
                      fontSize: typography.size.md,
                    }}
                    weight="semiBold"
                  >
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))}
            {hasDiscount ? (
              <View
                style={[styles.totalRow, { borderTopColor: colors.border }]}
              >
                <Text
                  style={{
                    color: colors.mutedText,
                    fontSize: typography.size.md,
                  }}
                >
                  {t("review_confirm_discount_title")}
                </Text>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: typography.size.md,
                  }}
                  weight="semiBold"
                >
                  -{formatPrice(dealSavings)}
                </Text>
              </View>
            ) : null}
            {booking.summary.serviceFee > 0 ? (
              <View style={styles.totalRowPlain}>
                <Text
                  style={{
                    color: colors.mutedText,
                    fontSize: typography.size.md,
                  }}
                >
                  {t("booking_detail_service_fee")}
                </Text>
                <Text
                  style={{
                    color: colors.mutedText,
                    fontSize: typography.size.md,
                  }}
                >
                  {formatPrice(booking.summary.serviceFee)}
                </Text>
              </View>
            ) : null}
            <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
              <Text
                style={{ color: colors.text, fontSize: typography.size.md }}
              >
                {t("booking_detail_total")}
              </Text>
              <Text
                style={{ color: colors.text, fontSize: typography.size.md }}
                weight="semiBold"
              >
                {formatPrice(booking.summary.total)}
              </Text>
            </View>
          </View>

          <View style={[styles.section, { marginBottom: insets.bottom + 4 }]}>
            <Text
              style={{ color: colors.text, fontSize: typography.size.lg }}
              weight="extraBold"
            >
              {t("review_confirm_cancellation_title")}
            </Text>
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {booking.cancellationPolicy}
            </Text>
          </View>
        </View>
      </ScrollView>
      <AppointmentAvailabilityBottomSheet
        availableSlots={availableSlots}
        confirmLabel={t("booking_detail_reschedule_now")}
        isConfirming={rescheduleMutation.isPending}
        isLoadingSlots={availabilityMutation.isPending}
        onClose={() => {
          if (!rescheduleMutation.isPending) {
            setIsRescheduleVisible(false);
            setAvailableSlots([]);
          }
        }}
        onConfirm={(slot) => void confirmReschedule(slot)}
        onDateChange={(date) => void loadRescheduleAvailability(date)}
        selectedDate={rescheduleDate}
        visible={isRescheduleVisible}
      />
      <AppointmentRatingBottomSheet
        isSubmitting={ratingMutation.isPending}
        onClose={() => setIsRatingVisible(false)}
        onSubmit={(values) => void submitRating(values)}
        storeName={booking.storeName}
        visible={isRatingVisible}
        workerName={booking.assignedWorker?.name ?? t("team_any_professional")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionCopy: { flex: 1, gap: 3 },
  actionIcon: {
    alignItems: "center",
    borderRadius: 999,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  actionRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
  },
  actions: { marginTop: 18 },
  backButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    left: 16,
    position: "absolute",
    width: 40,
  },
  bookAgainButton: {
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 18,
    minHeight: 48,
    paddingHorizontal: 20,
  },
  completedActions: { gap: 10 },
  centered: {
    alignItems: "center",
    flex: 1,
    gap: 14,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    gap: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  hero: { borderRadius: 0, height: 310 },
  heroImage: { borderRadius: 0, height: "100%", width: "100%" },
  heroShade: {
    backgroundColor: "rgba(0,0,0,0.22)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  heroTitle: { bottom: 22, left: 20, position: "absolute", right: 20 },
  itemCopy: { flex: 1, gap: 4 },
  itemPrice: { alignItems: "flex-end", gap: 3 },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  ratingButton: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 20,
  },
  screen: { flex: 1 },
  section: { gap: 12, marginTop: 18 },
  statusBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 7,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  strike: { textDecorationLine: "line-through" },
  totalRow: {
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
  },
  totalRowPlain: { flexDirection: "row", justifyContent: "space-between" },
});

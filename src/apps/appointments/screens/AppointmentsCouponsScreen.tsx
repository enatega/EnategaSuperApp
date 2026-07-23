import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { extractApiErrorMessage } from "../../../general/api/apiClient";
import Button from "../../../general/components/Button";
import ScreenHeader from "../../../general/components/ScreenHeader";
import Text from "../../../general/components/Text";
import { showToast } from "../../../general/components/AppToast";
import { useTheme } from "../../../general/theme/theme";
import { typography } from "../../../general/theme/typography";
import {
  appointmentCouponsService,
  type AppointmentCoupon,
} from "../api/couponsService";
import AppointmentCouponCard from "../components/coupons/AppointmentCouponCard";
import AppointmentsCouponsSkeleton from "../components/coupons/AppointmentsCouponsSkeleton";
import { useAppointmentCouponStore } from "../stores/useAppointmentCouponStore";

const COUPONS_QUERY_KEY = ["appointments", "profile", "coupons"] as const;

export default function AppointmentsCouponsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const setCoupon = useAppointmentCouponStore((state) => state.setCoupon);
  const clearCoupon = useAppointmentCouponStore((state) => state.clearCoupon);
  const selectedCoupon = useAppointmentCouponStore(
    (state) => state.selectedCoupon,
  );
  const query = useQuery({
    queryKey: COUPONS_QUERY_KEY,
    queryFn: appointmentCouponsService.getAvailable,
  });
  const toggleMutation = useMutation({
    mutationFn: async (coupon: AppointmentCoupon) => {
      if (coupon.is_active) {
        return appointmentCouponsService.remove();
      }
      return appointmentCouponsService.use(coupon.id);
    },
  });
  const codeMutation = useMutation({
    mutationFn: async (couponCode: string) => {
      const coupon = await appointmentCouponsService.findByCode(couponCode);
      if (!coupon) {
        throw new Error(t("coupons_invalid_code"));
      }
      await appointmentCouponsService.use(coupon.id);
      return coupon;
    },
  });
  const coupons = useMemo(
    () =>
      (query.data?.data ?? []).map((coupon) => ({
        ...coupon,
        is_active: coupon.id === selectedCoupon?.id,
      })),
    [query.data?.data, selectedCoupon?.id],
  );
  const trimmedCode = code.trim();

  const refreshCoupons = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY });
  }, [queryClient]);

  const handleToggle = useCallback(
    async (coupon: AppointmentCoupon) => {
      try {
        await toggleMutation.mutateAsync(coupon);
        if (coupon.is_active) {
          clearCoupon();
          showToast.success(
            t("coupons_removed_title"),
            t("coupons_removed_body"),
          );
        } else {
          setCoupon({ code: coupon.code, id: coupon.id, name: coupon.name });
          showToast.success(
            t("coupons_applied_title"),
            t("coupons_applied_body"),
          );
        }
        await refreshCoupons();
      } catch (error) {
        showToast.error(
          t("coupons_error_title"),
          extractApiErrorMessage(error) ?? t("coupons_error_body"),
        );
      }
    },
    [clearCoupon, refreshCoupons, setCoupon, t, toggleMutation],
  );

  const handleApplyCode = useCallback(async () => {
    if (!trimmedCode) {
      return;
    }
    try {
      const coupon = await codeMutation.mutateAsync(trimmedCode);
      setCoupon({ code: coupon.code, id: coupon.id, name: coupon.name });
      setCode("");
      showToast.success(
        t("coupons_applied_title"),
        t("coupons_applied_body"),
      );
      await refreshCoupons();
    } catch (error) {
      showToast.error(
        t("coupons_error_title"),
        extractApiErrorMessage(error) ?? t("coupons_invalid_code"),
      );
    }
  }, [codeMutation, refreshCoupons, setCoupon, t, trimmedCode]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t("coupons_title")} />
      {query.isPending ? (
        <AppointmentsCouponsSkeleton />
      ) : (
        <FlatList
          contentContainerStyle={styles.content}
          data={coupons}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.header}>
              <Text color={colors.mutedText} style={styles.description}>
                {t("coupons_description")}
              </Text>
              <TextInput
                autoCapitalize="characters"
                onChangeText={setCode}
                placeholder={t("coupons_placeholder")}
                placeholderTextColor={colors.mutedText}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={code}
              />
              {query.isError ? (
                <Text color={colors.dangerText} style={styles.error}>
                  {t("coupons_load_error")}
                </Text>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text color={colors.text} style={styles.emptyTitle} weight="bold">
                {t("coupons_empty_title")}
              </Text>
              <Text color={colors.mutedText} style={styles.emptyBody}>
                {t("coupons_empty_body")}
              </Text>
            </View>
          }
          onRefresh={() => void query.refetch()}
          refreshing={query.isRefetching}
          renderItem={({ item }) => (
            <AppointmentCouponCard
              coupon={item}
              isBusy={toggleMutation.isPending || codeMutation.isPending}
              onToggle={handleToggle}
            />
          )}
        />
      )}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <Button
          disabled={!trimmedCode}
          isLoading={codeMutation.isPending}
          label={t("coupons_apply")}
          onPress={() => void handleApplyCode()}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  button: { borderRadius: 10, minHeight: 48 },
  content: { flexGrow: 1, gap: 14, padding: 16 },
  description: {
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
  },
  empty: { alignItems: "center", gap: 8, paddingTop: 72 },
  emptyBody: { maxWidth: 280, textAlign: "center" },
  emptyTitle: { fontSize: typography.size.lg },
  error: { fontSize: typography.size.sm2 },
  header: { gap: 12 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    fontSize: typography.size.md2,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  screen: { flex: 1 },
});

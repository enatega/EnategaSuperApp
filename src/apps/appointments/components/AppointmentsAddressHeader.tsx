import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Icon from "../../../general/components/Icon";
import Text from "../../../general/components/Text";
import type { ProfileAddress } from "../../../general/api/profileService";
import useAddress from "../../../general/hooks/useAddress";
import { useTheme } from "../../../general/theme/theme";
import {
  createSelectedDeliveryAddress,
  formatDeliveryAddressLabel,
} from "../../../general/utils/address";

type Props = {
  addresses?: ProfileAddress[];
  includeTopInset?: boolean;
  onAddAddressPress?: () => void;
  onAddressPress?: () => void;
};

export default function AppointmentsAddressHeader({
  addresses = [],
  includeTopInset = true,
  onAddAddressPress,
  onAddressPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("general");
  const { t: tAppointments } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const { selectedAddress, selectedAddressLabel } = useAddress();
  const apiSelectedAddress = useMemo(
    () => createSelectedDeliveryAddress(addresses),
    [addresses],
  );
  const resolvedSelectedAddress =
    selectedAddress?.id === "current-location"
      ? selectedAddress
      : (apiSelectedAddress ?? selectedAddress);
  const resolvedSelectedAddressLabel = (() => {
    if (resolvedSelectedAddress?.id === "current-location") {
      return (
        formatDeliveryAddressLabel(resolvedSelectedAddress) ||
        resolvedSelectedAddress.address?.trim() ||
        resolvedSelectedAddress.locationName?.trim() ||
        selectedAddressLabel
      );
    }

    return (
      formatDeliveryAddressLabel(resolvedSelectedAddress) ??
      selectedAddressLabel
    );
  })();

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: colors.border,
          paddingTop: includeTopInset ? insets.top + 8 : 12,
        },
      ]}
    >
      {resolvedSelectedAddress ? (
        <Pressable
          accessibilityLabel={
            resolvedSelectedAddressLabel ?? t("multi_vendor_address_label")
          }
          accessibilityRole="button"
          onPress={onAddressPress}
          style={({ pressed }) => [
            styles.addressButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <View style={styles.addressCopy}>
            <Text
              numberOfLines={1}
              style={[
                styles.addressText,
                {
                  color: colors.text,
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md,
                },
              ]}
              weight="semiBold"
            >
              {resolvedSelectedAddressLabel ?? t("multi_vendor_address_label")}
            </Text>
          </View>
          <Icon
            color={colors.mutedText}
            name="chevron-down"
            size={18}
            type="Ionicons"
          />
        </Pressable>
      ) : (
        <Pressable
          accessibilityLabel={t("my_profile_add_address")}
          accessibilityRole="button"
          onPress={onAddAddressPress}
          style={({ pressed }) => [
            styles.addAddressButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Icon color={colors.primary} name="add" size={18} type="Ionicons" />
          <Text
            style={[
              styles.addAddressText,
              {
                color: colors.primary,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              },
            ]}
            weight="semiBold"
          >
            {t("my_profile_add_address")}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addAddressButton: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 16,
  },
  addAddressText: {
    flexShrink: 1,
  },
  addressButton: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    minHeight: 42,
    paddingHorizontal: 16,
  },
  addressCaption: {
    letterSpacing: 0,
  },
  addressCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  addressText: {
    letterSpacing: 0,
  },
  container: {
    borderBottomWidth: 1,
    gap: 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  kicker: {
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
});

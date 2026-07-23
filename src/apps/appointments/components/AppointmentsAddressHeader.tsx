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
  onNotificationPress?: () => void;
};

export default function AppointmentsAddressHeader({
  addresses = [],
  includeTopInset = true,
  onAddAddressPress,
  onAddressPress,
  onNotificationPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("general");
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
          paddingTop: includeTopInset ? insets.top + 4 : 0,
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
            { opacity: pressed ? 0.72 : 1 },
          ]}
        >
          <Icon
            color={colors.text}
            name="location-outline"
            size={20}
            type="Ionicons"
          />
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
            weight="medium"
          >
            {resolvedSelectedAddressLabel ?? t("multi_vendor_address_label")}
          </Text>
          <Icon
            color={colors.text}
            name="chevron-down"
            size={17}
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
            { opacity: pressed ? 0.72 : 1 },
          ]}
        >
          <Icon
            color={colors.primary}
            name="location-outline"
            size={20}
            type="Ionicons"
          />
          <Text
            numberOfLines={1}
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

      <Pressable
        accessibilityLabel={t("notifications_title")}
        accessibilityRole="button"
        disabled={!onNotificationPress}
        onPress={onNotificationPress}
        style={({ pressed }) => [
          styles.notificationButton,
          {
            backgroundColor: colors.findingRideSweepEdge,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Icon
          color={colors.text}
          name="notifications-outline"
          size={20}
          type="Ionicons"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addAddressButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 44,
    minWidth: 0,
  },
  addAddressText: {
    flexShrink: 1,
  },
  addressButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 44,
    minWidth: 0,
  },
  addressText: {
    flexShrink: 1,
    letterSpacing: 0,
  },
  container: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  notificationButton: {
    alignItems: "center",
    borderRadius: 20,
    flexShrink: 0,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
});

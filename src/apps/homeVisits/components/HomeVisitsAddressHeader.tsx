import React, { type ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../general/components/Text';
import Icon from '../../../general/components/Icon';
import { useTheme } from '../../../general/theme/theme';
import useAddress from '../../../general/hooks/useAddress';
import type { ProfileAddress } from '../../../general/api/profileService';
import {
  createSelectedDeliveryAddress,
  formatDeliveryAddressLabel,
} from '../../../general/utils/address';

type Props = {
  addresses?: ProfileAddress[];
  addressVariant?: 'button' | 'label';
  horizontalPadding?: number;
  onAddAddressPress?: () => void;
  onAddressPress?: () => void;
  rightAccessory?: ReactNode;
};

export default function HomeVisitsAddressHeader({
  addresses = [],
  addressVariant = 'button',
  horizontalPadding = 16,
  onAddAddressPress,
  onAddressPress,
  rightAccessory,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const { selectedAddress, selectedAddressLabel } = useAddress();
  const apiSelectedAddress = useMemo(
    () => createSelectedDeliveryAddress(addresses),
    [addresses],
  );
  const resolvedSelectedAddress = apiSelectedAddress ?? selectedAddress;
  const resolvedSelectedAddressLabel =
    formatDeliveryAddressLabel(resolvedSelectedAddress) ??
    selectedAddressLabel;

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: horizontalPadding, paddingTop: insets.top + 8 },
      ]}
    >
      <View style={styles.leftSlot}>
        {resolvedSelectedAddress && addressVariant === 'label' ? (
          <Pressable
            accessibilityLabel={
              resolvedSelectedAddressLabel ?? t('home_visits_address_label')
            }
            accessibilityRole="button"
            disabled={!onAddressPress}
            onPress={onAddressPress}
            style={({ pressed }) => [
              styles.addressLabelContainer,
              {
                opacity: onAddressPress && pressed ? 0.72 : 1,
              },
            ]}
          >
            <Icon
              color={colors.primary}
              name="location-outline"
              size={18}
              type="Ionicons"
            />
            <Text
              numberOfLines={1}
              weight="medium"
              style={[
                styles.addressLabelText,
                {
                  color: colors.primary,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                },
              ]}
            >
              {resolvedSelectedAddressLabel ?? t('home_visits_address_label')}
            </Text>
            <Icon
              color={colors.primary}
              name="chevron-down"
              size={14}
              type="Ionicons"
            />
          </Pressable>
        ) : resolvedSelectedAddress ? (
          <Pressable
            accessibilityLabel={
              resolvedSelectedAddressLabel ?? t('home_visits_address_label')
            }
            accessibilityRole="button"
            onPress={onAddressPress}
            style={({ pressed }) => [
              styles.addressButton,
              {
                backgroundColor: colors.surface,
                borderColor: 'rgba(17, 24, 39, 0.06)',
                opacity: pressed ? 0.92 : 1,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Icon
              color={colors.iconMuted}
              name="home-outline"
              size={18}
              type="Ionicons"
            />
            <Text
              numberOfLines={1}
              weight="medium"
              style={[
                styles.addressText,
                {
                  color: colors.text,
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md,
                },
              ]}
            >
              {resolvedSelectedAddressLabel ?? t('home_visits_address_label')}
            </Text>
            <Icon
              color={colors.mutedText}
              name="chevron-down"
              size={14}
              type="Ionicons"
            />
          </Pressable>
        ) : (
          <Pressable
            accessibilityLabel={t('add_service_address')}
            accessibilityRole="button"
            onPress={onAddAddressPress}
            style={({ pressed }) => [
              styles.addAddressButton,
              {
                backgroundColor: colors.surface,
                borderColor: 'rgba(17, 24, 39, 0.06)',
                opacity: pressed ? 0.92 : 1,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Icon
              color={colors.primary}
              name="add"
              size={18}
              type="Ionicons"
            />
            <Text
              numberOfLines={1}
              weight="semiBold"
              style={[
                styles.addAddressText,
                {
                  color: colors.primary,
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md,
                },
              ]}
            >
              {t('add_service_address')}
            </Text>
          </Pressable>
        )}
      </View>

      {rightAccessory ? <View style={styles.rightSlot}>{rightAccessory}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  addAddressButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'flex-start',
    maxWidth: '60%',
    minHeight: 44,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  addAddressText: {
    flexShrink: 1,
  },
  addressLabelContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'flex-start',
    minHeight: 44,
    paddingRight: 12,
    paddingVertical: 10,
  },
  addressLabelText: {
    flexShrink: 1,
    letterSpacing: 0,
  },
  addressButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    maxWidth: '60%',
    minHeight: 44,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  addressText: {
    flex: 1,
    letterSpacing: 0,
  },
  addressLeadingIcon: {
    marginRight: 4,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  leftSlot: {
    flex: 1,
    minWidth: 0,
  },
  rightSlot: {
    marginLeft: 10,
  },
});

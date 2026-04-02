import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import BottomSheetHandle from '../../../../../general/components/BottomSheetHandle';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import Image from '../../../../../general/components/Image';
import { useTheme } from '../../../../../general/theme/theme';
import { formatRideCurrency } from '../../../utils/rideFormatting';
import type { RideAddressSelection } from '../../../api/types';

function ActionButton({
  icon,
  label,
  onPress,
  iconColor,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  iconColor?: string;
  danger?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.actionButton}>
      <View
        style={[
          styles.actionIconWrap,
          { backgroundColor: colors.backgroundTertiary, shadowColor: colors.shadowColor },
        ]}
      >
        {icon}
      </View>
      <Text
        style={[
          styles.actionLabel,
          { color: danger ? colors.danger : iconColor ?? colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.menuRow}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={[styles.menuLabel, { color: danger ? colors.danger : colors.text }]}>
          {label}
        </Text>
      </View>
      <Icon
        type="Feather"
        name="chevron-right"
        size={18}
        color={danger ? colors.danger : colors.iconMuted}
      />
    </Pressable>
  );
}

type Props = {
  fromAddress: RideAddressSelection;
  stopAddresses?: RideAddressSelection[];
  toAddress: RideAddressSelection;
  title: string;
  statusCode?: string;
  statusLabel?: string;
  fare?: number;
  paymentMethodLabel?: string;
  driverName?: string;
  driverRating?: number;
  driverAvatarUri?: string;
  vehicleName?: string;
  vehicleColor?: string;
  licensePlate?: string;
  isCourierFlow?: boolean;
  canCancelRide?: boolean;
  onDriverPress?: () => void;
  onContactDriver?: () => void;
  onSafetyPress?: () => void;
  onShareRide?: () => void;
  onEmergencyPress?: () => void;
  onCancelRide?: () => void;
};

function ActiveRideBottomSheet({
  fromAddress,
  stopAddresses,
  toAddress,
  title,
  statusCode,
  statusLabel,
  fare,
  paymentMethodLabel,
  driverName,
  driverRating,
  driverAvatarUri,
  vehicleName,
  vehicleColor,
  licensePlate,
  isCourierFlow = false,
  canCancelRide = false,
  onDriverPress,
  onContactDriver,
  onSafetyPress,
  onShareRide,
  onEmergencyPress,
  onCancelRide,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const resolvedVehicleSubtitle = [vehicleName, vehicleColor].filter(Boolean).join(' • ');
  const shouldShowCancelAction = canCancelRide && statusCode !== 'IN_PROGRESS';

  return (
    <SwipeableBottomSheet
      expandedHeight={640 + insets.bottom}
      defaultHeight={396 + insets.bottom}
      collapsedHeight={168 + insets.bottom}
      initialState="default"
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 14,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<BottomSheetHandle color={colors.findingRideHandle} />}
    >
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text weight="extraBold" style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>
          <View style={styles.vehicleRow}>
            <Text color={colors.mutedText} style={styles.vehicleText}>
              {resolvedVehicleSubtitle || t('ride_active_vehicle_assigned')}
            </Text>
            {licensePlate ? (
              <Text weight="bold" style={[styles.plateText, { color: colors.text }]}>
                {licensePlate}
              </Text>
            ) : null}
          </View>
          {statusLabel ? (
            <Text color={colors.findingRidePrimary} weight="semiBold" style={styles.status}>
              {statusLabel}
            </Text>
          ) : null}
        </View>

        <View style={[styles.actionsRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <Pressable onPress={onDriverPress} style={styles.driverCard}>
            <View style={styles.avatarWrap}>
              {driverAvatarUri ? (
                <Image source={{ uri: driverAvatarUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarFallback, { backgroundColor: colors.cardSoft }]}>
                  <Text weight="extraBold" style={[styles.avatarInitial, { color: colors.text }]}>
                    {(driverName ?? 'D').slice(0, 1).toUpperCase()}
                  </Text>
                </View>
              )}
              {typeof driverRating === 'number' ? (
                <View style={[styles.ratingBadge, { backgroundColor: colors.surface, shadowColor: colors.shadowColor }]}>
                  <Icon type="FontAwesome" name="star" size={9} color={colors.yellow500} />
                  <Text style={[styles.ratingText, { color: colors.text }]}>
                    {driverRating.toFixed(2)}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.driverLabel, { color: colors.text }]}>
              {driverName ?? t('ride_active_driver_fallback')}
            </Text>
          </Pressable>

          <ActionButton
            label={isCourierFlow ? t('ride_active_contact_courier') : t('ride_active_contact_driver')}
            onPress={onContactDriver}
            icon={<Icon type="Feather" name="phone" size={22} color={colors.text} />}
          />
          <ActionButton
            label={t('ride_active_safety')}
            onPress={onSafetyPress}
            icon={<Icon type="Feather" name="shield" size={22} color={colors.text} />}
          />
        </View>

        <View style={styles.section}>
          <Text color={colors.mutedText} style={styles.sectionLabel}>
            {t('ride_active_payment')}
          </Text>
          <View style={styles.paymentRow}>
            <View style={[styles.cashIcon, { backgroundColor: '#CFF5DA' }]}>
              <Icon type="FontAwesome" name="money" size={18} color="#15803D" />
            </View>
            <View style={styles.paymentTextRow}>
              <Text weight="semiBold" style={[styles.paymentAmount, { color: colors.text }]}>
                {formatRideCurrency(fare)}
              </Text>
              {paymentMethodLabel ? (
                <Text color={colors.mutedText} style={styles.paymentMethod}>
                  {paymentMethodLabel}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text color={colors.mutedText} style={styles.sectionLabel}>
            {isCourierFlow ? t('ride_active_courier_route') : t('ride_active_current_trip')}
          </Text>
          <View style={styles.tripPoints}>
            <View style={styles.routeRow}>
              <View style={[styles.routeDotOutline, { borderColor: '#6EE7B7' }]}>
                <View style={[styles.routeDotInner, { backgroundColor: '#34D399' }]} />
              </View>
              <Text style={[styles.routeText, { color: colors.text }]} numberOfLines={2}>
                {fromAddress.description}
              </Text>
            </View>
            {stopAddresses?.map((stopAddress) => (
              <View key={stopAddress.placeId} style={styles.routeRow}>
                <View style={[styles.routeDotOutline, { borderColor: '#FBBF24' }]}>
                  <View style={[styles.routeDotInner, { backgroundColor: '#F59E0B' }]} />
                </View>
                <Text style={[styles.routeText, { color: colors.text }]} numberOfLines={2}>
                  {stopAddress.description}
                </Text>
              </View>
            ))}
            <View style={styles.routeRow}>
              <View style={[styles.routeDotOutline, { borderColor: '#FCA5A5' }]}>
                <View style={[styles.routeDotInner, { backgroundColor: '#F87171' }]} />
              </View>
              <Text style={[styles.routeText, { color: colors.text }]} numberOfLines={2}>
                {toAddress.description}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <MenuRow
            icon={<Icon type="Feather" name="share" size={22} color={colors.text} />}
            label={isCourierFlow ? t('ride_active_share_courier') : t('ride_active_share_my_ride')}
            onPress={onShareRide}
          />
          <MenuRow
            icon={<Icon type="Feather" name="alert-triangle" size={22} color={colors.danger} />}
            label={t('ride_active_call_emergency')}
            onPress={onEmergencyPress}
            danger
          />
          {shouldShowCancelAction ? (
            <MenuRow
              icon={<Icon type="Feather" name="x-circle" size={22} color={colors.danger} />}
              label={t('reservation_cancel_ride')}
              onPress={onCancelRide}
              danger
            />
          ) : null}
        </View>
      </View>
    </SwipeableBottomSheet>
  );
}

export default memo(ActiveRideBottomSheet);

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  content: {
    paddingBottom: 16,
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  vehicleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  plateText: {
    fontSize: 14,
    lineHeight: 22,
  },
  status: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  driverCard: {
    width: 72,
    alignItems: 'center',
    gap: 8,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    lineHeight: 22,
  },
  ratingBadge: {
    position: 'absolute',
    right: -34,
    top: 30,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  ratingText: {
    fontSize: 10,
    lineHeight: 14,
  },
  driverLabel: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  actionButton: {
    width: 92,
    alignItems: 'center',
    gap: 8,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  actionLabel: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  section: {
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cashIcon: {
    width: 28,
    height: 18,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  paymentAmount: {
    fontSize: 18,
    lineHeight: 28,
  },
  paymentMethod: {
    fontSize: 12,
    lineHeight: 18,
  },
  tripPoints: {
    gap: 10,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeDotOutline: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  menuSection: {
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 16,
    gap: 24,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});

import React, { memo, useCallback } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import Image from '../../../../../general/components/Image';
import { showToast } from '../../../../../general/components/AppToast';
import { useTheme } from '../../../../../general/theme/theme';
import useRideRoutePath from '../../../hooks/useRideRoutePath';
import { formatRideCurrency } from '../../../utils/rideFormatting';
import ActiveRideMapLayer from './ActiveRideMapLayer';
import type { ActiveRideViewData } from '../types/view';

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

function ActiveRideView({
  fromAddress,
  toAddress,
  title,
  statusLabel,
  fare,
  paymentMethodLabel,
  driverName,
  driverRating,
  driverAvatarUri,
  driverPhone,
  vehicleName,
  vehicleColor,
  licensePlate,
  driverCoordinate,
}: ActiveRideViewData) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const routeQuery = useRideRoutePath(fromAddress, toAddress);
  const resolvedVehicleSubtitle = [vehicleName, vehicleColor].filter(Boolean).join(' • ');

  const handleContactDriver = useCallback(async () => {
    if (!driverPhone) {
      showToast.info('Driver contact unavailable');
      return;
    }

    try {
      await Linking.openURL(`tel:${driverPhone}`);
    } catch {
      showToast.error('Unable to open dialer');
    }
  }, [driverPhone]);

  const handleSafetyPress = useCallback(() => {
    showToast.info('Safety options coming soon');
  }, []);

  const handleShareRide = useCallback(() => {
    showToast.info('Ride sharing coming soon');
  }, []);

  const handleEmergencyPress = useCallback(() => {
    showToast.info('Emergency actions coming soon');
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActiveRideMapLayer
        fromAddress={fromAddress}
        toAddress={toAddress}
        routeCoordinates={routeQuery.data ?? []}
        driverCoordinate={driverCoordinate}
      />

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
        handle={<View style={[styles.handle, { backgroundColor: colors.findingRideHandle }]} />}
        handleContainerStyle={styles.handleContainer}
      >
        <View style={styles.content}>
          <View style={styles.headerBlock}>
            <Text weight="extraBold" style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>
            <View style={styles.vehicleRow}>
              <Text color={colors.mutedText} style={styles.vehicleText}>
                {resolvedVehicleSubtitle || 'Vehicle assigned'}
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
            <View style={styles.driverCard}>
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
                {driverName ?? 'Driver'}
              </Text>
            </View>

            <ActionButton
              label="Contact Driver"
              onPress={handleContactDriver}
              icon={(
                <Icon type="Feather" name="phone" size={22} color={colors.text} />
              )}
            />
            <ActionButton
              label="Safety"
              onPress={handleSafetyPress}
              icon={(
                <Icon type="Feather" name="shield" size={22} color={colors.text} />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text color={colors.mutedText} style={styles.sectionLabel}>
              Payment
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
              Your current trip
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
              label="Share my ride"
              onPress={handleShareRide}
            />
            <MenuRow
              icon={<Icon type="Feather" name="alert-triangle" size={22} color={colors.danger} />}
              label="Call emergency"
              onPress={handleEmergencyPress}
              danger
            />
          </View>
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(ActiveRideView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    flex: 1,
    paddingTop: 24,
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

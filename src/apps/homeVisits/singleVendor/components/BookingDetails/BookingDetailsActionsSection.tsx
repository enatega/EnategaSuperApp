import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  onAddToCalendar: () => void;
  onTrackWorker: () => void;
  onCancelAppointment?: () => void;
  showCancelAppointment?: boolean;
};

export default function BookingDetailsActionsSection({
  onAddToCalendar,
  onCancelAppointment,
  onTrackWorker,
  showCancelAppointment = false,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();

  return (
    <>
      <Pressable
        onPress={onAddToCalendar}
        style={[styles.actionRow, { borderTopColor: colors.border }]}
      >
        <View style={[styles.actionIcon, { backgroundColor: colors.backgroundTertiary }]}>
          <MaterialCommunityIcons
            color={colors.primary}
            name="calendar-month-outline"
            size={20}
          />
        </View>
        <View style={styles.actionText}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="semiBold"
          >
            {t('single_vendor_booking_add_calendar_title')}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
            weight="medium"
          >
            {t('single_vendor_booking_add_calendar_subtitle')}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onTrackWorker}
        style={[styles.actionRow, { borderTopColor: colors.border }]}
      >
        <View style={[styles.actionIcon, { backgroundColor: colors.backgroundTertiary }]}>
          <MaterialCommunityIcons
            color={colors.primary}
            name="crosshairs-gps"
            size={20}
          />
        </View>
        <View style={styles.actionText}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="semiBold"
          >
            {t('single_vendor_booking_track_title')}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
            weight="medium"
          >
            {t('single_vendor_booking_track_subtitle')}
          </Text>
        </View>
        <MaterialCommunityIcons
          color={colors.iconMuted}
          name="chevron-right"
          size={20}
        />
      </Pressable>

      {showCancelAppointment && onCancelAppointment ? (
        <Pressable
          onPress={onCancelAppointment}
          style={[styles.actionRow, { borderTopColor: colors.border }]}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.backgroundTertiary }]}>
            <MaterialCommunityIcons
              color={colors.danger}
              name="calendar-remove-outline"
              size={20}
            />
          </View>
          <View style={styles.actionText}>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
              weight="semiBold"
            >
              {t('single_vendor_manage_appointment_cancel')}
            </Text>
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
              weight="medium"
            >
              {t('single_vendor_booking_cancel_subtitle')}
            </Text>
          </View>
          <MaterialCommunityIcons
            color={colors.iconMuted}
            name="chevron-right"
            size={20}
          />
        </Pressable>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  actionIcon: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionRow: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
  },
  actionText: {
    flex: 1,
    gap: 2,
  },
});

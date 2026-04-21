import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ReviewDetailRow from './ReviewDetailRow';

type Props = {
  title: string;
  appointmentTitle: string;
  appointmentSubtitle: string;
  onAppointmentPress?: () => void;
};

function ReviewScheduleSection({
  appointmentSubtitle,
  appointmentTitle,
  onAppointmentPress,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={{
          color: colors.text,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {title}
      </Text>

      <ReviewDetailRow
        icon="calendar-outline"
        onPress={onAppointmentPress}
        subtitle={appointmentSubtitle}
        title={appointmentTitle}
      />
    </View>
  );
}

export default memo(ReviewScheduleSection);

const styles = StyleSheet.create({
  section: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

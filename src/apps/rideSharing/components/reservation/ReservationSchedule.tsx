import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
  dateTime: string;
};

export default function ReservationSchedule({ label, dateTime }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text variant="caption" color={colors.mutedText} style={styles.label}>
        {label}
      </Text>
      <View style={styles.content}>
        <Ionicons name="calendar-outline" size={24} color={colors.mutedText} />
        <Text weight="medium" style={styles.dateTime}>
          {dateTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
  },
  label: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTime: {
    fontSize: 16,
  },
});

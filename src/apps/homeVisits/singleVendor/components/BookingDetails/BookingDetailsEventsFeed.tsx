import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { BookingDetailsLiveEvent } from './types';

type Props = {
  events: BookingDetailsLiveEvent[];
};

export default function BookingDetailsEventsFeed({ events }: Props) {
  const { colors, typography } = useTheme();

  if (events.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text
        style={{
          color: colors.text,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
          marginBottom: 6,
        }}
        weight="semiBold"
      >
        Live events
      </Text>

      {events.slice(0, 5).map((event) => (
        <View key={event.id} style={[styles.row, { borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontSize: typography.size.xs2 }} weight="semiBold">
            {event.source.toUpperCase()} - {event.type}
          </Text>
          <Text style={{ color: colors.mutedText, fontSize: typography.size.xs2 }} weight="medium">
            {event.message}
          </Text>
          <Text style={{ color: colors.iconMuted, fontSize: typography.size.xs2 }} weight="medium">
            {event.at}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  section: {
    paddingTop: 14,
  },
});

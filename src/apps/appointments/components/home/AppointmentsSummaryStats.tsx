import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type StatItem = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
};

type Props = {
  items: StatItem[];
};

export default function AppointmentsSummaryStats({ items }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View
          key={item.label}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.blue50 }]}>
            <MaterialCommunityIcons
              color={colors.primary}
              name={item.icon}
              size={18}
            />
          </View>

          <Text
            weight="extraBold"
            style={{
              fontSize: typography.size.xl,
              lineHeight: typography.lineHeight.lg,
            }}
          >
            {item.value}
          </Text>
          <Text color={colors.mutedText} style={styles.label}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    elevation: 2,
    flex: 1,
    gap: 8,
    padding: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});

import React from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '../../theme/theme';
import Text from '../Text';

type Props = {
  label: string;
  value: boolean;
  isLoading?: boolean;
  onToggle: (value: boolean) => void;
};

export default function NotificationToggleRow({ label, value, isLoading = false, onToggle }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Text variant="body" style={styles.label}>
        {label}
      </Text>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
          accessibilityLabel={label}
          accessibilityRole="switch"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
});

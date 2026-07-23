import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export default function AppointmentAnyProfessionalRow({
  buttonLabel,
  isDisabled = false,
  isLoading = false,
  onPress,
  subtitle,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.warning}1A` }]}>
          <Icon color={colors.warning} name="people-outline" size={28} />
        </View>

        <View style={styles.copy}>
          <Text style={{ color: colors.text, fontSize: typography.size.md }} weight="bold">
            {title}
          </Text>
          <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
            {subtitle}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isDisabled || isLoading}
        onPress={onPress}
        style={[
          styles.button,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Text style={{ color: colors.text, fontSize: typography.size.sm2 }} weight="semiBold">
            {buttonLabel}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 68,
    paddingHorizontal: 12,
  },
  copy: {
    gap: 2,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  left: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
});

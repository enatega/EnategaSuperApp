import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from '../Icon';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  label: string;
  description?: string;
  iconName?: string;
  iconType?: React.ComponentProps<typeof Icon>['type'];
  isSelected: boolean;
  onPress: () => void;
};

export default function MainFilterAddressOptionRow({
  label,
  description,
  iconName = 'home-outline',
  iconType = 'Ionicons',
  isSelected,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Icon type={iconType} name={iconName} size={24} color={colors.text} />

      <View style={styles.content}>
        <Text
          weight="medium"
          style={[
            styles.label,
            {
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.sm2,
            },
          ]}
        >
          {label}
        </Text>
        {description ? (
          <Text
            color={colors.mutedText}
            style={[
              styles.description,
              {
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {isSelected ? (
        <Icon type="Feather" name="check" size={22} color={colors.text} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  description: {
    marginTop: 2,
  },
  label: {
    flexShrink: 1,
  },
});

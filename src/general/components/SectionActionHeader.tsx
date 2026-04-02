import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Text from './Text';
import { useTheme } from '../theme/theme';

type Props = {
  title: string;
  actionLabel: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SectionActionHeader({
  title,
  actionLabel,
  onActionPress,
  style,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text
        weight="extraBold"
        style={{
          fontSize: typography.size.h5,
          letterSpacing: -0.36,
          lineHeight: typography.lineHeight.h5,
        }}
      >
        {title}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={onActionPress}
        style={[
          styles.actionButton,
          {
            backgroundColor: colors.blue100,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: 22,
          }}
        >
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 88,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});

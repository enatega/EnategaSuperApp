import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Text from './Text';
import { useTheme } from '../theme/theme';

type Props = {
  title: string;
  actionLabel?: string;
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
          fontSize: typography.size.lg,
          letterSpacing: -0.36,
          lineHeight: typography.lineHeight.lg,
        }}
      >
        {title}
      </Text>

      {actionLabel ? (
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
              fontWeight: '700',
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
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
    borderRadius: 5,
    justifyContent: 'center',
    minHeight: 30,
    minWidth: 76,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});

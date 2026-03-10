import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Button from './Button';
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
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.h5,
        }}
      >
        {title}
      </Text>

      <Button
        label={actionLabel}
        onPress={onActionPress}
        style={[
          styles.actionButton,
          {
            backgroundColor: colors.blue100,
            borderColor: 'transparent',
          },
        ]}
        variant="secondary"
      />
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
    borderRadius: 10,
    minHeight: 42,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

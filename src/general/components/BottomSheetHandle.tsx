import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/theme';

export type BottomSheetHandleVariant = 'visible' | 'hidden';

type Props = {
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  variant?: BottomSheetHandleVariant;
};

export default function BottomSheetHandle({
  color,
  containerStyle,
  variant = 'visible',
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.handle,
          {
            backgroundColor: color ?? colors.border,
            opacity: variant === 'hidden' ? 0 : 1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },
  handle: {
    borderRadius: 999,
    height: 4,
    width: 40,
  },
});

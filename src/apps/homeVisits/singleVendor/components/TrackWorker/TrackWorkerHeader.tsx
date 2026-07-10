import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  title: string;
  topInset: number;
  onClose: () => void;
};

export default function TrackWorkerHeader({ title, topInset, onClose }: Props) {
  const { colors, typography } = useTheme();
  const hasTitle = title.trim().length > 0;

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: topInset + 8,
          paddingBottom: hasTitle ? 10 : 0,
        },
      ]}
    >
      <View
        style={[
          styles.headerRow,
          hasTitle
            ? {
                backgroundColor: colors.background,
                borderBottomColor: colors.border,
                borderBottomWidth: StyleSheet.hairlineWidth,
              }
            : styles.headerRowFloating,
        ]}
      >
        <View style={styles.sideSpacer} />

        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg,
            },
          ]}
          weight="semiBold"
        >
          {title}
        </Text>

        <Pressable
          onPress={onClose}
          style={[
            styles.closeButton,
            {
              backgroundColor: hasTitle ? colors.surfaceSoft : colors.background,
              borderColor: hasTitle ? colors.border : 'transparent',
            },
          ]}
        >
          <MaterialCommunityIcons color={colors.text} name="close" size={20} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  headerRowFloating: {
    backgroundColor: 'transparent',
  },
  sideSpacer: {
    width: 44,
  },
  title: {
    flex: 1,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  wrapper: {
    justifyContent: 'center',
  },
});

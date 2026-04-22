import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  title: string;
  backAccessibilityLabel: string;
  rightAccessibilityLabel: string;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function SupportHeader({
  title,
  backAccessibilityLabel,
  rightAccessibilityLabel,
  rightIconName = 'call-outline',
  onRightPress,
}: Props) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 12,
        },
      ]}
    >
      <View style={styles.side}>
        <Pressable
          accessibilityLabel={backAccessibilityLabel}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => navigation.goBack()}
          style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Ionicons
            color={colors.text}
            name="arrow-back"
            size={22}
          />
        </Pressable>
      </View>

      <Text
        color={colors.text}
        numberOfLines={1}
        style={[styles.title, { fontSize: typography.size.lg, lineHeight: 22 }]}
        weight="extraBold"
      >
        {title}
      </Text>

      <View style={[styles.side, styles.rightSide]}>
        <Pressable
          accessibilityLabel={rightAccessibilityLabel}
          accessibilityRole="button"
          onPress={onRightPress}
          style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Ionicons
            color={colors.text}
            name={rightIconName}
            size={22}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  side: {
    justifyContent: 'center',
    width: 52,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});

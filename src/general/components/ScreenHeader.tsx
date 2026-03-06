import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';
import Text from './Text';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  /** Screen title shown in the centre — optional, omit to show back button only */
  title?: string;
  /**
   * Custom left slot. If provided, replaces the default back button.
   */
  leftSlot?: React.ReactNode;
  /**
   * Anything rendered in the right slot — an icon button, avatar, menu, etc.
   * If omitted a transparent placeholder keeps the title centred.
   */
  rightSlot?: React.ReactNode;
  /**
   * Override whether the back button is shown.
   * Defaults to `navigation.canGoBack()` when not provided.
   */
  showBack?: boolean;
  /** Called when the back button is pressed. Defaults to `navigation.goBack()`. */
  onBack?: () => void;
  style?: ViewStyle;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScreenHeader({
  title,
  leftSlot,
  rightSlot,
  showBack,
  onBack,
  style,
}: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const canGoBack = showBack !== undefined ? showBack : navigation.canGoBack();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 8,
        },
        style,
      ]}
    >
      {/* ── Left: Back Button ── */}
      <View style={styles.side}>
        {leftSlot
          ? leftSlot
          : canGoBack && (
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={[styles.backButton, { backgroundColor: colors.backgroundTertiary }]}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </View>
            </Pressable>
          )}
      </View>

      {/* ── Centre: Title (optional) ── */}
      {title ? (
        <Text
          numberOfLines={1}
          weight="semiBold"
          color={colors.text}
          style={styles.title}
        >
          {title}
        </Text>
      ) : (
        <View style={styles.title} />
      )}

      {/* ── Right: Optional Slot ── */}
      <View style={[styles.side, styles.rightSide]}>
        {rightSlot ?? null}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const SIDE_WIDTH = 52;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  side: {
    width: SIDE_WIDTH,
    justifyContent: 'center',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
});

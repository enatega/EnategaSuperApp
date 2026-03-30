import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onRightPress?: () => void;
  rightAccessibilityLabel?: string;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  title: string;
};

export default function SupportHeader({
  onRightPress,
  rightAccessibilityLabel,
  rightIconName = 'call-outline',
  title,
}: Props) {
  const { colors, typography } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('deliveries');
  const resolvedRightAccessibilityLabel = rightAccessibilityLabel ?? t('support_header_action');

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
          accessibilityLabel={t('support_back_action')}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => navigation.goBack()}
          style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
      </View>

      <Text
        color={colors.text}
        weight="extraBold"
        style={[styles.title, { fontSize: typography.size.lg, lineHeight: 22 }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={[styles.side, styles.rightSide]}>
        <Pressable
          accessibilityLabel={resolvedRightAccessibilityLabel}
          accessibilityRole="button"
          onPress={onRightPress}
          style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Ionicons name={rightIconName} size={22} color={colors.text} />
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

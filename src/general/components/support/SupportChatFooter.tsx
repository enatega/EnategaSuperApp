import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../Button';
import { useTheme } from '../../theme/theme';

type Props = {
  ctaLabel: string;
  onPress: () => void;
};

export default function SupportChatFooter({ ctaLabel, onPress }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <Button
        icon={<Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.white} />}
        label={ctaLabel}
        onPress={onPress}
        style={styles.footerButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerButton: {
    borderRadius: 6,
    minHeight: 44,
  },
});

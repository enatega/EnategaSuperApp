import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  backIconName?: React.ComponentProps<typeof Ionicons>['name'];
  onBackPress: () => void;
  title?: string;
};

export default function CheckoutHeader({
  backIconName = 'chevron-back',
  onBackPress,
  title,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Pressable
        accessibilityLabel={t('store_details_action_back')}
        accessibilityRole="button"
        onPress={onBackPress}
        style={[styles.backButton, { backgroundColor: colors.surfaceSoft }]}
      >
        <Ionicons color={colors.text} name={backIconName} size={20} />
      </Pressable>

      <Text
        weight="semiBold"
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
        }}
      >
        {title ?? t('checkout_title')}
      </Text>

      <View style={styles.trailingSpace} />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  trailingSpace: {
    width: 40,
  },
});

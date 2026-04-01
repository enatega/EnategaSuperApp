import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onStartShoppingPress: () => void;
};

export default function CartEmptyState({ onStartShoppingPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={require('../../assets/images/empty-cart.png')}
        style={styles.artwork}
      />

      <View style={styles.textBlock}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
            textAlign: 'center',
          }}
        >
          {t('cart_empty_title')}
        </Text>
        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.md,
            lineHeight: typography.lineHeight.md + 4,
            textAlign: 'center',
          }}
        >
          {t('cart_empty_message')}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onStartShoppingPress}
        style={[styles.button, { backgroundColor: colors.blue100 }]}
      >
        <Text
          weight="medium"
          style={{
            color: colors.primary,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {t('cart_start_shopping')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  artwork: {
    height: 144,
    width: 184,
  },
  button: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 18,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 28,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  textBlock: {
    gap: 12,
    maxWidth: 320,
  },
});

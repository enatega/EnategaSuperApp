import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onRetry: () => void;
};

export default function CartScreenErrorState({ onRetry }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.container}>
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
          {t('cart_error_title')}
        </Text>
        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.md,
            lineHeight: typography.lineHeight.md + 2,
            textAlign: 'center',
          }}
        >
          {t('cart_error_message')}
        </Text>
      </View>

      <Button label={t('generic_list_retry')} onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  textBlock: {
    gap: 10,
  },
});

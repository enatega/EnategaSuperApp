import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  compact?: boolean;
};

export default function WalletTransactionsEmptyState({ compact = false }: Props) {
  const { t } = useTranslation('deliveries');
  const { colors } = useTheme();

  return (
    <View style={[styles.container, compact ? styles.containerCompact : null]}>
      <Image
        source={require('../../assets/images/no-transaction.png')}
        style={[styles.illustration, compact ? styles.illustrationCompact : null]}
        resizeMode="contain"
      />
      <Text color={colors.text} weight="extraBold" style={styles.title}>
        {t('wallet_transactions_empty_title')}
      </Text>
      <Text color={colors.mutedText} style={styles.description}>
        {t('wallet_transactions_empty_description')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  containerCompact: {
    paddingTop: 28,
  },
  illustration: {
    height: 170,
    width: 170,
  },
  illustrationCompact: {
    height: 110,
    width: 110,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
});

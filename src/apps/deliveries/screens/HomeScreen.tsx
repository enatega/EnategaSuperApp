import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../../general/components/Header';
import Button from '../../../general/components/Button';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type Props = {
  onSelect: (type: 'singleVendor' | 'multiVendor' | 'chain') => void;
};

export default function DeliveriesHomeScreen({ onSelect }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Header title={t('header_title')} subtitle={t('header_subtitle')} />
      <View style={styles.cardGroup}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}> 
          <Text weight="semiBold">{t('single_vendor_title')}</Text>
          <Text variant="caption" color={colors.mutedText}>
            {t('single_vendor_desc')}
          </Text>
          <Button label={t('explore_button')} onPress={() => onSelect('singleVendor')} />
        </View>
        <View style={[styles.card, { backgroundColor: colors.surface }]}> 
          <Text weight="semiBold">{t('multi_vendor_title')}</Text>
          <Text variant="caption" color={colors.mutedText}>
            {t('multi_vendor_desc')}
          </Text>
          <Button label={t('explore_button')} onPress={() => onSelect('multiVendor')} />
        </View>
        <View style={[styles.card, { backgroundColor: colors.surface }]}> 
          <Text weight="semiBold">{t('chain_title')}</Text>
          <Text variant="caption" color={colors.mutedText}>
            {t('chain_desc')}
          </Text>
          <Button label={t('explore_button')} onPress={() => onSelect('chain')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  cardGroup: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    gap: 8,
  },
});

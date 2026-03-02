import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

export default function ChainHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Header title={t('chain_title')} subtitle={t('chain_home_subtitle')} />
      <Text>{t('chain_home_body')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

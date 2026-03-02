import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

export default function MultiVendorHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Header title={t('multi_vendor_title')} subtitle={t('multi_vendor_home_subtitle')} />
      <Text>{t('multi_vendor_home_body')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

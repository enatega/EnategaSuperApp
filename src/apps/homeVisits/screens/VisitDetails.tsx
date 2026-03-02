import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../../general/components/Header';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

export default function VisitDetails() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Header title={t('details_title')} />
      <Text>{t('details_body')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

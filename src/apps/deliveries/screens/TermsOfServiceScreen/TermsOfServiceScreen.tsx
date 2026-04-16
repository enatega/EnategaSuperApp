import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import TermsOfServiceContent from '../../components/termsOfService/TermsOfServiceContent';

export default function TermsOfServiceScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('tos_screen_header')} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TermsOfServiceContent />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
});

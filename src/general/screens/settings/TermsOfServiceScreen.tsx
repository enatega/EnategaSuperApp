import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import TermsOfServiceContent from '../../components/settings/TermsOfServiceContent';

export default function TermsOfServiceScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('tos_title')} />
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

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import TermsOfUseContent from '../../components/settings/TermsOfUseContent';

export default function TermsOfUseScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('tou_title')} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TermsOfUseContent />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
});

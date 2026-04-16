import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import PrivacyPolicyContent from '../../components/privacyPolicy/PrivacyPolicyContent';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('privacy_screen_header')} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <PrivacyPolicyContent />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
});

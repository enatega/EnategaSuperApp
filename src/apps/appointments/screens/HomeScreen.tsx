import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../general/components/Header';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

export default function AppointmentsHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title={t('header_title')} subtitle={t('header_subtitle')} />
        <View style={styles.content}>
          <Text>{t('home_body')}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

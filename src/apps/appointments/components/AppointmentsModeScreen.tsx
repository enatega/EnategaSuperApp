import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Header from '../../../general/components/Header';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';

type ModeKey = 'single_vendor_label' | 'multi_vendor_label' | 'chain_label';
type ScreenKey = 'tab_home' | 'tab_search' | 'tab_bookings' | 'tab_profile' | 'screen_details';

type Props = {
  modeKey: ModeKey;
  screenKey: ScreenKey;
};

export default function AppointmentsModeScreen({ modeKey, screenKey }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');

  const modeLabel = t(modeKey);
  const screenLabel = t(screenKey);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header
          title={t('mode_screen_title', { mode: modeLabel, screen: screenLabel })}
          subtitle={t('mode_screen_subtitle', { mode: modeLabel })}
        />
        <View style={styles.content}>
          <Text>{t('mode_screen_body', { mode: modeLabel, screen: screenLabel })}</Text>
          <Text style={styles.note}>{t('mode_screen_note')}</Text>
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
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  note: {
    opacity: 0.75,
  },
});

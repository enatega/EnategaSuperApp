import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SettingsItem from '../../components/settings/SettingsItem';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList, 'RulesAndTerms'>;

export default function RulesAndTermsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('settings_terms')}
          </Text>
          <Text variant="body" color={colors.mutedText}>
            {t('settings_terms_conditions_subtitle')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.backgroundTertiary }]}>
          <SettingsItem
            title={t('settings_terms_conditions')}
            onPress={() => navigation.navigate('TermsAndConditions')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
           <SettingsItem
            title={t('settings_privacy')}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsItem
            title={t('settings_licences')}
            onPress={() => navigation.navigate('Licences')}
          /> 
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
    gap: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  divider: {
    height: 1,
  },
});

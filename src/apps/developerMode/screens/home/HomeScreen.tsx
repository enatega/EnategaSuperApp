import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';

type RideSharingStackParamList = {
  RideSharingHome: undefined;
  RideDetails: undefined;
  DriverProfile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList, 'RideSharingHome'>;


export default function DeveloperModeHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
 
  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top + 8, 20) }]}>
      <Header title={t('developer_mode')} subtitle="System tools & diagnostics" />
      <Text variant="body" color={colors.mutedText}>
        Welcome to Developer Mode. Additional diagnostic tools will be available here soon.
      </Text>
       <Button
           label={t('driver_profile_button')}
           onPress={() => navigation.navigate('DriverProfile')}
           style={styles.button}
      />
        <Button
           label={t('Auth flow')}
           onPress={() => navigation.navigate('Auth')}
           style={styles.button}
         />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  button: {
    marginTop: 8,
  },
});

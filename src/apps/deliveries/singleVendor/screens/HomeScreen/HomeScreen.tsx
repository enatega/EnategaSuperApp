import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../../general/components/Button';
import Header from '../../../../../general/components/Header';
import Text from '../../../../../general/components/Text';
import { showToast } from '../../../../../general/components/AppToast';
import { useAppLogout } from '../../../../../general/hooks/useAppLogout';
import { useTheme } from '../../../../../general/theme/theme';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const logoutMutation = useAppLogout({
    onError: (error) => {
      showToast.error(
        t('single_vendor_logout_error_title'),
        error?.message ?? t('single_vendor_logout_error_message'),
      );
    },
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 20,
        },
      ]}
    >
      <Header title={t('single_vendor_title')} subtitle={t('single_vendor_home_subtitle')} />
      <View style={styles.content}>
        <Text>{t('single_vendor_home_body')}</Text>
        <Button
          label={t('logout')}
          variant="danger"
          onPress={() => logoutMutation.mutate()}
          isLoading={logoutMutation.isPending}
          disabled={logoutMutation.isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  content: {
    gap: 16,
  },
});

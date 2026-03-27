import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../../../general/components/Header';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { showToast } from '../../../../general/components/AppToast';
import { useAppLogout } from '../../../../general/hooks/useAppLogout';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

export default function ChainHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const logoutMutation = useAppLogout({
    onError: (error) => {
      showToast.error('Error', error?.message ?? 'Unable to logout right now');
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Header title={t('chain_title')} subtitle={t('chain_home_subtitle')} />
      <View style={styles.content}>
        <Text>{t('chain_home_body')}</Text>
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
    padding: 20,
  },
  content: {
    gap: 16,
  },
});

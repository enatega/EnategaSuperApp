import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useAppLogout } from '../../../../general/hooks/useAppLogout';
import { useTheme } from '../../../../general/theme/theme';

type Props = Record<string, never>;

export default function HomeScreen({}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const logoutMutation = useAppLogout({
    onError: (error) => {
      showToast.error(
        t('chain_logout_error_title'),
        error?.message ?? t('chain_logout_error_message'),
      );
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* <Text>{t('chain_tab_home')}</Text> */}
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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    gap: 16,
    width: '100%',
  },
});

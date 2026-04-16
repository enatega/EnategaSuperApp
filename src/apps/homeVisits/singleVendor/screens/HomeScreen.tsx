import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showToast } from '../../../../general/components/AppToast';
import Button from '../../../../general/components/Button';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import { useAppLogout } from '../../../../general/hooks/useAppLogout';
import { useTheme } from '../../../../general/theme/theme';
import SingleVendorSpecialOffersBanner from '../components/HomeScreen/SingleVendorSpecialOffersBanner';

type Props = Record<string, never>;

export default function SingleVendorHomeScreen({}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("homeVisits");
  const insets = useSafeAreaInsets();

  const logoutMutation = useAppLogout({
    onError: (error) => {
      showToast.error(
        t("logout_error_title"),
        error?.message ?? t("logout_error_message"),
      );
    },
  });

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <Header
        subtitle={t('single_vendor_desc')}
        title={t('single_vendor_tab_home')}
      />
      <SingleVendorSpecialOffersBanner />
      <View style={styles.body}>
        <Text>{t('single_vendor_home_body')}</Text>
        <Button
          disabled={logoutMutation.isPending}
          isLoading={logoutMutation.isPending}
          label={t('logout')}
          onPress={() => logoutMutation.mutate()}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 28,
  },
  body: {
    gap: 16,
    paddingHorizontal: 20,
  },
  scroll: {
    flex: 1,
  },
});

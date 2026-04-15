import React from 'react';
import { useTranslation } from 'react-i18next';
import ModePlaceholderScreen from '../../components/ModePlaceholderScreen';

type Props = {
  bodyKey:
    | 'home_visits_settings_body'
    | 'home_visits_support_body'
    | 'home_visits_wallet_body';
  titleKey:
    | 'settings_title'
    | 'profile_menu_support'
    | 'profile_wallet_balance';
};

export default function HomeVisitsFeaturePlaceholderScreen({
  bodyKey,
  titleKey,
}: Props) {
  const { t } = useTranslation(['general', 'homeVisits']);

  return (
    <ModePlaceholderScreen
      body={t(bodyKey, { ns: 'homeVisits' })}
      title={t(titleKey, { ns: 'general' })}
    />
  );
}

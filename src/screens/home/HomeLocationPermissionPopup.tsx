import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../general/theme/theme';
import AppPopup from '../../general/components/AppPopup';
import LocationPermissionIllustration from './LocationPermissionIllustration';

export type LocationPopupMode = 'request' | 'denied' | 'blocked';

type Props = {
  visible: boolean;
  mode: LocationPopupMode;
  isLoading?: boolean;
  onRequestLocation: () => void;
  onOpenSettings: () => void;
  onDismiss: () => void;
};

export default function HomeLocationPermissionPopup({
  visible,
  mode,
  isLoading = false,
  onRequestLocation,
  onOpenSettings,
  onDismiss,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  const title =
    mode === 'blocked'
      ? t('location_popup_blocked_title')
      : mode === 'denied'
        ? t('location_popup_denied_title')
        : t('location_popup_title');

  const description =
    mode === 'blocked'
      ? t('location_popup_blocked_description')
      : mode === 'denied'
        ? t('location_popup_denied_description')
        : t('location_popup_description');

  const primaryLabel =
    mode === 'blocked'
      ? t('location_popup_open_settings')
      : mode === 'denied'
        ? t('location_popup_try_again')
        : t('location_popup_enable');

  return (
    <AppPopup
      visible={visible}
      title={title}
      description={description}
      onRequestClose={onDismiss}
      illustration={<LocationPermissionIllustration />}
      primaryAction={{
        label: primaryLabel,
        onPress: mode === 'blocked' ? onOpenSettings : onRequestLocation,
        isLoading,
      }}
      secondaryAction={{
        label: t('location_popup_later'),
        onPress: onDismiss,
        variant: 'secondary',
        style: {
          backgroundColor: colors.backgroundTertiary,
          borderColor: colors.backgroundTertiary,
        },
      }}
    />
  );
}

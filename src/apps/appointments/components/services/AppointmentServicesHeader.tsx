import React from 'react';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import AppointmentDetailsCircleButton from '../details/AppointmentDetailsCircleButton';

type Props = {
  onBackPress: () => void;
  onRightPress?: () => void;
  rightIcon?: string;
  rightLabel?: string;
  title: string;
};

export default function AppointmentServicesHeader({
  onBackPress,
  onRightPress,
  rightIcon,
  rightLabel,
  title,
}: Props) {
  const { t } = useTranslation('appointments');

  return (
    <ScreenHeader
      onBack={onBackPress}
      rightSlot={
        onRightPress && rightIcon && rightLabel ? (
          <AppointmentDetailsCircleButton
            icon={rightIcon}
            label={rightLabel}
            onPress={onRightPress}
          />
        ) : null
      }
      showBack
      title={title}
    />
  );
}

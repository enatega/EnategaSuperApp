import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import DateTimePickerBottomSheet from '../../../../../general/components/dateTimePicker/DateTimePickerBottomSheet';

type Props = {
  visible: boolean;
  value: Date | null;
  onClose: () => void;
  onConfirm: (date: Date) => void;
};

function RideScheduleBottomSheet({
  onClose,
  onConfirm,
  value,
  visible,
}: Props) {
  const { t } = useTranslation('rideSharing');

  return (
    <DateTimePickerBottomSheet
      confirmLabel={t('ride_schedule_set_pickup_time')}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('ride_schedule_label')}
      value={value}
      visible={visible}
    />
  );
}

export default memo(RideScheduleBottomSheet);

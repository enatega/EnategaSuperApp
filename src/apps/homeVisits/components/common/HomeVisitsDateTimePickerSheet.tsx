import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import DateTimePickerBottomSheet from '../../../../general/components/dateTimePicker/DateTimePickerBottomSheet';

type Props = {
  visible: boolean;
  value: Date | null;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  isConfirmLoading?: boolean;
};

function HomeVisitsDateTimePickerSheet({
  isConfirmLoading = false,
  onClose,
  onConfirm,
  value,
  visible,
}: Props) {
  const { t } = useTranslation('homeVisits');

  return (
    <DateTimePickerBottomSheet
      confirmLabel={t('team_schedule_date_time_confirm')}
      isConfirmLoading={isConfirmLoading}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('team_schedule_date_time_title')}
      todayLabel={t('team_schedule_today')}
      value={value}
      visible={visible}
    />
  );
}

export default memo(HomeVisitsDateTimePickerSheet);

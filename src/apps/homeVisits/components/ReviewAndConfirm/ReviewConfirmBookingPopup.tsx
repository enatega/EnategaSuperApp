import React, { memo } from 'react';
import AppPopup from '../../../../general/components/AppPopup';

type Props = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  isConfirmLoading?: boolean;
};

function ReviewConfirmBookingPopup({
  confirmLabel,
  description,
  isConfirmLoading = false,
  onClose,
  onConfirm,
  title,
  visible,
}: Props) {
  return (
    <AppPopup
      containerStyle={{ borderRadius: 12, maxWidth: 361, paddingBottom: 16, paddingTop: 16 }}
      description={description}
      dismissOnOverlayPress
      onRequestClose={onClose}
      primaryAction={{
        label: confirmLabel,
        onPress: onConfirm,
        isLoading: isConfirmLoading,
        disabled: isConfirmLoading,
        style: { backgroundColor: '#FC9401', borderColor: '#FC9401' },
      }}
      title={title}
      visible={visible}
    />
  );
}

export default memo(ReviewConfirmBookingPopup);

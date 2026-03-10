import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import Button from '../../../../general/components/Button';

type Props = {
  message?: string | null;
  onRetry?: () => void;
};

function RideOptionsBottomSheetError({ message, onRetry }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={styles.errorWrap}>
      <View
        style={[
          styles.errorCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={[styles.errorIconWrap, { backgroundColor: colors.cardBlue }]}>
          <Icon type="Feather" name="alert-circle" size={22} color={colors.primary} />
        </View>
        <Text weight="semiBold" style={styles.errorTitle}>
          {t('ride_types_error_title')}
        </Text>
        <Text style={[styles.errorDescription, { color: colors.mutedText }]}>
          {message || t('ride_types_error_description')}
        </Text>
        <Button
          label={t('ride_types_retry')}
          onPress={onRetry}
          style={styles.retryButton}
        />
      </View>
    </View>
  );
}

export default memo(RideOptionsBottomSheetError);

const styles = StyleSheet.create({
  errorWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  errorIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDescription: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  retryButton: {
    alignSelf: 'stretch',
    borderRadius: 8,
    backgroundColor: '#1691BF',
    borderColor: '#1691BF',
  },
});

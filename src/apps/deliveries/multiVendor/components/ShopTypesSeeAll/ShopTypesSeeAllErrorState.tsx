import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../general/components/Button';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  isRetrying?: boolean;
  onRetry: () => void;
};

export default function ShopTypesSeeAllErrorState({
  isRetrying = false,
  onRetry,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: colors.backgroundTertiary,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          color={colors.primary}
          name="cloud-offline-outline"
          size={28}
        />
      </View>

      <Text color={colors.text} style={styles.title} weight="medium">
        {t('generic_list_error_title')}
      </Text>

      <Text color={colors.mutedText} style={styles.description}>
        {t('generic_list_error_description')}
      </Text>

      <Button
        isLoading={isRetrying}
        label={t('generic_list_retry')}
        onPress={onRetry}
        style={styles.retryButton}
        disabled={isRetrying}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    marginBottom: 16,
    width: 56,
  },
  retryButton: {
    marginTop: 20,
    minWidth: 160,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
});

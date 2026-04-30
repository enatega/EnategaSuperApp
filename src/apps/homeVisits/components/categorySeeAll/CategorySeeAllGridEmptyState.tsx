import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import Svg from '../Svg';

export default function CategorySeeAllGridEmptyState() {
  const { t } = useTranslation('general');
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Svg name="noResultsFound" />
      </View>

      <Text
        weight="bold"
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          },
        ]}
      >
        {t('generic_list_empty_title')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
  },
});

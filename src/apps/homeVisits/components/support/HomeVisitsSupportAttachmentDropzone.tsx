import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onPress?: () => void;
};

export default function HomeVisitsSupportAttachmentDropzone({ onPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');

  return (
    <View style={[styles.outer, { borderColor: colors.border }]}>
      <View style={[styles.inner, { backgroundColor: colors.surfaceSoft }]}>
        <Ionicons color={colors.iconColor} name="cloud-upload-outline" size={24} />

        <View style={styles.copy}>
          <Text
            color={colors.text}
            style={{ fontSize: typography.size.lg, lineHeight: 28 }}
            weight="semiBold"
          >
            {t('home_visits_support_form_attach_title')}
          </Text>
          <Text
            color={colors.mutedText}
            style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
          >
            {t('home_visits_support_form_attach_description')}
          </Text>
        </View>

        <Button
          label={t('home_visits_support_form_attach_cta')}
          onPress={onPress}
          style={styles.button}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 32,
    paddingVertical: 0,
  },
  copy: {
    alignItems: 'center',
    gap: 2,
  },
  inner: {
    alignItems: 'center',
    borderRadius: 8,
    gap: 23,
    height: 220,
    justifyContent: 'center',
    width: '100%',
  },
  outer: {
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
});


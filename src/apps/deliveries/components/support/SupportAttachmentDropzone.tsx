import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onPress?: () => void;
};

export default function SupportAttachmentDropzone({ onPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={[styles.outer, { borderColor: colors.border }]}>
      <View style={[styles.inner, { backgroundColor: colors.surfaceSoft }]}>
        <Ionicons name="cloud-upload-outline" size={24} color={colors.iconColor} />

        <View style={styles.copy}>
          <Text
            color={colors.text}
            weight="semiBold"
            style={{ fontSize: typography.size.lg, lineHeight: 28 }}
          >
            {t('support_form_attach_title')}
          </Text>
          <Text
            color={colors.mutedText}
            style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
          >
            {t('support_form_attach_description')}
          </Text>
        </View>

        <Button
          label={t('support_form_attach_cta')}
          onPress={onPress}
          variant="secondary"
          style={styles.button}
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

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onPress?: () => void;
  selectedFileNames?: string[];
};

export default function SupportAttachmentDropzone({
  onPress,
  selectedFileNames = [],
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const hasSelectedFiles = selectedFileNames.length > 0;

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

        {hasSelectedFiles ? (
          <View style={styles.fileList}>
            {selectedFileNames.map((fileName) => (
              <Text
                key={fileName}
                color={colors.mutedText}
                numberOfLines={1}
                style={styles.fileName}
              >
                {fileName}
              </Text>
            ))}
          </View>
        ) : null}
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
  fileList: {
    alignItems: 'center',
    gap: 2,
    maxWidth: '86%',
  },
  fileName: {
    textAlign: 'center',
  },
  inner: {
    alignItems: 'center',
    borderRadius: 8,
    gap: 16,
    minHeight: 220,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
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

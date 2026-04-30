import React, { memo, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import Button from '../../../../general/components/Button';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  visible: boolean;
  initialCode?: string;
  onClose: () => void;
  onApply: (code: string) => void;
};

function ReviewDiscountCodeBottomSheet({
  initialCode,
  onApply,
  onClose,
  visible,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState(initialCode ?? '');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCode(initialCode ?? '');
  }, [initialCode, visible]);

  if (!visible) {
    return null;
  }

  const trimmedCode = code.trim();

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <SwipeableBottomSheet
        modal
        collapsedHeight={0}
        expandedHeight={300 + Math.max(insets.bottom, 16)}
        handle={<BottomSheetHandle color={colors.border} />}
        onCollapsed={onClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text
            weight="bold"
            style={{
              color: colors.text,
              flex: 1,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg,
              textAlign: 'center',
            }}
          >
            {t('review_confirm_discount_title')}
          </Text>

          <Pressable
            hitSlop={12}
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Ionicons name="close" size={16} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <TextInput
            placeholder={t('review_confirm_discount_placeholder')}
            placeholderTextColor={colors.iconMuted}
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              },
            ]}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            label={t('review_confirm_discount_use_code')}
            disabled={!trimmedCode}
            onPress={() => {
              if (!trimmedCode) {
                return;
              }

              onApply(trimmedCode);
            }}
            style={!trimmedCode ? { backgroundColor: colors.backgroundTertiary, borderColor: colors.backgroundTertiary } : undefined}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(ReviewDiscountCodeBottomSheet);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  content: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
});

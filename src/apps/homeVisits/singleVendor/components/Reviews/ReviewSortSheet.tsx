import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

export type ReviewSortOption = 'latest' | 'best' | 'worst';

type Props = {
  visible: boolean;
  selectedSort: ReviewSortOption;
  onClose: () => void;
  onSelectSort: (option: ReviewSortOption) => void;
};

const SORT_OPTIONS: ReviewSortOption[] = ['latest', 'best', 'worst'];

function ReviewSortSheet({
  visible,
  selectedSort,
  onClose,
  onSelectSort,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable
        onPress={onClose}
        style={[styles.overlay, { backgroundColor: 'rgba(9, 9, 11, 0.30)' }]}
      >
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
          }}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 18,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.lg2,
              }}
              weight="bold"
            >
              {t('single_vendor_reviews_sort_by')}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
            >
              <MaterialCommunityIcons
                color={colors.text}
                name="close"
                size={16}
              />
            </Pressable>
          </View>

          {SORT_OPTIONS.map((option) => {
            const isSelected = selectedSort === option;
            return (
              <Pressable
                accessibilityRole="button"
                key={option}
                onPress={() => {
                  onSelectSort(option);
                  onClose();
                }}
                style={[
                  styles.optionRow,
                  isSelected ? { backgroundColor: colors.surfaceSoft } : { backgroundColor: colors.background },
                ]}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: typography.size.sm2,
                    lineHeight: typography.lineHeight.md,
                  }}
                  weight="medium"
                >
                  {t(`single_vendor_reviews_${option}`)}
                </Text>
                {isSelected ? (
                  <MaterialCommunityIcons
                    color={colors.iconMuted}
                    name="check"
                    size={16}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 32,
    opacity: 0,
    width: 32,
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});

export default React.memo(ReviewSortSheet);

import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import BottomSheetHandle from '../BottomSheetHandle';
import Text from '../Text';
import SwipeableBottomSheet from '../SwipeableBottomSheet';
import { useTheme } from '../../theme/theme';
import type { SupportAdminRecord } from './types';
import SupportAdminPickerItem from './SupportAdminPickerItem';

type Props = {
  admins: SupportAdminRecord[];
  isVisible: boolean;
  isLoading?: boolean;
  title: string;
  subtitle: string;
  loadingLabel: string;
  emptyLabel: string;
  rowSubtitle: string;
  onClose: () => void;
  onSelectAdmin: (admin: SupportAdminRecord) => void;
};

export default function SupportAdminPickerBottomSheet({
  admins,
  isVisible,
  isLoading = false,
  title,
  subtitle,
  loadingLabel,
  emptyLabel,
  rowSubtitle,
  onClose,
  onSelectAdmin,
}: Props) {
  const { colors, typography } = useTheme();
  const { height } = useWindowDimensions();
  const expandedHeight = useMemo(() => Math.min(height * 0.72, 560), [height]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={[styles.backdrop, { backgroundColor: colors.overlayDark20 }]} onPress={onClose} />

      <SwipeableBottomSheet
        collapsedHeight={0}
        expandedHeight={expandedHeight}
        handle={<BottomSheetHandle color={colors.border} />}
        initialState="expanded"
        onStateChange={(state) => {
          if (state === 'collapsed') {
            onClose();
          }
        }}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.header}>
          <Text
            color={colors.text}
            style={{ fontSize: typography.size.xl2, lineHeight: typography.lineHeight.xl2 }}
            weight="extraBold"
          >
            {title}
          </Text>
          <Text
            color={colors.mutedText}
            style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
          >
            {subtitle}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text color={colors.mutedText}>{loadingLabel}</Text>
          </View>
        ) : admins.length === 0 ? (
          <View style={styles.centerState}>
            <Text color={colors.mutedText}>{emptyLabel}</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {admins.map((admin) => (
              <SupportAdminPickerItem
                image={admin.image}
                key={admin.id}
                name={admin.name}
                onPress={() => onSelectAdmin(admin)}
                subtitle={rowSubtitle}
              />
            ))}
          </ScrollView>
        )}
      </SwipeableBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  centerState: {
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    minHeight: 220,
    paddingHorizontal: 24,
  },
  header: {
    gap: 6,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  listContent: {
    gap: 12,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    paddingTop: 12,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
});

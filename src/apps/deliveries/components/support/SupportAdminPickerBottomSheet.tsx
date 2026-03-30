import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Text from '../../../../general/components/Text';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import { useTheme } from '../../../../general/theme/theme';
import type { SupportAdminRecord } from '../../api/supportChatTypes';
import SupportAdminPickerItem from './SupportAdminPickerItem';

type Props = {
  admins: SupportAdminRecord[];
  isLoading?: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSelectAdmin: (admin: SupportAdminRecord) => void;
  title: string;
  subtitle: string;
  loadingLabel: string;
  emptyLabel: string;
  rowSubtitle: string;
};

export default function SupportAdminPickerBottomSheet({
  admins,
  isLoading = false,
  isVisible,
  onClose,
  onSelectAdmin,
  title,
  subtitle,
  loadingLabel,
  emptyLabel,
  rowSubtitle,
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
        expandedHeight={expandedHeight}
        collapsedHeight={0}
        initialState="expanded"
        onStateChange={(state) => {
          if (state === 'collapsed') {
            onClose();
          }
        }}
        handle={<View style={[styles.handle, { backgroundColor: colors.border }]} />}
        handleContainerStyle={styles.handleContainer}
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
            weight="extraBold"
            style={{ fontSize: typography.size.xl2, lineHeight: typography.lineHeight.xl2 }}
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
            <ActivityIndicator size="large" color={colors.primary} />
            <Text color={colors.mutedText}>{loadingLabel}</Text>
          </View>
        ) : admins.length === 0 ? (
          <View style={styles.centerState}>
            <Text color={colors.mutedText}>{emptyLabel}</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {admins.map((admin) => (
              <SupportAdminPickerItem
                key={admin.id}
                image={admin.image}
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
  handle: {
    borderRadius: 999,
    height: 4,
    width: 40,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
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

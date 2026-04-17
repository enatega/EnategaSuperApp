import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import BottomSheetHandle from '../../../components/BottomSheetHandle';
import Icon from '../../../components/Icon';
import Text from '../../../components/Text';
import SwipeableBottomSheet from '../../../components/SwipeableBottomSheet';
import { useTheme } from '../../../theme/theme';
import MapStoreCard from './MapStoreCard';
import type { SeeAllMapStore } from './mapStoreUtils';

const SHEET_HEIGHT = Math.min(Dimensions.get('window').height * 0.42, 360);

type Props = {
  store: SeeAllMapStore | null;
  onClose: () => void;
  onViewStore: () => void;
  title: string;
  ctaLabel: string;
  closeLabel: string;
  currencyLabel?: string;
};

export default function MapStoreBottomSheet({
  store,
  onClose,
  onViewStore,
  title,
  ctaLabel,
  closeLabel,
  currencyLabel,
}: Props) {
  const { colors, typography } = useTheme();

  if (!store) {
    return null;
  }

  return (
    <SwipeableBottomSheet
      expandedHeight={SHEET_HEIGHT}
      collapsedHeight={0}
      initialState="expanded"
      modal
      onCollapsed={onClose}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<BottomSheetHandle color={colors.border} />}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.placeholder} />
          <Text
            weight="extraBold"
            style={{
              fontSize: typography.size.h5,
              lineHeight: typography.lineHeight.h5,
            }}
          >
            {title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
            hitSlop={12}
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor: colors.backgroundTertiary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Icon type="Entypo" name="cross" size={18} color={colors.text} />
          </Pressable>
        </View>

        <MapStoreCard store={store} currencyLabel={currencyLabel} />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Button label={ctaLabel} onPress={onViewStore} style={styles.button} />
      </View>
    </SwipeableBottomSheet>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    width: '100%',
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 16,
    elevation: 8,
    height: 32,
    justifyContent: 'center',
    position: 'relative',
    width: 32,
    zIndex: 8,
  },
  content: {
    flex: 1,
    gap: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
  },
  headerRow: {
    alignItems: 'center',
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 8,
  },
  placeholder: {
    width: 32,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});

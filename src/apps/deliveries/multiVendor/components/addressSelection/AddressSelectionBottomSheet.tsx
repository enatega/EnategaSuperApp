import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../../general/components/Icon';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { ProfileAddress } from '../../api/profileService';
import SavedAddressesList from './SavedAddressesList';

type Props = {
  addresses: ProfileAddress[];
  isLoading?: boolean;
  isVisible: boolean;
  onAddAddress: () => void;
  onClose: () => void;
  onSelectAddress: (address: ProfileAddress) => void;
  onUseCurrentLocation: () => void;
  selectedAddressId?: string;
};

const BASE_CONTENT_HEIGHT = 180;
const ADDRESS_ROW_ESTIMATE = 68;
const MAX_VISIBLE_ADDRESS_ROWS = 4;

export default function AddressSelectionBottomSheet({
  addresses,
  isLoading = false,
  isVisible,
  onAddAddress,
  onClose,
  onSelectAddress,
  onUseCurrentLocation,
  selectedAddressId,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const expandedHeight = useMemo(() => {
    const estimatedContentHeight =
      BASE_CONTENT_HEIGHT +
      Math.min(addresses.length, MAX_VISIBLE_ADDRESS_ROWS) *
        ADDRESS_ROW_ESTIMATE +
      Math.max(insets.bottom, 16);

    return Math.min(height * 0.75, Math.max(280, estimatedContentHeight));
  }, [addresses.length, height, insets.bottom]);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={isVisible}
    >
      <View style={styles.overlay}>
        <Pressable
          onPress={onClose}
          style={[styles.backdrop, { backgroundColor: colors.overlayDark20 }]}
        />

        <SwipeableBottomSheet
          collapsedHeight={0}
          expandedHeight={expandedHeight}
          handle={
            <View
              style={[styles.hiddenHandle, { backgroundColor: colors.border }]}
            />
          }
          handleContainerStyle={styles.handleContainer}
          initialState="expanded"
          modal
          onCollapsed={onClose}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerSpacer} />

            <Text
              weight="extraBold"
              style={{
                fontSize: typography.size.h5,
                lineHeight: typography.lineHeight.h5,
              }}
            >
              {t('address_selector_title')}
            </Text>

            <Pressable
              accessibilityLabel={t('address_selector_close')}
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: colors.backgroundTertiary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Icon
                color={colors.text}
                name="close"
                size={18}
                type="Ionicons"
              />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Math.max(insets.bottom, 16) + 12 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              accessibilityLabel={t('address_selector_use_current_location')}
              accessibilityRole="button"
              onPress={onUseCurrentLocation}
              style={({ pressed }) => [
                styles.currentLocationRow,
                {
                  backgroundColor: pressed ? colors.gray100 : 'transparent',
                },
              ]}
            >
              <Icon
                color={colors.text}
                name="map-outline"
                size={20}
                type="Ionicons"
              />
              <Text
                weight="medium"
                style={{
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {t('address_selector_use_current_location')}
              </Text>
            </Pressable>

            {isLoading ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color={colors.primary} size="small" />
              </View>
            ) : null}

            <SavedAddressesList
              addAddressLabel={t('address_selector_add_new')}
              addresses={addresses}
              onAddAddress={onAddAddress}
              onSelectAddress={onSelectAddress}
              selectedAddressId={selectedAddressId}
              variant="compact"
            />
          </ScrollView>
        </SwipeableBottomSheet>
      </View>
    </Modal>
  );
}

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
    gap: 8,
    paddingHorizontal: 16,
  },
  currentLocationRow: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 6,
    paddingTop: 4,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  hiddenHandle: {
    borderRadius: 999,
    height: 4,
    opacity: 0.12,
    width: 36,
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    paddingTop: 4,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
});

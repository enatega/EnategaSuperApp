import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { ProfileAddress } from '../../api/profileService';
import { formatDeliveryAddressLabel } from '../../../utils/address';
import MyProfileAddressCard from '../profile/MyProfileAddressCard';
import SavedAddressListRow from './SavedAddressListRow';
import {
  getSavedAddressIcon,
  getSavedAddressTypeLabel,
} from '../../utils/savedAddressPresentation';

type Props = {
  addAddressLabel: string;
  addresses: ProfileAddress[];
  onAddAddress: () => void;
  onAddressMenuPress?: (address: ProfileAddress) => void;
  onSelectAddress: (address: ProfileAddress) => void;
  selectedAddressId?: string;
  variant?: 'cards' | 'compact';
};

export default function SavedAddressesList({
  addAddressLabel,
  addresses,
  onAddAddress,
  onAddressMenuPress,
  onSelectAddress,
  selectedAddressId,
  variant = 'cards',
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const isCompact = variant === 'compact';

  return (
    <View style={isCompact ? styles.compactList : styles.cardList}>
      {addresses.map((address) => {
        const typeLabel = getSavedAddressTypeLabel(address.type, t);
        const iconName = getSavedAddressIcon(address.type);
        const isSelected = selectedAddressId === address.id;

        if (isCompact) {
          return (
            <SavedAddressListRow
              key={address.id}
              address={address.address}
              iconName={iconName}
              isSelected={isSelected}
              onPress={() => onSelectAddress(address)}
              typeLabel={typeLabel}
            />
          );
        }

        return (
          <MyProfileAddressCard
            key={address.id}
            address={formatDeliveryAddressLabel({
              address: address.address,
              locationName: address.location_name,
            })}
            iconName={iconName}
            isSelected={isSelected}
            onMenuPress={
              onAddressMenuPress
                ? () => onAddressMenuPress(address)
                : undefined
            }
            onPress={() => onSelectAddress(address)}
            typeLabel={typeLabel}
          />
        );
      })}

      <Pressable
        accessibilityLabel={addAddressLabel}
        accessibilityRole="button"
        onPress={onAddAddress}
        style={({ pressed }) => [
          isCompact ? styles.compactAddButton : styles.cardAddButton,
          {
            backgroundColor: isCompact ? 'transparent' : colors.surface,
            borderColor: isCompact ? 'transparent' : colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Ionicons
          color={isCompact ? colors.mutedText : colors.text}
          name="add"
          size={20}
        />
        <Text
          weight="medium"
          style={[
            styles.addButtonText,
            {
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            },
          ]}
        >
          {addAddressLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButtonText: {
    letterSpacing: 0,
  },
  cardAddButton: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardList: {
    gap: 12,
  },
  compactAddButton: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  compactList: {
    gap: 4,
  },
});

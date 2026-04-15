import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Text from '../../components/Text';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { useTheme } from '../../theme/theme';
import { addressService } from '../../api/addressService';
import useAddressPredictions from '../../hooks/useAddressPredictions';
import type { AddressPayload, AddressType } from '../../api/addressService';
import AddressSuggestionItem from './AddressSuggestionItem';
import AddressSuggestionSkeleton from './AddressSuggestionSkeleton';
import AddressTypeSelector from './AddressTypeSelector';

export type AddressDetailFormHandle = {
  submit: () => Promise<void>;
  isSaving: boolean;
};

type Props = {
  address: string;
  latitude: number;
  longitude: number;
  initialLocationName?: string;
  initialType?: AddressType;
  onSave: (data: AddressPayload) => Promise<void>;
  labels: {
    locationNamePlaceholder: string;
    addressDetailsLabel: string;
    locationTypeLabel: string;
    home: string;
    apartment: string;
    office: string;
    other: string;
  };
};

const AddressDetailFormInner = forwardRef<AddressDetailFormHandle, Props>(
  function AddressDetailForm(
    {
      address,
      latitude,
      longitude,
      initialLocationName = '',
      initialType = 'HOME',
      onSave,
      labels,
    },
    ref,
  ) {
    const { colors, typography } = useTheme();
    const [editableAddress, setEditableAddress] = useState(address);
    const [currentLat, setCurrentLat] = useState(latitude);
    const [currentLng, setCurrentLng] = useState(longitude);
    const [locationName, setLocationName] = useState(initialLocationName);
    const [addressType, setAddressType] = useState<AddressType>(initialType);
    const [isSaving, setIsSaving] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);

    const debouncedAddress = useDebouncedValue(editableAddress.trim(), 800);
    const predictionsQuery = useAddressPredictions(
      debouncedAddress,
      showPredictions && debouncedAddress.length > 0,
    );
    const isWaiting = showPredictions && editableAddress.trim() !== debouncedAddress;
    const isShowingSkeleton =
      showPredictions && (isWaiting || predictionsQuery.isFetching);
    const suggestions = predictionsQuery.data ?? [];

    const handleAddressChange = useCallback((text: string) => {
      setEditableAddress(text);
      setShowPredictions(true);
    }, []);

    const handleSelectSuggestion = useCallback(
      async (placeId: string, description: string) => {
        setEditableAddress(description);
        setShowPredictions(false);

        try {
          const coords = await addressService.getPlaceDetails(placeId);
          setCurrentLat(Number(coords.lat));
          setCurrentLng(Number(coords.lng));
        } catch {
          // Keep the selected text and let the user retry if needed.
        }
      },
      [],
    );

    const handleSave = useCallback(async () => {
      if (isSaving) {
        return;
      }

      setIsSaving(true);
      try {
        await onSave({
          address: editableAddress.trim() || address,
          latitude: currentLat,
          longitude: currentLng,
          type: addressType,
          location_name: locationName.trim(),
        });
      } finally {
        setIsSaving(false);
      }
    }, [
      address,
      addressType,
      currentLat,
      currentLng,
      editableAddress,
      isSaving,
      locationName,
      onSave,
    ]);

    useImperativeHandle(
      ref,
      () => ({ submit: handleSave, isSaving }),
      [handleSave, isSaving],
    );

    return (
      <View style={styles.container}>
        <View style={styles.addressSection}>
          <TextInput
            style={[
              styles.addressInput,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                fontSize: typography.size.md2,
              },
            ]}
            value={editableAddress}
            onChangeText={handleAddressChange}
            multiline
            accessibilityLabel={address}
          />
          {isShowingSkeleton ? (
            <AddressSuggestionSkeleton />
          ) : showPredictions && suggestions.length > 0 ? (
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              style={[
                styles.suggestionsList,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {suggestions.map((item) => (
                <AddressSuggestionItem
                  key={item.place_id}
                  description={item.description}
                  onPress={() =>
                    handleSelectSuggestion(item.place_id, item.description)
                  }
                />
              ))}
            </ScrollView>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text weight="semiBold" style={styles.fieldLabel}>
            {labels.addressDetailsLabel}
          </Text>
          <TextInput
            style={[
              styles.nameInput,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                fontSize: typography.size.md2,
              },
            ]}
            placeholder={labels.locationNamePlaceholder}
            placeholderTextColor={colors.mutedText}
            value={locationName}
            onChangeText={setLocationName}
            accessibilityLabel={labels.locationNamePlaceholder}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text weight="semiBold" style={styles.fieldLabel}>
            {labels.locationTypeLabel}
          </Text>
          <AddressTypeSelector
            selected={addressType}
            onSelect={setAddressType}
            labels={{
              home: labels.home,
              apartment: labels.apartment,
              office: labels.office,
              other: labels.other,
            }}
          />
        </View>
      </View>
    );
  },
);

const AddressDetailForm = memo(AddressDetailFormInner);

export default AddressDetailForm;

const styles = StyleSheet.create({
  addressInput: {
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    maxHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addressSection: {
    zIndex: 1,
  },
  container: { gap: 16 },
  fieldGroup: { gap: 8 },
  fieldLabel: {
    fontSize: 14,
    paddingHorizontal: 16,
  },
  nameInput: {
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },
  suggestionsList: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 0,
    borderWidth: 1,
    marginHorizontal: 16,
    maxHeight: 200,
  },
});

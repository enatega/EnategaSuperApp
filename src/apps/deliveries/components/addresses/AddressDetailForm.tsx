import React, { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import AddressTypeSelector from './AddressTypeSelector';
import AddressSuggestionItem from './AddressSuggestionItem';
import AddressSuggestionSkeleton from './AddressSuggestionSkeleton';
import type { AddressType } from '../../api/addressService';
import { addressService } from '../../api/addressService';
import useAddressPredictions from '../../hooks/useAddressPredictions';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';

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
  onSave: (data: {
    address: string;
    latitude: number;
    longitude: number;
    type: AddressType;
    location_name: string;
  }) => Promise<void>;
  labels: {
    locationNamePlaceholder: string;
    home: string;
    apartment: string;
    office: string;
    other: string;
  };
};

const AddressDetailFormInner = forwardRef<AddressDetailFormHandle, Props>(function AddressDetailForm(
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
  const predictionsQuery = useAddressPredictions(debouncedAddress, showPredictions && debouncedAddress.length > 0);
  const isWaiting = showPredictions && editableAddress.trim() !== debouncedAddress;
  const isShowingSkeleton = showPredictions && (isWaiting || predictionsQuery.isFetching);
  const suggestions = predictionsQuery.data ?? [];

  const handleAddressChange = useCallback((text: string) => {
    setEditableAddress(text);
    setShowPredictions(true);
  }, []);

  const handleSelectSuggestion = useCallback(async (placeId: string, description: string) => {
    setEditableAddress(description);
    setShowPredictions(false);
    try {
      const coords = await addressService.getPlaceDetails(placeId);
      setCurrentLat(Number(coords.lat));
      setCurrentLng(Number(coords.lng));
    } catch { /* user can retry */ }
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
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
  }, [isSaving, onSave, editableAddress, address, currentLat, currentLng, addressType, locationName]);

  useImperativeHandle(ref, () => ({ submit: handleSave, isSaving }), [handleSave, isSaving]);

  return (
    <View style={styles.container}>
      <View style={styles.addressSection}>
        <TextInput
          style={[
            styles.addressInput,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, fontSize: typography.size.md2 },
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
            style={[styles.suggestionsList, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            {suggestions.map((item) => (
              <AddressSuggestionItem
                key={item.place_id}
                description={item.description}
                onPress={() => handleSelectSuggestion(item.place_id, item.description)}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>

      <TextInput
        style={[
          styles.nameInput,
          { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, fontSize: typography.size.md2 },
        ]}
        placeholder={labels.locationNamePlaceholder}
        placeholderTextColor={colors.mutedText}
        value={locationName}
        onChangeText={setLocationName}
        accessibilityLabel={labels.locationNamePlaceholder}
      />

      <AddressTypeSelector
        selected={addressType}
        onSelect={setAddressType}
        labels={{ home: labels.home, apartment: labels.apartment, office: labels.office, other: labels.other }}
      />
    </View>
  );
});

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

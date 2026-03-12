import React, { memo, useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Button from '../../../../general/components/Button';
import AddressTypeSelector from './AddressTypeSelector';
import AddressSuggestionItem from './AddressSuggestionItem';
import AddressSuggestionSkeleton from './AddressSuggestionSkeleton';
import type { AddressType } from '../../api/addressService';
import { addressService } from '../../api/addressService';
import useAddressPredictions from '../../hooks/useAddressPredictions';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';

type Props = {
  address: string;
  latitude: number;
  longitude: number;
  initialLocationName?: string;
  initialType?: AddressType;
  isEditing?: boolean;
  onSave: (data: {
    address: string;
    latitude: number;
    longitude: number;
    type: AddressType;
    location_name: string;
  }) => Promise<void>;
  onDelete?: () => void;
  labels: {
    locationNamePlaceholder: string;
    home: string;
    apartment: string;
    office: string;
    other: string;
    save: string;
    update: string;
    delete: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    deleteCancel: string;
    deleteConfirm: string;
    noResults: string;
  };
};

function AddressDetailForm({
  address,
  latitude,
  longitude,
  initialLocationName = '',
  initialType = 'HOME',
  isEditing = false,
  onSave,
  onDelete,
  labels,
}: Props) {
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

  const handleSave = async () => {
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
  };

  const handleDelete = () => {
    Alert.alert(
      labels.deleteConfirmTitle,
      labels.deleteConfirmMessage,
      [
        { text: labels.deleteCancel, style: 'cancel' },
        { text: labels.deleteConfirm, style: 'destructive', onPress: onDelete },
      ],
    );
  };

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

      <View style={styles.actions}>
        <Button
          label={isEditing ? labels.update : labels.save}
          onPress={handleSave}
          isLoading={isSaving}
          style={styles.saveBtn}
        />
        {isEditing && onDelete ? (
          <Button
            label={labels.delete}
            variant="danger"
            onPress={handleDelete}
            style={styles.deleteBtn}
          />
        ) : null}
      </View>
    </View>
  );
}

export default memo(AddressDetailForm);

const styles = StyleSheet.create({
  actions: { gap: 12, paddingHorizontal: 16 },
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
  deleteBtn: { borderRadius: 6, minHeight: 44 },
  nameInput: {
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },
  saveBtn: { borderRadius: 6, minHeight: 44 },
  suggestionsList: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 0,
    borderWidth: 1,
    marginHorizontal: 16,
    maxHeight: 200,
  },
});

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
import type {
  AddressAdditionalFields,
  AddressPayload,
  AddressType,
} from '../../api/addressService';
import AddressSuggestionItem from './AddressSuggestionItem';
import AddressSuggestionSkeleton from './AddressSuggestionSkeleton';
import AddressTypeDetailsCard, {
  type AddressDetailValues,
} from './AddressTypeDetailsCard';
import AddressTypeSelector from './AddressTypeSelector';

export type AddressDetailFormHandle = {
  submit: () => Promise<void>;
  isSaving: boolean;
};

export type AddressDetailFormSubmitData = AddressPayload & {
  shouldSetDefault: boolean;
};

type Props = {
  address: string;
  latitude: number;
  longitude: number;
  initialLocationName?: string;
  initialType?: AddressType;
  onSave: (data: AddressDetailFormSubmitData) => Promise<void>;
  labels: {
    apartmentDetailsTitle: string;
    apartmentFloorTowerLabel: string;
    apartmentFloorTowerPlaceholder: string;
    apartmentLandmarkLabel: string;
    apartmentLandmarkPlaceholder: string;
    apartmentSocietyBuildingNameLabel: string;
    apartmentSocietyBuildingNamePlaceholder: string;
    apartmentUnitLabel: string;
    apartmentUnitPlaceholder: string;
    locationNamePlaceholder: string;
    addressDetailsLabel: string;
    locationTypeLabel: string;
    homeAreaStreetLabel: string;
    homeAreaStreetPlaceholder: string;
    homeDetailsTitle: string;
    homeHouseFlatNumberLabel: string;
    homeHouseFlatNumberPlaceholder: string;
    homeLandmarkLabel: string;
    homeLandmarkPlaceholder: string;
    home: string;
    apartment: string;
    office: string;
    officeCompanyBuildingNameLabel: string;
    officeCompanyBuildingNamePlaceholder: string;
    officeDepartmentLabel: string;
    officeDepartmentPlaceholder: string;
    officeDetailsTitle: string;
    officeFloorSuiteUnitLabel: string;
    officeFloorSuiteUnitPlaceholder: string;
    officeLandmarkLabel: string;
    officeLandmarkPlaceholder: string;
    other: string;
    setAsDefaultAddress: string;
  };
};

const EMPTY_DETAIL_VALUES: AddressDetailValues = {
  apartmentFloorTower: '',
  apartmentLandmark: '',
  apartmentSocietyBuildingName: '',
  apartmentUnit: '',
  homeAreaStreet: '',
  homeHouseFlatNumber: '',
  homeLandmark: '',
  officeCompanyBuildingName: '',
  officeDepartment: '',
  officeFloorSuiteUnit: '',
  officeLandmark: '',
};

function buildLocationName(
  addressType: AddressType,
  locationName: string,
  labels: Pick<Props['labels'], 'home' | 'apartment' | 'office' | 'other'>,
) {
  const explicitLocationName = locationName.trim();

  if (explicitLocationName) {
    return explicitLocationName;
  }

  if (addressType === 'OFFICE') {
    return labels.office;
  }

  return undefined;
}

function buildAdditionalFields(
  addressType: AddressType,
  detailValues: AddressDetailValues,
): AddressAdditionalFields | undefined {
  if (addressType === 'OFFICE') {
    return {
      floorNo: detailValues.officeFloorSuiteUnit.trim() || undefined,
      companyName: detailValues.officeCompanyBuildingName.trim() || undefined,
      department: detailValues.officeDepartment.trim() || undefined,
      landmark: detailValues.officeLandmark.trim() || undefined,
    };
  }

  if (addressType === 'HOME') {
    return {
      houseNo: detailValues.homeHouseFlatNumber.trim() || undefined,
      societyArea: detailValues.homeAreaStreet.trim() || undefined,
      landmark: detailValues.homeLandmark.trim() || undefined,
    };
  }

  if (addressType === 'APARTMENT') {
    return {
      apartmentNo: detailValues.apartmentUnit.trim() || undefined,
      building: detailValues.apartmentSocietyBuildingName.trim() || undefined,
      floorNo: detailValues.apartmentFloorTower.trim() || undefined,
      landmark: detailValues.apartmentLandmark.trim() || undefined,
    };
  }

  return undefined;
}

function hasAdditionalFields(
  fields: AddressAdditionalFields | undefined,
) {
  if (!fields) {
    return false;
  }

  return Object.values(fields).some(Boolean);
}

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
    const [detailValues, setDetailValues] =
      useState<AddressDetailValues>(EMPTY_DETAIL_VALUES);
    const [isSaving, setIsSaving] = useState(false);
    const [shouldSetDefault, setShouldSetDefault] = useState(false);
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

      const resolvedLocationName = buildLocationName(
        addressType,
        locationName,
        {
          home: labels.home,
          apartment: labels.apartment,
          office: labels.office,
          other: labels.other,
        },
      );
      const resolvedAdditionalFields = buildAdditionalFields(
        addressType,
        detailValues,
      );

      setIsSaving(true);
      try {
        await onSave({
          address: editableAddress.trim() || address,
          latitude: currentLat,
          longitude: currentLng,
          type: addressType,
          location_name: resolvedLocationName,
          additional_fields: hasAdditionalFields(resolvedAdditionalFields)
            ? resolvedAdditionalFields
            : undefined,
          shouldSetDefault,
        });
      } finally {
        setIsSaving(false);
      }
    }, [
      address,
      addressType,
      currentLat,
      currentLng,
      detailValues,
      editableAddress,
      isSaving,
      locationName,
      onSave,
      shouldSetDefault,
    ]);

    const handleDetailValueChange = useCallback(
      (field: keyof AddressDetailValues, value: string) => {
        setDetailValues((currentValues) => ({
          ...currentValues,
          [field]: value,
        }));
      },
      [],
    );

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

        <AddressTypeDetailsCard
          addressType={addressType}
          labels={{
            apartmentDetailsTitle: labels.apartmentDetailsTitle,
            apartmentFloorTowerLabel: labels.apartmentFloorTowerLabel,
            apartmentFloorTowerPlaceholder:
              labels.apartmentFloorTowerPlaceholder,
            apartmentLandmarkLabel: labels.apartmentLandmarkLabel,
            apartmentLandmarkPlaceholder:
              labels.apartmentLandmarkPlaceholder,
            apartmentSocietyBuildingNameLabel:
              labels.apartmentSocietyBuildingNameLabel,
            apartmentSocietyBuildingNamePlaceholder:
              labels.apartmentSocietyBuildingNamePlaceholder,
            apartmentUnitLabel: labels.apartmentUnitLabel,
            apartmentUnitPlaceholder: labels.apartmentUnitPlaceholder,
            homeAreaStreetLabel: labels.homeAreaStreetLabel,
            homeAreaStreetPlaceholder: labels.homeAreaStreetPlaceholder,
            homeDetailsTitle: labels.homeDetailsTitle,
            homeHouseFlatNumberLabel: labels.homeHouseFlatNumberLabel,
            homeHouseFlatNumberPlaceholder:
              labels.homeHouseFlatNumberPlaceholder,
            homeLandmarkLabel: labels.homeLandmarkLabel,
            homeLandmarkPlaceholder: labels.homeLandmarkPlaceholder,
            officeCompanyBuildingNameLabel:
              labels.officeCompanyBuildingNameLabel,
            officeCompanyBuildingNamePlaceholder:
              labels.officeCompanyBuildingNamePlaceholder,
            officeDepartmentLabel: labels.officeDepartmentLabel,
            officeDepartmentPlaceholder:
              labels.officeDepartmentPlaceholder,
            officeDetailsTitle: labels.officeDetailsTitle,
            officeFloorSuiteUnitLabel: labels.officeFloorSuiteUnitLabel,
            officeFloorSuiteUnitPlaceholder:
              labels.officeFloorSuiteUnitPlaceholder,
            officeLandmarkLabel: labels.officeLandmarkLabel,
            officeLandmarkPlaceholder: labels.officeLandmarkPlaceholder,
            setAsDefaultAddress: labels.setAsDefaultAddress,
          }}
          onChangeValue={handleDetailValueChange}
          onToggleDefault={() => setShouldSetDefault((current) => !current)}
          setAsDefault={shouldSetDefault}
          values={detailValues}
        />
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

import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../components/Text';
import { useTheme } from '../../theme/theme';
import type { AddressType } from '../../api/addressService';
import AddressTypeDetailField from './AddressTypeDetailField';

export type AddressDetailValues = {
  apartmentFloorTower: string;
  apartmentLandmark: string;
  apartmentSocietyBuildingName: string;
  apartmentUnit: string;
  homeAreaStreet: string;
  homeHouseFlatNumber: string;
  homeLandmark: string;
  officeCompanyBuildingName: string;
  officeDepartment: string;
  officeFloorSuiteUnit: string;
  officeLandmark: string;
};

type Labels = {
  apartmentDetailsTitle: string;
  apartmentFloorTowerLabel: string;
  apartmentFloorTowerPlaceholder: string;
  apartmentLandmarkLabel: string;
  apartmentLandmarkPlaceholder: string;
  apartmentSocietyBuildingNameLabel: string;
  apartmentSocietyBuildingNamePlaceholder: string;
  apartmentUnitLabel: string;
  apartmentUnitPlaceholder: string;
  homeAreaStreetLabel: string;
  homeAreaStreetPlaceholder: string;
  homeDetailsTitle: string;
  homeHouseFlatNumberLabel: string;
  homeHouseFlatNumberPlaceholder: string;
  homeLandmarkLabel: string;
  homeLandmarkPlaceholder: string;
  officeCompanyBuildingNameLabel: string;
  officeCompanyBuildingNamePlaceholder: string;
  officeDepartmentLabel: string;
  officeDepartmentPlaceholder: string;
  officeDetailsTitle: string;
  officeFloorSuiteUnitLabel: string;
  officeFloorSuiteUnitPlaceholder: string;
  officeLandmarkLabel: string;
  officeLandmarkPlaceholder: string;
  setAsDefaultAddress: string;
};

type Props = {
  addressType: AddressType;
  labels: Labels;
  onChangeValue: (field: keyof AddressDetailValues, value: string) => void;
  onToggleDefault: () => void;
  setAsDefault: boolean;
  values: AddressDetailValues;
};

type DetailFieldConfig = {
  key: keyof AddressDetailValues;
  label: string;
  placeholder: string;
};

function getCardConfig(addressType: AddressType, labels: Labels) {
  if (addressType === 'OFFICE') {
    return {
      icon: 'briefcase-outline' as const,
      title: labels.officeDetailsTitle,
      fields: [
        {
          key: 'officeFloorSuiteUnit',
          label: labels.officeFloorSuiteUnitLabel,
          placeholder: labels.officeFloorSuiteUnitPlaceholder,
        },
        {
          key: 'officeCompanyBuildingName',
          label: labels.officeCompanyBuildingNameLabel,
          placeholder: labels.officeCompanyBuildingNamePlaceholder,
        },
        {
          key: 'officeDepartment',
          label: labels.officeDepartmentLabel,
          placeholder: labels.officeDepartmentPlaceholder,
        },
        {
          key: 'officeLandmark',
          label: labels.officeLandmarkLabel,
          placeholder: labels.officeLandmarkPlaceholder,
        },
      ] satisfies DetailFieldConfig[],
    };
  }

  if (addressType === 'APARTMENT') {
    return {
      icon: 'business-outline' as const,
      title: labels.apartmentDetailsTitle,
      fields: [
        {
          key: 'apartmentUnit',
          label: labels.apartmentUnitLabel,
          placeholder: labels.apartmentUnitPlaceholder,
        },
        {
          key: 'apartmentSocietyBuildingName',
          label: labels.apartmentSocietyBuildingNameLabel,
          placeholder: labels.apartmentSocietyBuildingNamePlaceholder,
        },
        {
          key: 'apartmentFloorTower',
          label: labels.apartmentFloorTowerLabel,
          placeholder: labels.apartmentFloorTowerPlaceholder,
        },
        {
          key: 'apartmentLandmark',
          label: labels.apartmentLandmarkLabel,
          placeholder: labels.apartmentLandmarkPlaceholder,
        },
      ] satisfies DetailFieldConfig[],
    };
  }

  return {
    icon: 'home-outline' as const,
    title: labels.homeDetailsTitle,
    fields: [
      {
        key: 'homeHouseFlatNumber',
        label: labels.homeHouseFlatNumberLabel,
        placeholder: labels.homeHouseFlatNumberPlaceholder,
      },
      {
        key: 'homeAreaStreet',
        label: labels.homeAreaStreetLabel,
        placeholder: labels.homeAreaStreetPlaceholder,
      },
      {
        key: 'homeLandmark',
        label: labels.homeLandmarkLabel,
        placeholder: labels.homeLandmarkPlaceholder,
      },
    ] satisfies DetailFieldConfig[],
  };
}

function AddressTypeDetailsCard({
  addressType,
  labels,
  onChangeValue,
  onToggleDefault,
  setAsDefault,
  values,
}: Props) {
  const { colors, typography } = useTheme();

  if (addressType === 'OTHER') {
    return null;
  }

  const config = getCardConfig(addressType, labels);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.blue50,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.surface }]}>
          <Ionicons name={config.icon} size={20} color={colors.text} />
        </View>
        <Text
          weight="semiBold"
          color={colors.primary}
          style={[
            styles.title,
            {
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
            },
          ]}
        >
          {config.title}
        </Text>
      </View>

      <View style={styles.fields}>
        {config.fields.map((field) => (
          <AddressTypeDetailField
            key={field.key}
            label={field.label}
            onChangeText={(nextValue) => onChangeValue(field.key, nextValue)}
            placeholder={field.placeholder}
            value={values[field.key]}
          />
        ))}
      </View>

      <Pressable
        accessibilityLabel={labels.setAsDefaultAddress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: setAsDefault }}
        onPress={onToggleDefault}
        style={({ pressed }) => [
          styles.defaultRow,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: setAsDefault ? colors.primary : colors.surface,
              borderColor: setAsDefault ? colors.primary : colors.border,
            },
          ]}
        >
          {setAsDefault ? (
            <Ionicons name="checkmark" size={16} color={colors.white} />
          ) : null}
        </View>
        <Text weight="semiBold" style={styles.defaultLabel}>
          {labels.setAsDefaultAddress}
        </Text>
      </Pressable>
    </View>
  );
}

export default memo(AddressTypeDetailsCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 20,
    marginHorizontal: 16,
    padding: 16,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 7,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  defaultLabel: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  defaultRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  fields: {
    gap: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  title: {
    flex: 1,
  },
});

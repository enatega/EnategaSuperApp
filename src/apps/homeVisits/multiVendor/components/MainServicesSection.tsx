import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  DiscoveryCategorySection,
  DiscoverySectionState,
} from '../../../../general/components/discovery';
import type { DiscoveryCategoryItem } from '../../../../general/components/discovery';
import useMultiVendorMainServices from '../hooks/useMultiVendorMainServices';
import type { MultiVendorStackParamList } from '../navigation/types';

type Props = {
  selectedMainServiceId?: string | null;
  onSelectMainService?: (serviceId: string | null) => void;
};

export default function MainServicesSection({
  onSelectMainService,
  selectedMainServiceId,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const { data: mainServices = [], isPending, isError } =
    useMultiVendorMainServices();

  const handlePress = useCallback(
    (item: DiscoveryCategoryItem) => {
      if (!onSelectMainService) {
        navigation.navigate('MultiVendorServiceTypeDetails', {
          initialMainServiceId: item.id,
          title: item.name,
        });
        return;
      }

      onSelectMainService(item.id === selectedMainServiceId ? null : item.id);
    },
    [navigation, onSelectMainService, selectedMainServiceId],
  );

  if (isError) {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <DiscoverySectionState
          tone="error"
          title={t('single_vendor_home_section_error_title')}
          message={t('single_vendor_home_section_error_message')}
        />
      </View>
    );
  }

  return (
    <DiscoveryCategorySection
      items={mainServices}
      isPending={isPending}
      onItemPress={handlePress}
      title={t('multi_vendor_service_type_title')}
    />
  );
}

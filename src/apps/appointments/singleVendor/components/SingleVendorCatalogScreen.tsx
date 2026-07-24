import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  type NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import AppointmentServicesRow from '../../components/services/AppointmentServicesRow';
import {
  useAppointmentStoreView,
  useFlattenedAppointmentStoreServices,
} from '../../hooks/useDiscoveryQueries';
import { useAppointmentsConfigStore } from '../../stores/useAppointmentsConfigStore';
import type { SingleVendorStackParamList } from '../navigation/types';

type Props = {
  isSearchEnabled?: boolean;
};

export default function SingleVendorCatalogScreen({
  isSearchEnabled = false,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const navigation =
    useNavigation<NavigationProp<SingleVendorStackParamList>>();
  const storeId =
    useAppointmentsConfigStore(
      (state) => state.configuration?.single_vendor_store_id,
    ) ?? '';
  const [search, setSearch] = useState('');
  const storeQuery = useAppointmentStoreView(storeId);
  const servicesQuery = useFlattenedAppointmentStoreServices({
    storeId,
    limit: 20,
    search: search.trim() || undefined,
  });
  const services = servicesQuery.data ?? [];
  const title = storeQuery.data?.name || t('single_vendor_label');
  const subtitle = useMemo(
    () =>
      storeQuery.data?.tagLine ||
      storeQuery.data?.address ||
      t('single_vendor_home_subtitle'),
    [storeQuery.data?.address, storeQuery.data?.tagLine, t],
  );

  const openService = (serviceId: string) => {
    navigation.navigate('Services', {
      storeId,
      title,
      initialServiceId: serviceId,
    });
  };

  const isLoading =
    storeQuery.isPending || servicesQuery.isPending || !storeId;
  const hasError = Boolean(storeQuery.error || servicesQuery.error);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title={title} subtitle={subtitle} />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {isSearchEnabled ? (
            <TextInput
              accessibilityLabel={t('single_vendor_search_placeholder')}
              onChangeText={setSearch}
              placeholder={t('single_vendor_search_placeholder')}
              placeholderTextColor={colors.mutedText}
              style={[
                styles.searchInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                  fontFamily: typography.fontFamily.regular,
                  fontSize: typography.size.md,
                },
              ]}
              value={search}
            />
          ) : null}

          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg,
            }}
            weight="semiBold"
          >
            {isSearchEnabled
              ? t('single_vendor_search_title')
              : t('single_vendor_services_title')}
          </Text>

          {isLoading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : hasError ? (
            <Text style={{ color: colors.mutedText }}>
              {t('single_vendor_load_error')}
            </Text>
          ) : services.length === 0 ? (
            <Text style={{ color: colors.mutedText }}>
              {t('single_vendor_services_empty')}
            </Text>
          ) : (
            services.map((service) => (
              <AppointmentServicesRow
                item={service}
                key={service.id}
                onPress={(item) => openService(item.id)}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  loader: {
    marginTop: 40,
  },
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  searchInput: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    minHeight: 50,
    paddingHorizontal: 16,
  },
});

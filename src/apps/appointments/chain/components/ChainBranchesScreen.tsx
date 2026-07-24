import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import useAddress from '../../../../general/hooks/useAddress';
import { useTheme } from '../../../../general/theme/theme';
import { appointmentsDiscoveryService } from '../../api/discoveryService';
import AppointmentsProviderCard from '../../components/home/AppointmentsProviderCard';
import type { AppointmentsStackParamList } from '../../navigation/types';

type Props = {
  isSearchEnabled?: boolean;
};

export default function ChainBranchesScreen({
  isSearchEnabled = false,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const navigation =
    useNavigation<NavigationProp<AppointmentsStackParamList>>();
  const { latitude, longitude } = useAddress();
  const [search, setSearch] = useState('');
  const branchesQuery = useQuery({
    queryKey: [
      'appointments',
      'chain-branches',
      latitude,
      longitude,
      search,
    ],
    queryFn: () =>
      appointmentsDiscoveryService.getChainBranches({
        latitude,
        longitude,
        search: search.trim() || undefined,
        limit: 30,
      }),
    staleTime: 2 * 60 * 1000,
  });
  const branches = branchesQuery.data ?? [];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header
          title={t('chain_branches_title')}
          subtitle={t('chain_branches_subtitle')}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {isSearchEnabled ? (
            <TextInput
              accessibilityLabel={t('chain_search_placeholder')}
              onChangeText={setSearch}
              placeholder={t('chain_search_placeholder')}
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

          {branchesQuery.isPending ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : branchesQuery.error ? (
            <Text style={{ color: colors.mutedText }}>
              {t('chain_branches_load_error')}
            </Text>
          ) : branches.length === 0 ? (
            <Text style={{ color: colors.mutedText }}>
              {t('chain_branches_empty')}
            </Text>
          ) : (
            <View style={styles.list}>
              {branches.map((branch) => (
                <Pressable
                  accessibilityRole="button"
                  key={branch.storeId}
                  onPress={() =>
                    navigation.navigate('Chain', {
                      screen: 'ChainDetails',
                      params: { provider: branch },
                    })
                  }
                >
                  <AppointmentsProviderCard
                    isFullWidth
                    provider={branch}
                    variant="compact"
                  />
                </Pressable>
              ))}
            </View>
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
  list: {
    gap: 14,
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

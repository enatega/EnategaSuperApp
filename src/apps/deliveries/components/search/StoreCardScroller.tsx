import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { typography } from '../../../../general/theme/typography';
import { useTheme } from '../../../../general/theme/theme';
import StoreCard from '../storeCard/StoreCard';
import type { StoreCardScrollerProps } from './types';

export default function StoreCardScroller({
  stores,
  onSeeAllPress,
  onLoadMore,
}: StoreCardScrollerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {t('stores')}
        </Text>
        {onSeeAllPress ? (
          <TouchableOpacity
            style={[styles.seeAllButton, { backgroundColor: colors.blue100 }]}
            onPress={onSeeAllPress}
            activeOpacity={0.7}
          >
            <Text
              variant="body"
              weight="medium"
              style={{ color: colors.text, fontSize: typography.size.sm2 }}
            >
              {t('see_all')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={stores}
        renderItem={({ item }) => <StoreCard layout="fullWidth" store={item} />}
        keyExtractor={(item) => item.storeId}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  separator: {
    width: 16,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../general/components/Text';
import Card from '../../general/components/Card';
import Image from '../../general/components/Image';
import HorizontalList from '../../general/components/HorizontalList';
import { useTheme } from '../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type Recommendation = {
  id: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
};

type Props = {
  items: Recommendation[];
};

export default function RecommendedSection({ items }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  return (
    <View style={styles.section}>
      <Text variant="subtitle" weight="semiBold" style={styles.sectionTitle}>
        {t('recommended_title')}
      </Text>
      <HorizontalList
        data={items}
        keyExtractor={(item) => item.id}
        estimatedItemSize={280}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.body}>
              <Text weight="semiBold">{item.title}</Text>
              <View style={styles.meta}>
                <Text variant="caption" color={colors.warning}>
                  ★ {item.rating.toFixed(1)}
                </Text>
                <Text variant="caption" color={colors.mutedText}>
                  {t('recommended_reviews', { count: item.reviews })}
                </Text>
              </View>
            </View>
            <View style={[styles.price, { backgroundColor: colors.cardLavender }]}>
              <Text variant="caption" weight="semiBold" color={colors.primary}>
                {t('recommended_price', { price: item.price })}
              </Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginTop: 8,
  },
  list: {
    paddingVertical: 4,
    paddingRight: 20,
  },
  card: {
    width: 280,
    marginRight: 12,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  body: {
    padding: 12,
    gap: 6,
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  price: {
    position: 'absolute',
    right: 12,
    top: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
});

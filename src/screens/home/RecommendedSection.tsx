import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../general/components/Text';
import Card from '../../general/components/Card';
import Image from '../../general/components/Image';
import HorizontalList from '../../general/components/HorizontalList';
import { useTheme } from '../../general/theme/theme';
import { useTranslation } from 'react-i18next';

const starIcon = 'https://www.figma.com/api/mcp/asset/93443844-d119-461f-8b08-d5b5445d430e';

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
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={{ fontSize: typography.size.lg, lineHeight: typography.lineHeight.md, color: colors.text }}
      >
        {t('recommended_title')}
      </Text>
      <HorizontalList
        data={items}
        keyExtractor={(item) => item.id}
        estimatedItemSize={270}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: colors.surfaceSoft, shadowColor: colors.shadowColor }]}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={[styles.imageOverlay, { backgroundColor: colors.overlayDark20 }]} />
              <View style={[styles.price, { backgroundColor: colors.blue100 }]}>
                <Text
                  weight="medium"
                  color={colors.blue800}
                  style={{ fontSize: typography.size.xxs, lineHeight: typography.lineHeight.xxs }}
                >
                  {t('recommended_price', { price: item.price })}
                </Text>
              </View>
            </View>
            <View style={styles.body}>
              <Text
                weight="extraBold"
                style={[
                  { fontSize: typography.size.sm2, lineHeight: typography.lineHeight.h5, color: colors.text },
                ]}
              >
                {item.title}
              </Text>
              <View style={styles.meta}>
                <Image source={{ uri: starIcon }} style={styles.star} />
                <Text
                  weight="semiBold"
                  style={{
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.sm,
                    color: colors.text,
                  }}
                >
                  {item.rating.toFixed(1)}
                </Text>
                <Text
                  weight="medium"
                  style={{
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.sm,
                    color: colors.iconMuted,
                  }}
                >
                  {t('recommended_reviews', { count: item.reviews })}
                </Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  list: {
    paddingVertical: 0,
    paddingRight: 16,
  },
  card: {
    width: 267,
    marginRight: 12,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  imageWrap: {
    height: 140,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  body: {
    padding: 12,
    gap: 2,
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  star: {
    width: 16,
    height: 16,
  },
  price: {
    position: 'absolute',
    right: 12,
    top: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 50,
  },
});

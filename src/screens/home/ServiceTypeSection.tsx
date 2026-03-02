import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../general/components/Text';
import Card from '../../general/components/Card';
import Image from '../../general/components/Image';
import HorizontalList from '../../general/components/HorizontalList';
import { useTheme } from '../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { serviceTypeIcons } from '../../general/assets/images';

type ServiceTypeItem = {
  id: string;
  title: string;
  description: string;
  icon: number;
};

type Props = {
  items: ServiceTypeItem[];
};

export default function ServiceTypeSection({ items }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');

  return (
    <View style={styles.section}>
      <Text variant="subtitle" weight="bold" style={styles.sectionTitle}>
        {t('service_type_title')}
      </Text>
      <HorizontalList
        data={items}
        keyExtractor={(item) => item.id}
        estimatedItemSize={230}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          return (
          <Pressable onPress={() => setSelectedId(item.id)}>
            <Card
              variant="outlined"
              style={[styles.card, isSelected && styles.cardSelected]}
            >
            <View style={[styles.iconWrap, { backgroundColor: colors.cardBlue }]}> 
              <Image source={item.icon} style={styles.icon} />
            </View>
            <Text weight="semiBold" style={{ fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm }}>
              {item.title}
            </Text>
            <Text variant="caption" color={colors.mutedText}>
              {item.description}
            </Text>
            </Card>
          </Pressable>
          );
        }}
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
    width: 230,
    minHeight: 150,
    marginRight: 12,
    gap: 8,
  },
  cardSelected: {
    borderColor: '#1E40AF',
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 26,
    height: 26,
  },
});

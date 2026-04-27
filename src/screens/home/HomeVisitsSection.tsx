import React from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Card from '../../general/components/Card';
import Image from '../../general/components/Image';
import Text from '../../general/components/Text';
import { serviceIcons } from '../../general/assets/images';
import { useTheme } from '../../general/theme/theme';

type Props = {
  onPress?: () => void;
};

export default function HomeVisitsSection({ onPress }: Props) {
  const { t } = useTranslation('general');
  const { colors, typography } = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 380;

  const cardHeight = isCompact ? 92 : 102;
  const iconSize = isCompact ? 42 : 48;
  const titleSize = isCompact ? typography.size.sm2 : typography.size.md;
  const titleLineHeight = isCompact ? typography.lineHeight.h5 : typography.lineHeight.h4;

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={[
          styles.sectionTitle,
          { fontSize: typography.size.lg, lineHeight: typography.lineHeight.md, color: colors.text },
        ]}
      >
        {t('home_visits_section_title')}
      </Text>

      <Pressable onPress={onPress} disabled={!onPress}>
        {({ pressed }) => (
          <Card
            style={[
              styles.cardBase,
              {
                backgroundColor: colors.blue50,
                borderColor: colors.border,
                height: cardHeight,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <View style={styles.content}>
            
              <Text
                numberOfLines={2}
                 weight="semiBold"
                style={{
                  
                               
                               fontSize: typography.size.xs2, 
                  
               
                  lineHeight: typography.lineHeight.sm,
                
                }}
              >
                {t('home_visits_section_description')}
              </Text>
            </View>

            <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
              <Image source={serviceIcons.homeVisits} style={{ width: iconSize, height: iconSize }} />
            </View>
          </Card>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  sectionTitle: {},
  cardBase: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingRight: 14,
    gap: 4,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

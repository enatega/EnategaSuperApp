import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import type { AppointmentStoreCategory } from '../../api/types';
import { useAppointmentDetailTabsScroll } from '../../hooks/useAppointmentDetailTabsScroll';

type Props = {
  activeCategoryId: string | null;
  categories: AppointmentStoreCategory[];
  disabled?: boolean;
  onSelect: (categoryId: string | null) => void;
  titleAll: string;
};

export default function AppointmentDetailTabs({
  activeCategoryId,
  categories,
  disabled = false,
  onSelect,
  titleAll,
}: Props) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const safeCategories = Array.isArray(categories) ? categories : [];
  const isAllActive = !activeCategoryId;
  const { registerTabLayout, scrollViewRef } = useAppointmentDetailTabsScroll({
    activeCategoryId,
    screenWidth: width,
  });

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          disabled={disabled}
          onLayout={(event) => {
            const { width: tabWidth, x } = event.nativeEvent.layout;
            registerTabLayout(null, { width: tabWidth, x });
          }}
          onPress={() => onSelect(null)}
          style={[
            styles.tab,
            isAllActive && {
              backgroundColor: colors.blue100,
            },
          ]}
        >
          <Text
            style={{
              color: isAllActive ? colors.primary : colors.mutedText,
              fontSize: 13,
              lineHeight: 20,
            }}
            weight="medium"
          >
            {titleAll}
          </Text>
        </Pressable>

        {safeCategories.map((category) => {
          const isActive = category.id === activeCategoryId;

          return (
            <Pressable
              key={category.id}
              disabled={disabled}
              onLayout={(event) => {
                const { width: tabWidth, x } = event.nativeEvent.layout;
                registerTabLayout(category.id, { width: tabWidth, x });
              }}
              onPress={() => onSelect(category.id)}
              style={[
                styles.tab,
                isActive && {
                  backgroundColor: colors.blue100,
                },
              ]}
            >
              <Text
                style={{
                  color: isActive ? colors.primary : colors.mutedText,
                  fontSize: 13,
                  lineHeight: 20,
                }}
                weight="medium"
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  content: {
    gap: 8,
    paddingVertical: 6,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    borderRadius: 999,
    justifyContent: 'center',
    minWidth: 68,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
});

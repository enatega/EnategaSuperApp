import React, { memo, useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';
import { RideOptionItem } from './types';


type Props = {
  item: RideOptionItem;
  isActive: boolean;
  onPress: (id: RideOptionItem['id']) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

function RideOptionCard({ item, isActive, onPress, containerStyle }: Props) {
  const { colors, typography } = useTheme();

  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.optionButton,
        containerStyle,
        {
          backgroundColor: isActive ? colors.blue50 : colors.surface,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.optionIconWrap}>
        {item.icon ? (
          <Image source={{ uri: item.icon }} style={styles.optionIcon} />
        ) : (
          <View
            style={[
              styles.optionPlaceholder,
              { backgroundColor: isActive ? colors.blue100 : colors.backgroundTertiary },
            ]}
          >
            <Icon
              type="Feather"
              name="truck"
              size={18}
              color={isActive ? colors.blue800 : colors.iconMuted}
            />
          </View>
        )}
      </View>
      <View style={styles.optionMeta}>
        <Text
          weight="medium"
          numberOfLines={1}
          style={[
            styles.optionTitle,
            { color: isActive ? colors.blue800 : colors.text },
          ]}
        >
          {item.title}
        </Text>
        {item.seats ? (
          <View style={styles.optionSeats}>
            <Icon
              type="Feather"
              name="user"
              size={14}
              color={isActive ? colors.blue800 : colors.text}
            />
            <Text
              weight="medium"
              style={{
                color: isActive ? colors.blue800 : colors.text,
                fontSize: typography.size.sm2,
              }}
            >
              {item.seats}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export default memo(RideOptionCard);

const styles = StyleSheet.create({
  optionButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionIconWrap: {
    width: 80,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  optionIcon: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  optionPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBadge: {
    position: 'absolute',
    left: 0,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3090FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBadgeIcon: {
    width: 12,
    height: 12,
  },
  optionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionTitle: {
    fontSize: 14,
    flex: 1,
    flexShrink: 1,
    marginRight: 6,
  },
  optionSeats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
});

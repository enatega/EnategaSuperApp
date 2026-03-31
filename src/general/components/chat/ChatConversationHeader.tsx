import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../ScreenHeader';
import Image from '../Image';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  avatarUri?: string | null;
  backAccessibilityLabel: string;
  onBack?: () => void;
  onRightPress?: () => void;
  rightAccessibilityLabel?: string;
  title: string;
};

export default function ChatConversationHeader({
  avatarUri,
  backAccessibilityLabel,
  onBack,
  onRightPress,
  rightAccessibilityLabel,
  title,
}: Props) {
  const navigation = useNavigation();
  const { colors, typography } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigation.goBack();
  };

  return (
    <ScreenHeader
      showBack={false}
      leftSlot={(
        <View style={styles.leftContent}>
          <Pressable
            accessibilityLabel={backAccessibilityLabel}
            accessibilityRole="button"
            hitSlop={10}
            onPress={handleBack}
            style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>

          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.cardBlue }]}>
              <Text
                weight="semiBold"
                style={{ color: colors.text, fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
              >
                {title.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <Text
            weight="medium"
            style={{ color: colors.text, fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}
      leftSlotContainerStyle={styles.leftSlotContainer}
      rightSlot={onRightPress ? (
        <Pressable
          accessibilityLabel={rightAccessibilityLabel}
          accessibilityRole="button"
          onPress={onRightPress}
          style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Ionicons name="call-outline" size={21} color={colors.text} />
        </Pressable>
      ) : null}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  leftContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  leftSlotContainer: {
    flex: 1,
    width: 'auto',
  },
});

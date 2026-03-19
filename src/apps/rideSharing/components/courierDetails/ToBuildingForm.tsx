import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Text from '../../../../general/components/Text';
import PhoneNumberInput from '../../../../general/components/auth/PhoneInput';
import { useTheme } from '../../../../general/theme/theme';
import { useCourierBookingStore } from '../../stores/useCourierBookingStore';

// ─── Package Sizes ────────────────────────────────────────────────────────────

const PACKAGE_SIZES = [
  { key: 'S', label: 'Up to 5kg', image: require('../../assets/images/deliveryBoy.png') },
  { key: 'M', label: 'Up to 15kg', image: require('../../assets/images/deliveryBoy.png') },
  { key: 'L', label: 'Up to 20kg', image: require('../../assets/images/deliveryBoy.png') },
];

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = ['Food', 'Clothes', 'Documents', 'Electronics', 'Pharmacy'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ToBuildingForm({
  onCommentsFocus,
  onValidChange,
}: {
  onCommentsFocus?: () => void;
  onValidChange?: (valid: boolean) => void;
}) {
  const { colors } = useTheme();
  const { toBuilding, setToBuildingField } = useCourierBookingStore();
  const { senderPhone, recipientPhone, packageSize, categories, comments } = toBuilding;

  const checkValid = (sender: string, recipient: string, cats: string[]) =>
    onValidChange?.(sender.length >= 10 && recipient.length >= 10 && cats.length > 0);

  const toggleCategory = (cat: string) => {
    const next = categories.includes(cat)
      ? categories.filter((c) => c !== cat)
      : [...categories, cat];
    setToBuildingField({ categories: next });
    checkValid(senderPhone, recipientPhone, next);
  };

  const handleSenderPhone = (text: string) => {
    setToBuildingField({ senderPhone: text });
    checkValid(text, recipientPhone, categories);
  };

  const handleRecipientPhone = (text: string) => {
    setToBuildingField({ recipientPhone: text });
    checkValid(senderPhone, text, categories);
  };

  return (
    <View style={styles.container}>
      {/* Sender Phone */}
      <View style={styles.field}>
        <Text weight="semiBold">
          Sender phone number <Text color={colors.danger}>*</Text>
        </Text>
        <PhoneNumberInput
          value={senderPhone}
          onChangeText={handleSenderPhone}
          isActive={senderPhone.length > 0}
        />
      </View>

      {/* Recipient Phone */}
      <View style={styles.field}>
        <Text weight="semiBold">
          Recipient phone number <Text color={colors.danger}>*</Text>
        </Text>
        <PhoneNumberInput
          value={recipientPhone}
          onChangeText={handleRecipientPhone}
          isActive={recipientPhone.length > 0}
        />
      </View>

      {/* What to deliver */}
      <Text variant="subtitle" weight="bold">What to deliver</Text>

      {/* Package Size */}
      <View style={styles.sizeRow}>
        {PACKAGE_SIZES.map((size) => {
          return (
            <Pressable
              key={size.key}
              onPress={() => setToBuildingField({ packageSize: size.key as 'S' | 'M' | 'L' })}
              style={[
                styles.sizeCard,
                {
                  borderColor: packageSize === size.key ? colors.primary : colors.border,
                  backgroundColor: packageSize === size.key ? colors.cardSoft : colors.backgroundTertiary,
                },
              ]}
            >
              <View style={styles.sizeCardTop}>
                <Image source={size.image} style={styles.sizeImage} />
                <View style={[styles.sizeBadge, { backgroundColor: packageSize === size.key ? colors.primary : colors.background }]}>
                  <Text variant="caption" weight="bold" color={packageSize === size.key ? colors.white : colors.text}>
                    {size.key}
                  </Text>
                </View>
              </View>
              <Text variant="caption" weight="medium">{size.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Category Chips */}
      <View style={styles.chipsRow}>
        {CATEGORIES.map((cat) => {
          return (
            <Pressable
              key={cat}
              onPress={() => toggleCategory(cat)}
              style={[
                styles.chip,
                {
                  borderColor: categories.includes(cat) ? colors.primary : colors.border,
                  backgroundColor: categories.includes(cat) ? colors.cardSoft : colors.background,
                },
              ]}
            >
              <Text variant="caption" weight="medium" color={categories.includes(cat) ? colors.primary : colors.text}>
                {categories.includes(cat) ? '✓' : '+'} {cat}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Comments */}
      <TextInput
        value={comments}
        onChangeText={(text) => setToBuildingField({ comments: text })}
        placeholder="Comments for courier (optional)"
        placeholderTextColor={colors.mutedText}
        multiline
        onFocus={onCommentsFocus}
        style={[
          styles.comments,
          { borderColor: colors.border, color: colors.text },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  sizeCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sizeImage: {
    width: 52,
    height: 44,
    resizeMode: 'contain',
  },
  sizeBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  comments: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    fontSize: 15,
    textAlignVertical: 'top',
  },
});

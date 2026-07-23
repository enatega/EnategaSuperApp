import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import BottomSheetHandle from "../../../../general/components/BottomSheetHandle";
import Button from "../../../../general/components/Button";
import Icon from "../../../../general/components/Icon";
import SwipeableBottomSheet from "../../../../general/components/SwipeableBottomSheet";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

type RatingValues = {
  storeRating: number;
  storeReview?: string;
  workerRating: number;
  workerReview?: string;
};

type Props = {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: RatingValues) => void;
  storeName: string;
  visible: boolean;
  workerName: string;
};

type Step = "store" | "worker";

function StarPicker({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (value: number) => void;
  value: number;
}) {
  const { colors } = useTheme();

  return (
    <View accessibilityRole="radiogroup" style={styles.stars}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <Pressable
          accessibilityLabel={`${rating} star${rating === 1 ? "" : "s"}`}
          accessibilityRole="radio"
          accessibilityState={{ checked: value === rating, disabled }}
          disabled={disabled}
          hitSlop={7}
          key={rating}
          onPress={() => onChange(rating)}
        >
          <Icon
            color={rating <= value ? colors.warning : colors.border}
            name={rating <= value ? "star" : "star-outline"}
            size={34}
          />
        </Pressable>
      ))}
    </View>
  );
}

export default function AppointmentRatingBottomSheet({
  isSubmitting,
  onClose,
  onSubmit,
  storeName,
  visible,
  workerName,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("store");
  const [storeRating, setStoreRating] = useState(0);
  const [storeReview, setStoreReview] = useState("");
  const [workerRating, setWorkerRating] = useState(0);
  const [workerReview, setWorkerReview] = useState("");

  useEffect(() => {
    if (visible) {
      setStep("store");
      setStoreRating(0);
      setStoreReview("");
      setWorkerRating(0);
      setWorkerReview("");
    }
  }, [visible]);

  if (!visible) return null;

  const isStoreStep = step === "store";
  const currentRating = isStoreStep ? storeRating : workerRating;
  const close = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <View style={styles.overlay}>
      <Pressable onPress={close} style={styles.backdrop} />
      <SwipeableBottomSheet
        collapsedHeight={0}
        enablePanGesture={!isSubmitting}
        expandedHeight={470 + Math.max(insets.bottom, 16)}
        handle={<BottomSheetHandle color={colors.border} />}
        modal
        onCollapsed={close}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            disabled={isStoreStep || isSubmitting}
            hitSlop={10}
            onPress={() => setStep("store")}
            style={styles.headerButton}
          >
            {isStoreStep ? null : (
              <Icon color={colors.text} name="arrow-back" size={20} />
            )}
          </Pressable>
          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="extraBold"
          >
            {t("booking_rating_title")}
          </Text>
          <Pressable
            disabled={isSubmitting}
            hitSlop={10}
            onPress={close}
            style={[
              styles.headerButton,
              { backgroundColor: colors.backgroundTertiary },
            ]}
          >
            <Icon color={colors.text} name="x" size={18} type="Feather" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}
            weight="medium"
          >
            {t("booking_rating_step", { current: isStoreStep ? 1 : 2 })}
          </Text>
          <Text
            style={{ color: colors.text, fontSize: typography.size.md2 }}
            weight="semiBold"
          >
            {isStoreStep
              ? t("booking_rating_store_prompt", { name: storeName })
              : t("booking_rating_worker_prompt", { name: workerName })}
          </Text>

          <StarPicker
            disabled={isSubmitting}
            onChange={isStoreStep ? setStoreRating : setWorkerRating}
            value={currentRating}
          />

          <Text
            style={{ color: colors.text, fontSize: typography.size.md }}
            weight="semiBold"
          >
            {t("booking_rating_review_label")}
            <Text
              style={{ color: colors.mutedText, fontSize: typography.size.sm }}
            >
              {`  ${t("booking_rating_optional")}`}
            </Text>
          </Text>
          <TextInput
            editable={!isSubmitting}
            maxLength={2000}
            multiline
            onChangeText={isStoreStep ? setStoreReview : setWorkerReview}
            placeholder={t("booking_rating_review_placeholder")}
            placeholderTextColor={colors.mutedText}
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              },
            ]}
            value={isStoreStep ? storeReview : workerReview}
          />
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            disabled={currentRating === 0 || isSubmitting}
            isLoading={isSubmitting}
            label={
              isStoreStep
                ? t("booking_rating_next")
                : t("booking_rating_submit")
            }
            onPress={() => {
              if (isStoreStep) {
                setStep("worker");
                return;
              }
              onSubmit({
                storeRating,
                storeReview: storeReview.trim() || undefined,
                workerRating,
                workerReview: workerReview.trim() || undefined,
              });
            }}
            style={styles.submitButton}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  content: { gap: 14, padding: 20 },
  footer: { borderTopWidth: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerButton: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 110,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(9, 9, 11, 0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  stars: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    paddingVertical: 8,
  },
  submitButton: { minHeight: 48 },
});

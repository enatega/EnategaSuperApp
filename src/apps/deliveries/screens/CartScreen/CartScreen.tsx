import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../../../general/theme/theme';
import CartScreenContent from '../../components/cart/CartScreenContent';
import CartScreenErrorState from '../../components/cart/CartScreenErrorState';
import CartScreenSkeleton from '../../components/cart/CartScreenSkeleton';
import { useClearCartAction } from '../../hooks/useClearCartAction';
import { useCartMutationFeedback } from '../../hooks/useCartMutationFeedback';
import { useCart } from '../../hooks/useCart';
import {
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from '../../hooks/useCartMutations';
import { useOrderAgain } from '../../hooks';

export default function CartScreen() {
  const { colors } = useTheme();
  const { showMutationError, showMutationSuccess } = useCartMutationFeedback();
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const [isClearCartVisible, setIsClearCartVisible] = React.useState(false);
  const [isFeeModalVisible, setIsFeeModalVisible] = React.useState(false);
  const [updatingItemId, setUpdatingItemId] = React.useState<string | null>(null);
  const [pendingItemIds, setPendingItemIds] = React.useState<string[]>([]);
  const {
    data: cart,
    isPending: isCartPending,
    error: cartError,
    refetch: refetchCart,
  } = useCart();
  const { data: recommendations = [] } = useOrderAgain();
  const { clearCart, isClearing } = useClearCartAction({
    onSuccess: () => {
      setIsClearCartVisible(false);
    },
    showSuccessToast: false,
  });

  const handleMutationSettled = React.useCallback(() => {
    setUpdatingItemId(null);
  }, []);
  const handleUpdateError = React.useCallback(
    (error: Error) => {
      handleMutationSettled();
      showMutationError('update', error);
    },
    [handleMutationSettled, showMutationError],
  );
  const handleRemoveError = React.useCallback(
    (error: Error) => {
      handleMutationSettled();
      showMutationError('remove', error);
    },
    [handleMutationSettled, showMutationError],
  );

  const updateQuantityMutation = useUpdateCartItemQuantityMutation({
    onError: handleUpdateError,
  });
  const removeMutation = useRemoveCartItemMutation({
    onError: handleRemoveError,
  });
  const isCartMutating = pendingItemIds.length > 0
    || isClearing
    || updateQuantityMutation.isPending
    || removeMutation.isPending;

  const handleItemPendingChange = React.useCallback(
    (itemId: string, isPending: boolean) => {
      setPendingItemIds((currentIds) => {
        const hasItem = currentIds.includes(itemId);

        if (isPending) {
          return hasItem ? currentIds : [...currentIds, itemId];
        }

        if (!hasItem) {
          return currentIds;
        }

        return currentIds.filter((currentItemId) => currentItemId !== itemId);
      });
    },
    [],
  );

  const handleSetItemQuantity = React.useCallback(
    async (itemId: string, quantity: number) => {
      setUpdatingItemId(itemId);

      try {
        await updateQuantityMutation.mutateAsync({
          itemId,
          input: { quantity },
        });
      } catch {
        // Shared mutation feedback is handled by the mutation hook callbacks.
      } finally {
        handleMutationSettled();
      }
    },
    [handleMutationSettled, updateQuantityMutation],
  );

  const handleRemoveItem = React.useCallback(
    (itemId: string) => {
      setUpdatingItemId(itemId);
      removeMutation.mutate(itemId, {
        onSuccess: () => {
          showMutationSuccess('remove');
        },
        onSettled: handleMutationSettled,
      });
    },
    [handleMutationSettled, removeMutation, showMutationSuccess],
  );
  const handleCheckoutPress = React.useCallback(() => {
    navigation.navigate('Checkout');
  }, [navigation]);

  const handleOpenClearCart = React.useCallback(() => {
    setIsClearCartVisible(true);
  }, []);

  const handleCloseClearCart = React.useCallback(() => {
    if (isClearing) {
      return;
    }

    setIsClearCartVisible(false);
  }, [isClearing]);

  const handleConfirmClearCart = React.useCallback(() => {
    void clearCart();
  }, [clearCart]);

  if (isCartPending && !cart) {
    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <CartScreenSkeleton />
      </View>
    );
  }

  if (!cart || cartError) {
    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <CartScreenErrorState
          onRetry={() => {
            void refetchCart();
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <CartScreenContent
        cart={cart}
        isClearCartVisible={isClearCartVisible}
        isClearingCart={isClearing}
        isFeeModalVisible={isFeeModalVisible}
        isMutatingCart={isCartMutating}
        isUpdatingItemId={updatingItemId}
        navigation={navigation}
        onCloseClearCart={handleCloseClearCart}
        onCloseFeeModal={() => setIsFeeModalVisible(false)}
        onConfirmClearCart={handleConfirmClearCart}
        onCheckoutPress={handleCheckoutPress}
        onItemPendingChange={handleItemPendingChange}
        onOpenClearCart={handleOpenClearCart}
        onOpenFeeModal={() => setIsFeeModalVisible(true)}
        onRemoveItem={handleRemoveItem}
        onSetItemQuantity={handleSetItemQuantity}
        recommendations={recommendations}
      />
    </View>
  );
}

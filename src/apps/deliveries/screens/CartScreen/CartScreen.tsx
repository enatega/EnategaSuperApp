import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../../../general/theme/theme';
import CartScreenContent from '../../components/cart/CartScreenContent';
import CartScreenErrorState from '../../components/cart/CartScreenErrorState';
import CartScreenSkeleton from '../../components/cart/CartScreenSkeleton';
import { useCartMutationFeedback } from '../../hooks/useCartMutationFeedback';
import { useCart } from '../../hooks/useCart';
import {
  useDecrementCartItemMutation,
  useIncrementCartItemMutation,
  useRemoveCartItemMutation,
} from '../../hooks/useCartMutations';
import { useOrderAgain } from '../../hooks';

export default function CartScreen() {
  const { colors } = useTheme();
  const { showMutationError, showMutationSuccess } = useCartMutationFeedback();
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const [isFeeModalVisible, setIsFeeModalVisible] = React.useState(false);
  const [updatingItemId, setUpdatingItemId] = React.useState<string | null>(null);
  const {
    data: cart,
    isPending: isCartPending,
    error: cartError,
    refetch: refetchCart,
  } = useCart();
  const { data: recommendations = [] } = useOrderAgain();

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

  const incrementMutation = useIncrementCartItemMutation({
    onError: handleUpdateError,
  });
  const decrementMutation = useDecrementCartItemMutation({
    onError: handleUpdateError,
  });
  const removeMutation = useRemoveCartItemMutation({
    onError: handleRemoveError,
  });

  const handleIncrementItem = React.useCallback(
    (itemId: string) => {
      setUpdatingItemId(itemId);
      incrementMutation.mutate(itemId, {
        onSettled: handleMutationSettled,
      });
    },
    [handleMutationSettled, incrementMutation],
  );

  const handleDecrementItem = React.useCallback(
    (itemId: string) => {
      setUpdatingItemId(itemId);
      decrementMutation.mutate(itemId, {
        onSettled: handleMutationSettled,
      });
    },
    [decrementMutation, handleMutationSettled],
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
        isFeeModalVisible={isFeeModalVisible}
        isUpdatingItemId={updatingItemId}
        navigation={navigation}
        onCloseFeeModal={() => setIsFeeModalVisible(false)}
        onDecrementItem={handleDecrementItem}
        onIncrementItem={handleIncrementItem}
        onOpenFeeModal={() => setIsFeeModalVisible(true)}
        onRemoveItem={handleRemoveItem}
        recommendations={recommendations}
      />
    </View>
  );
}

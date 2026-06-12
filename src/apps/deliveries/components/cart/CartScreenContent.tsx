import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import type { DeliveryOrderAgainItem } from '../../api/types';
import type { CartResponse } from '../../api/cartServiceTypes';
import CartClearPopup from './CartClearPopup';
import CartEmptyState from './CartEmptyState';
import CartFooter from './CartFooter';
import CartHeader from './CartHeader';
import CartItemsSection from './CartItemsSection';
import CartRecommendationsSection from './CartRecommendationsSection';
import { formatCartPrice } from './cartUtils';

type Props = {
  cart: CartResponse;
  isClearCartVisible: boolean;
  isClearingCart?: boolean;
  isMutatingCart?: boolean;
  isUpdatingItemId?: string | null;
  navigation: NavigationProp<Record<string, object | undefined>>;
  onCloseClearCart: () => void;
  onCheckoutPress: () => void;
  onConfirmClearCart: () => void;
  onItemPendingChange?: (itemId: string, isPending: boolean) => void;
  onOpenClearCart: () => void;
  onSetItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemoveItem: (itemId: string) => void;
  recommendations: DeliveryOrderAgainItem[];
};

export default function CartScreenContent({
  cart,
  isClearCartVisible,
  isClearingCart = false,
  isMutatingCart = false,
  isUpdatingItemId,
  navigation,
  onCloseClearCart,
  onCheckoutPress,
  onConfirmClearCart,
  onItemPendingChange,
  onOpenClearCart,
  onSetItemQuantity,
  onRemoveItem,
  recommendations,
}: Props) {
  const handleBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleStartShopping = React.useCallback(() => {
    if (!cart.storeId) {
      navigation.navigate('MultiVendor', {
        screen: 'MultiVendorTabs',
        params: {
          screen: 'MultiVendorTabHome',
        },
      });
      return;
    }

    navigation.navigate('MultiVendor', {
      screen: 'StoreDetails',
      params: {
        store: {
          storeId: cart.storeId,
          vendorId: '',
          name: '',
        },
      },
    });
  }, [cart.storeId, navigation]);

  const handleRecommendationPress = React.useCallback(
    (productId: string) => {
      navigation.navigate('ProductInfo', { productId });
    },
    [navigation],
  );

  const footer = (
    <CartFooter
      amountLabel={formatCartPrice(cart.finalPrice)}
      disabled={cart.isEmpty || isMutatingCart}
      itemCount={cart.totalItems}
      onCheckoutPress={onCheckoutPress}
    />
  );

  if (cart.isEmpty) {
    return (
      <View style={styles.container}>
        <CartHeader onBackPress={handleBack} />
        <CartEmptyState onStartShoppingPress={handleStartShopping} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CartHeader
        clearDisabled={isMutatingCart}
        onBackPress={handleBack}
        onClearPress={onOpenClearCart}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CartItemsSection
          isUpdatingItemId={isUpdatingItemId}
          items={cart.items}
          onAddMorePress={handleStartShopping}
          onItemPendingChange={onItemPendingChange}
          onSetItemQuantity={onSetItemQuantity}
          onRemoveItem={onRemoveItem}
        />
        <CartRecommendationsSection
          items={recommendations}
          onItemPress={handleRecommendationPress}
        />
      </ScrollView>

      {footer}

      <CartClearPopup
        isSubmitting={isClearingCart}
        onCancel={onCloseClearCart}
        onConfirm={onConfirmClearCart}
        visible={isClearCartVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 8,
    paddingBottom: 24,
  },
});

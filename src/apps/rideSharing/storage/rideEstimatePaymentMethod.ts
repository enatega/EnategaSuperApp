import * as SecureStore from 'expo-secure-store';
import { PAYMENT_METHOD_OPTIONS, type PaymentMethodId } from '../components/payment/paymentTypes';

const RIDE_ESTIMATE_PAYMENT_METHOD_KEY = 'ride_estimate_payment_method';

function isValidPaymentMethodId(value: string): value is PaymentMethodId {
  return PAYMENT_METHOD_OPTIONS.some((option) => option.id === value);
}

export async function getSavedRideEstimatePaymentMethod(): Promise<PaymentMethodId | null> {
  try {
    const storedValue = await SecureStore.getItemAsync(RIDE_ESTIMATE_PAYMENT_METHOD_KEY);
    if (!storedValue || !isValidPaymentMethodId(storedValue)) {
      return null;
    }

    return storedValue;
  } catch (error) {
    console.warn('Unable to read ride estimate payment method', error);
    return null;
  }
}

export async function saveRideEstimatePaymentMethod(paymentMethodId: PaymentMethodId) {
  try {
    await SecureStore.setItemAsync(RIDE_ESTIMATE_PAYMENT_METHOD_KEY, paymentMethodId);
  } catch (error) {
    console.warn('Unable to save ride estimate payment method', error);
  }
}

import React from 'react';
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import AppWebView from './AppWebView';

type Props = {
  cancelUrlMatcher: string;
  checkoutUrl: string;
  onBackPress: () => void;
  onPaymentCancel?: (url: string) => void;
  onPaymentFailure?: (url: string) => void;
  onPaymentSuccess: (url: string) => void;
  onUrlChange?: (url: string) => void;
  successUrlMatcher: string;
  title: string;
};

export default function StripePaymentWebView({
  cancelUrlMatcher,
  checkoutUrl,
  onBackPress,
  onPaymentCancel,
  onPaymentFailure,
  onPaymentSuccess,
  onUrlChange,
  successUrlMatcher,
  title,
}: Props) {
  const hasResolvedRef = React.useRef(false);

  const handleShouldStartLoad = React.useCallback((navigation: WebViewNavigation) => {
    const { url } = navigation;

    onUrlChange?.(url);

    if (url.includes(successUrlMatcher)) {
      if (!hasResolvedRef.current) {
        hasResolvedRef.current = true;
        onPaymentSuccess(url);
      }

      return false;
    }

    if (url.includes(cancelUrlMatcher)) {
      if (!hasResolvedRef.current) {
        hasResolvedRef.current = true;

        if (onPaymentCancel) {
          onPaymentCancel(url);
        } else {
          onPaymentFailure?.(url);
        }
      }

      return false;
    }

    return true;
  }, [
    cancelUrlMatcher,
    onPaymentCancel,
    onPaymentFailure,
    onPaymentSuccess,
    onUrlChange,
    successUrlMatcher,
  ]);

  return (
    <AppWebView
      onBackPress={onBackPress}
      onShouldStartLoad={handleShouldStartLoad}
      sourceUrl={checkoutUrl}
      title={title}
    />
  );
}

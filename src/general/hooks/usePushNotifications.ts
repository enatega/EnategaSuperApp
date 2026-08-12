import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { authSession } from "../auth/authSession";
import { resetToSharedRoute } from "../navigation/rootNavigation";
import { syncExpoPushToken } from "../services/notifications/expoPushTokenService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function openNotification(response: Notifications.NotificationResponse) {
  const data = response.notification.request.content.data;
  const orderId = typeof data.orderId === "string" ? data.orderId : null;

  if (orderId) {
    return resetToSharedRoute("Deliveries", {
      screen: "OrderDetailsScreen",
      params: { orderId },
    });
  }

  return resetToSharedRoute("Deliveries", { screen: "Notifications" });
}

function openNotificationWhenReady(response: Notifications.NotificationResponse) {
  let attempts = 0;
  const tryOpen = () => {
    attempts += 1;
    if (!openNotification(response) && attempts < 10) {
      setTimeout(tryOpen, 200);
    }
  };

  tryOpen();
}

export default function usePushNotifications() {
  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      () => undefined,
    );
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        openNotificationWhenReady,
      );

    void Notifications.getLastNotificationResponseAsync().then(
      async (response) => {
        if (response) {
          openNotificationWhenReady(response);
          await Notifications.clearLastNotificationResponseAsync();
        }
      },
    );

    void authSession.getAccessToken().then((token) => {
      if (token) void syncExpoPushToken().catch(() => undefined);
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
}

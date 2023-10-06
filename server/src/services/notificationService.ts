import * as webPush from "web-push";
import { prisma } from "../utils/prisma";

if (
  !process.env.VAPID_PUBLIC_KEY ||
  !process.env.VAPID_PRIVATE_KEY ||
  !process.env.VAPID_MAILTO
) {
  throw new Error(
    "VAPID_PUBLIC_KEY and/or VAPID_PRIVATE_KEY and/or VAPID_MAILTO are not set in the environment variables"
  );
}

webPush.setVapidDetails(
  process.env.VAPID_MAILTO,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendNotification = async (
  userIds: number[],
  title: string,
  message: string,
  url: string,
  icon?: string
) => {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  const notificationPayload = JSON.stringify({
    title,
    body: message,
    icon,
    data: {
      url: url,
    },
  });

  subscriptions.forEach((sub) => {
    if (typeof sub.keys === "string") {
      try {
        const parsedKeys = JSON.parse(sub.keys);

        if (
          typeof parsedKeys.p256dh === "string" &&
          typeof parsedKeys.auth === "string"
        ) {
          const pushSubscription = {
            endpoint: sub.endpoint,
            expirationTime: null,
            keys: {
              p256dh: parsedKeys.p256dh,
              auth: parsedKeys.auth,
            },
          };

          webPush
            .sendNotification(pushSubscription, notificationPayload)
            .catch((error) => {
              console.error("Error sending notification:", error);
            });
        } else {
          console.error("Invalid key format:", sub.keys);
        }
      } catch (error) {
        console.error("Failed to parse keys:", sub.keys);
      }
    } else {
      console.error("sub.keys is not a string:", sub.keys);
    }
  });
};

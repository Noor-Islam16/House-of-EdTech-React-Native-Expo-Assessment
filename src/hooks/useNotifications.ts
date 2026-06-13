import { useCourseStore } from "@src/store";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }) as Notifications.NotificationBehavior,
});

export const useNotifications = () => {
  const bookmarks = useCourseStore((s) => s.bookmarks);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  };

  const scheduleReminderNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Miss learning?",
          body: "Come back and continue your courses on EduFlex!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 60 * 60 * 24,
          //   seconds: 60,
          repeats: false,
        },
      });
    } catch {
      // silently fail in Expo Go
    }
  };

  const sendBookmarkNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Great collection!",
          body: "You have saved 5 courses. Start learning today!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
          repeats: false,
        },
      });
    } catch {
      // silently fail in Expo Go
    }
  };

  useEffect(() => {
    if (bookmarks.length === 5) {
      requestPermissions().then((granted) => {
        if (granted) sendBookmarkNotification();
      });
    }
  }, [bookmarks.length]);

  return {
    requestPermissions,
    scheduleReminderNotification,
    sendBookmarkNotification,
  };
};

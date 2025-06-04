import { useEffect, useState } from "react";
import ToastNotification from "../ToastNotification/ToastNotification";
import styles from "./ToastNotificationsList.module.css";

export default function ToastNotificationsList({
  notifications,
  onRemoveNotification,
  onToastClick,
  autoRemoveDelay = 5000,
}) {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    if (autoRemoveDelay > 0) {
      const timers = visibleNotifications.map((notification) => {
        return setTimeout(() => {
          handleRemoveNotification(notification._id);
        }, autoRemoveDelay);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [visibleNotifications, autoRemoveDelay]);

  const handleRemoveNotification = (notificationId) => {
    if (onRemoveNotification) {
      onRemoveNotification(notificationId);
    }
  };

  const handleToastClick = (message) => {
    handleRemoveNotification(message._id);

    if (onToastClick) {
      onToastClick(message);
    }
  };

  if (!visibleNotifications.length) return null;

  return (
    <ul className={styles["toast-notifications-list"]}>
      {visibleNotifications.map((notification) => (
        <ToastNotification
          key={notification._id}
          message={notification}
          closeToast={() => handleRemoveNotification(notification._id)}
          onToastClick={handleToastClick}
        />
      ))}
    </ul>
  );
}

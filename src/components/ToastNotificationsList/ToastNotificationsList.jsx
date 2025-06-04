import ToastNotification from "../ToastNotification/ToastNotification";

import styles from "./ToastNotificationsList.module.css";

export default function ToastNotificationsList({ notifications }) {
  return (
    <ul className={styles["toast-notifications-list"]}>
      {notifications.map((notification) => (
        <ToastNotification
          key={notification._id}
          message={notification}
          closeToast={() => {}}
          openToast={() => {}}
        />
      ))}
    </ul>
  );
}

import ToastNotification from "../ToastNotification/ToastNotification";

export default function ToastNotificationsList({ notifications }) {
  return (
    <ul>
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

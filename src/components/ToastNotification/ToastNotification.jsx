import styles from "./ToastNotification.module.css";

export default function ToastNotification({ message, closeToast }) {
  return (
    <li className={styles["toast-notification"]}>
      <button
        className={styles["toast-content"]}
        type="button"
        onClick={closeToast}
      >
        <img
          className={styles["toast-avatar"]}
          src={message.sender.avatar}
          alt="Sender photo"
        />
        <p
          className={styles["toast-sender"]}
        >{`${message.sender.firstName} ${message.sender.lastName}`}</p>
        <p className={styles["toast-message"]}>{message.text}</p>
      </button>
    </li>
  );
}

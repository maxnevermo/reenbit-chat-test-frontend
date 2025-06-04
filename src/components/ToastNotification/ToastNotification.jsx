import { useState } from "react";
import styles from "./ToastNotification.module.css";

export default function ToastNotification({
  message,
  closeToast,
  onToastClick,
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      closeToast();
    }, 300);
  };

  const handleClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onToastClick) {
        onToastClick(message);
      }
      closeToast();
    }, 300);
  };

  return (
    <li>
      <button
        type="button"
        className={`${styles["toast-notification"]} ${styles["new-message"]} ${
          isClosing ? styles.closing : ""
        }`}
        onClick={handleClick}
      >
        <div className={styles["toast-content"]}>
          <img
            src={message.sender.avatar}
            alt="Sender photo"
            className={styles["toast-avatar"]}
          />
          <div className={styles["toast-info"]}>
            <p className={styles["toast-sender"]}>
              {`${message.sender.firstName} ${message.sender.lastName}`}
            </p>
            <p className={styles["toast-message"]}>{message.text}</p>
          </div>
        </div>
        <button
          type="button"
          className={styles["toast-close"]}
          onClick={handleClose}
          aria-label="Закрити сповіщення"
        >
          ×
        </button>
      </button>
    </li>
  );
}

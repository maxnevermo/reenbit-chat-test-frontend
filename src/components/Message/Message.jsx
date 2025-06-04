import { ReactSVG } from "react-svg";
import EditIcon from "../../assets/icons/edit.svg";

import styles from "./Message.module.css";

const formatMessageDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  const weekdayOptions = { weekday: "long" };
  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };

  if (diffDays === 0) {
    return date.toLocaleTimeString("uk-UA", timeOptions);
  }

  if (diffDays === 1) {
    const time = date.toLocaleTimeString("uk-UA", timeOptions);
    return `Учора, ${time}`;
  }

  if (diffDays < 7) {
    return date.toLocaleDateString("uk-UA", weekdayOptions);
  }

  return date.toLocaleDateString("uk-UA", dateOptions);
};

const highlightText = (text, searchQuery) => {
  if (!searchQuery || !searchQuery.trim()) {
    return text;
  }

  const regex = new RegExp(
    `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <mark key={index} className={styles["search-highlight"]}>
          {part}
        </mark>
      );
    }
    return part;
  });
};

export default function Message({
  user,
  message,
  onEditMessage,
  searchQuery,
  isSearchResult,
  isCurrentSearchResult,
}) {
  const isMyMessage = message.sender._id === user._id;

  return (
    <li
      id={`message-${message._id}`}
      className={`
        ${styles.message} 
        ${isMyMessage ? styles["my-message"] : ""} 
        ${isSearchResult ? styles["search-result"] : ""}
        ${isCurrentSearchResult ? styles["current-search-result"] : ""}
      `}
    >
      {!isMyMessage && (
        <img
          className={styles["chat-companion-avatar"]}
          src={message.sender.avatar}
          alt="Companion Avatar"
        />
      )}
      <div className={styles["message-container"]}>
        <p className={styles["message-text"]}>
          {highlightText(message.text, searchQuery)}
        </p>
        <p className={styles["message-sent-time"]}>
          {formatMessageDate(message.createdAt)}
        </p>
      </div>
      {isMyMessage && (
        <button
          onClick={() => onEditMessage(message.text, message._id)}
          className={styles["edit-message-button"]}
          type="button"
        >
          <ReactSVG src={EditIcon} />
        </button>
      )}
    </li>
  );
}

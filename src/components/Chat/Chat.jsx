import styles from "./Chat.module.css";
import SentIcon from "../../assets/icons/sent.svg";
import SeenIcon from "../../assets/icons/seen.svg";
import WaitingIcon from "../../assets/icons/waiting.svg";
import { ReactSVG } from "react-svg";

const getIconByStatus = (status) => {
  switch (status) {
    case "sent":
      return <ReactSVG style={{ fill: "#000000" }} src={SentIcon} />;
    case "seen":
      return <ReactSVG style={{ fill: "#000000" }} src={SeenIcon} />;
    case "waiting":
      return <ReactSVG style={{ fill: "#000000" }} src={WaitingIcon} />;
  }
};

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

export default function Chat({ currentUser, chat, onSelectChat }) {
  console.log(chat);

  const { avatar, firstName, lastName } = chat.members.find(
    (member) => member._id !== currentUser._id
  );

  const name = firstName + " " + lastName;

  return (
    <li className={styles.chat}>
      <button
        type="button"
        onClick={() => {
          onSelectChat(chat);
        }}
      >
        <div className={styles["chat-container"]}>
          <img
            className={styles["user-avatar"]}
            src={avatar}
            alt="User Avatar"
          />
          <div className={styles["chat-info"]}>
            <p className={styles["user-name"]}>{name}</p>
            <p className={styles["last-message"]}>
              {chat.lastMessage?.text || ""}
            </p>
            <p className={styles["message-info"]}>
              {chat.lastMessage.createdAt
                ? formatMessageDate(chat.lastMessage.createdAt)
                : ""}
            </p>
          </div>
        </div>
        <div className={styles["icon-container"]}>
          {["sent", "seen"].includes(chat.status) &&
            getIconByStatus(chat.status)}
        </div>
      </button>
    </li>
  );
}

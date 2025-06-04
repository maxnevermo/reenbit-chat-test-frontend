import ActionButton from "../ActionButton/ActionButton";
import styles from "./MessagesHeader.module.css";

export default function MessagesHeader({
  currentUser,
  onChatDelete,
  onChatEdit,
  chat,
  onSearchToggle,
  isSearchMode,
}) {
  const { avatar, firstName, lastName } = chat.members.find(
    (member) => member._id !== currentUser._id
  );

  const name = firstName + " " + lastName;

  return (
    <div className={styles["messages-header"]}>
      <div className={styles["companion-info"]}>
        <img
          className={styles["companion-avatar"]}
          src={avatar}
          alt="Companion avatar"
        />
        <p>{name}</p>
      </div>
      <div className={styles["chat-actions"]}>
        <ActionButton
          icon="search"
          actionFn={onSearchToggle}
          isActive={isSearchMode}
        />
        <ActionButton icon="edit" actionFn={() => onChatEdit(chat)} />
        <ActionButton icon="delete" actionFn={onChatDelete} />
      </div>
    </div>
  );
}

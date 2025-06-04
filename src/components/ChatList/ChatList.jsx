import Chat from "../Chat/Chat";
import styles from "./ChatList.module.css";
import ActionButton from "../ActionButton/ActionButton";
import { useState } from "react";
import ChatForm from "../ChatForm/ChatForm";

export default function ChatList({
  currentUser,
  chats,
  onCreateChat,
  onSelectChat,
  selectedChatId,
}) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateChat = (chat) => {
    onCreateChat(chat);
    handleCloseModal();
  };

  const handleChatSelect = (chat) => {
    // Очищаємо пошук при виборі чату (опціонально)
    // setSearchTerm("");
    onSelectChat(chat);
  };

  const filteredChats = chats?.filter((chat) => {
    if (!searchTerm.trim()) return true;

    const companion = chat.members.find((m) => m._id !== currentUser._id);
    const fullName =
      `${companion.firstName} ${companion.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles["chats-container"]}>
      <h1>Messages</h1>
      <div className={styles["chat-actions"]}>
        <input
          className={styles["chat-search"]}
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ActionButton icon="new" actionFn={handleOpenModal} />
      </div>

      {chats === null ? (
        <p>Завантаження чатів...</p>
      ) : filteredChats?.length > 0 ? (
        <ul className={styles["chat-list"]}>
          {filteredChats.map((chat) => (
            <Chat
              currentUser={currentUser}
              onSelectChat={handleChatSelect}
              key={chat._id}
              chat={chat}
              isSelected={chat._id === selectedChatId}
            />
          ))}
        </ul>
      ) : (
        <p>{searchTerm ? "Чатів не знайдено" : "Немає чатів"}</p>
      )}

      {showModal && (
        <ChatForm
          onSaveChat={handleCreateChat}
          onCloseChat={handleCloseModal}
        />
      )}
    </div>
  );
}

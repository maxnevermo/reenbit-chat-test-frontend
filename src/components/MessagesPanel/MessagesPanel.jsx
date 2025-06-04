import { useEffect, useRef, useState } from "react";
import MessagesHeader from "../MessagesHeader/MessagesHeader";
import MessageList from "../MessagesList/MessageList";
import ActionButton from "../ActionButton/ActionButton";
import socket from "../../socket";

import styles from "./MessagesPanel.module.css";
import Modal from "../Modal/Modal";

export default function MessagesPanel({
  currentUser,
  onChatDelete,
  onChatEdit,
  onNewMessage,
  chat,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chat.messagesHistory || []);

  const [isDeleting, setIsDeleting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);

  const modalRef = useRef(null);
  const messageListRef = useRef(null);

  const handleOpenDialog = () => {
    setIsDeleting(true);
  };

  const handleCloseDialog = () => {
    setIsDeleting(false);
  };

  useEffect(() => {
    if (chat?.messagesHistory) {
      setMessages(chat.messagesHistory);
    }
  }, [chat?.messagesHistory]);

  useEffect(() => {
    clearSearch();
  }, [chat?._id]);

  useEffect(() => {
    if (!chat?._id) return;

    socket.emit("joinChat", chat._id);

    const handleIncomingMessage = (newMessage) => {
      if (newMessage.chatId === chat._id) {
        setMessages((prev) => [...prev, newMessage]);
        onNewMessage?.(chat._id, newMessage);
      }
    };

    socket.on("receiveMessage", handleIncomingMessage);

    return () => {
      socket.off("receiveMessage", handleIncomingMessage);
    };
  }, [chat?._id]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }

    const results = messages
      .map((msg, index) => ({ ...msg, originalIndex: index }))
      .filter((msg) => msg.text.toLowerCase().includes(query.toLowerCase()));

    setSearchResults(results);
    setCurrentSearchIndex(results.length > 0 ? 0 : -1);
  };

  const navigateSearch = (direction) => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === "next") {
      newIndex =
        currentSearchIndex < searchResults.length - 1
          ? currentSearchIndex + 1
          : 0;
    } else {
      newIndex =
        currentSearchIndex > 0
          ? currentSearchIndex - 1
          : searchResults.length - 1;
    }

    setCurrentSearchIndex(newIndex);

    const messageId = searchResults[newIndex]._id;
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setCurrentSearchIndex(-1);
    setIsSearchMode(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (editMode && editingMessageId) {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${editingMessageId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === editingMessageId ? data.messageData : msg
        )
      );

      setMessage("");
      setEditMode(false);
      setEditingMessageId(null);

      return;
    }

    socket.emit("sendMessage", {
      chatId: chat._id,
      text: message,
      sender: currentUser._id,
    });

    setMessage("");
  };

  const startEditingMessage = (text, messageId) => {
    setMessage(text);
    setEditMode(true);
    setEditingMessageId(messageId);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${chat._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Помилка видалення чату");

      onChatDelete(chat._id);
      setIsDeleting(false);
    } catch (err) {
      alert("Не вдалося видалити чат");
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles["messages-panel-container"]}>
      <MessagesHeader
        currentUser={currentUser}
        onChatDelete={handleOpenDialog}
        onChatEdit={onChatEdit}
        chat={chat}
        onSearchToggle={() => setIsSearchMode(!isSearchMode)}
        isSearchMode={isSearchMode}
      />

      {isSearchMode && (
        <div className={styles["search-panel"]}>
          <div className={styles["search-input-container"]}>
            <input
              type="text"
              placeholder="Find a message..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles["search-input"]}
              autoFocus
            />
            <button
              onClick={clearSearch}
              className={styles["search-clear-btn"]}
            >
              ✕
            </button>
          </div>

          {searchQuery && (
            <div className={styles["search-controls"]}>
              <span className={styles["search-results-count"]}>
                {searchResults.length > 0
                  ? `${currentSearchIndex + 1} з ${searchResults.length}`
                  : "Нічого не знайдено"}
              </span>

              {searchResults.length > 0 && (
                <div className={styles["search-navigation"]}>
                  <button
                    onClick={() => navigateSearch("prev")}
                    className={styles["search-nav-btn"]}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => navigateSearch("next")}
                    className={styles["search-nav-btn"]}
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <MessageList
        ref={messageListRef}
        currentUser={currentUser}
        onEditMessage={startEditingMessage}
        chat={{ ...chat, messagesHistory: messages }}
        searchQuery={searchQuery}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
      />

      <div className={styles["send-message-container"]}>
        <input
          type="text"
          onChange={handleMessageChange}
          value={message}
          placeholder={
            editMode ? "Редагувати повідомлення..." : "Write a message..."
          }
        />
        <ActionButton
          actionFn={handleSendMessage}
          icon={editMode ? "check" : "send"}
        />
        {editMode && (
          <ActionButton
            actionFn={() => {
              setMessage("");
              setEditMode(false);
              setEditingMessageId(null);
            }}
            icon="cancel"
          />
        )}
      </div>

      {isDeleting && (
        <Modal
          ref={modalRef}
          onCancel={handleCloseDialog}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

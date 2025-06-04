import { useEffect, useState } from "react";
import MessagesPanel from "../../components/MessagesPanel/MessagesPanel";
import ChatList from "../../components/ChatList/ChatList";

import styles from "./Chats.module.css";
import User from "../../components/User/User";
import ChatForm from "../../components/ChatForm/ChatForm";
import ToastNotificationsList from "../../components/ToastNotificationsList/ToastNotificationsList";

const fakeNotifications = [
  {
    _id: "1",
    sender: {
      _id: "user1",
      firstName: "Олег",
      lastName: "Іванов",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    text: "Привіт! Як справи?",
    status: "sent",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    sender: {
      _id: "user2",
      firstName: "Анна",
      lastName: "Петренко",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    text: "Нова зустріч завтра о 10:00",
    status: "waiting",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    sender: {
      _id: "user3",
      firstName: "Ігор",
      lastName: "Сидоренко",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    text: "Файл надіслано.",
    status: "seen",
    createdAt: new Date().toISOString(),
  },
];

export default function ChatsPage() {
  const [chats, setChats] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChat, setEditingChat] = useState(null);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Не авторизований");

        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        console.error(err);
        window.location.href = "/";
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("заповнення");
    if (notifications.length === 0) {
      setNotifications(fakeNotifications);
    }
  }, [notifications]);

  console.log("привіт");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/chats", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Не вдалося завантажити чати");

        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser) {
      fetchChats();
    }
  }, [currentUser]);

  const handleChatSelect = async (chat) => {
    try {
      setSelectedChat(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${chat._id}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Помилка при завантаженні повідомлень");

      setSelectedChat({
        ...chat,
        messagesHistory: data.messages || [],
      });
    } catch (err) {
      console.error(err);
      alert("Не вдалося завантажити повідомлення");
    }
  };

  const handleCreateChat = (chat) => {
    setChats([...chats, chat]);
  };

  const handleChatDelete = (id) => {
    setChats((prevChats) => prevChats.filter((chat) => chat._id !== id));

    if (selectedChat?._id === id) {
      setSelectedChat(null);
    }
  };

  const handleChatEdit = (updatedChat) => {
    setChats((prev) =>
      prev.map((chat) => (chat._id === updatedChat._id ? updatedChat : chat))
    );

    if (selectedChat?._id === updatedChat._id) {
      setSelectedChat({
        ...updatedChat,
        messagesHistory: selectedChat.messagesHistory,
      });
    }
  };

  const openEditModal = (chat) => {
    const companion = chat.members.find((m) => m._id !== currentUser._id);
    setEditingChat({
      _id: chat._id,
      name: companion.firstName,
      surname: companion.lastName,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingChat(null);
    setShowEditModal(false);
  };

  const handleNewMessage = (chatId, message) => {
    console.log("handleNewMessage");
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId
          ? {
              ...chat,
              lastMessage: {
                sender: message.sender,
                text: message.text,
                createdAt: message.createdAt,
                status: message.status || "sent",
              },
            }
          : chat
      )
    );
  };

  if (!currentUser) return <div>Завантаження...</div>;

  return (
    <div className={styles["chats-page"]}>
      <div className={styles["side-info"]}>
        <User user={currentUser} />
        <ChatList
          currentUser={currentUser}
          chats={chats}
          onCreateChat={handleCreateChat}
          onSelectChat={handleChatSelect}
          selectedChatId={selectedChat?._id}
        />
      </div>
      {selectedChat && (
        <MessagesPanel
          key={selectedChat._id}
          currentUser={currentUser}
          onChatDelete={handleChatDelete}
          onChatEdit={openEditModal}
          chat={selectedChat}
          onNewMessage={handleNewMessage}
        />
      )}

      {showEditModal && editingChat && (
        <ChatForm
          initialData={editingChat}
          isEdit={true}
          onSaveChat={handleChatEdit}
          onCloseChat={closeEditModal}
        />
      )}

      {notifications.length > 0 && (
        <ToastNotificationsList notifications={fakeNotifications} />
      )}
    </div>
  );
}

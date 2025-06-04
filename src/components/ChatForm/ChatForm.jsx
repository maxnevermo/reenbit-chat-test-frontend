import { useState } from "react";
import FormInput from "../FormInput/FormInput";
import styles from "./ChatForm.module.css";

import ActionButton from "../ActionButton/ActionButton";

export default function ChatForm({
  onSaveChat,
  onCloseChat,
  initialData = {},
  isEdit = false,
}) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    surname: initialData.surname || "",
  });

  function handleChangeForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isEdit
      ? `${import.meta.env.VITE_API_URL}/api/chats/${initialData._id}`
      : `${import.meta.env.VITE_API_URL}/api/chats`;

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: form.name,
        lastName: form.surname,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      onSaveChat(data.chat);
      onCloseChat();
    } else {
      alert(data.message || "Помилка збереження чату");
    }
  };

  return (
    <div className={styles["chat-form-overlay"]}>
      <form className={styles["chat-form-container"]} onSubmit={handleSubmit}>
        <div className={styles["close-chat-button"]}>
          <ActionButton icon="close" actionFn={onCloseChat} />
        </div>
        <div className={styles["inputs-container"]}>
          <FormInput
            form={form}
            handleChange={handleChangeForm}
            label="Name"
            name="name"
          />
          <FormInput
            form={form}
            handleChange={handleChangeForm}
            label="Surname"
            name="surname"
          />
        </div>
        <button type="submit" className={styles["submit-button"]}>
          {isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

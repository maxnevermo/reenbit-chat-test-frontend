import { forwardRef } from "react";
import Message from "../Message/Message";

import styles from "./MessageList.module.css";

const MessageList = forwardRef(
  (
    {
      currentUser,
      onEditMessage,
      chat,
      searchQuery,
      searchResults,
      currentSearchIndex,
    },
    ref
  ) => {
    ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });

    return (
      <ul className={styles["messages-list"]} ref={ref}>
        {chat.messagesHistory.map((message) => {
          const isSearchResult = searchResults.some(
            (result) => result._id === message._id
          );
          const isCurrentSearchResult =
            searchResults[currentSearchIndex]?._id === message._id;

          return (
            <Message
              key={message._id}
              message={message}
              user={currentUser}
              onEditMessage={onEditMessage}
              searchQuery={searchQuery}
              isSearchResult={isSearchResult}
              isCurrentSearchResult={isCurrentSearchResult}
            />
          );
        })}
      </ul>
    );
  }
);

export default MessageList;
